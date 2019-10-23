/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Fabric smart contract classes
const {Contract, Context} = require('fabric-contract-api');

// PaperNet specifc classes
const CommercialPaper = require('./paper.js');
const Bid = require('./bid.js');
const Account = require('./account.js');
const PaperList = require('./paperlist.js');
const BidList = require('./bidlist.js');
const AccountList = require('./accountlist.js');

/**
 * A custom context provides easy access to list of all commercial papers
 */
class CommercialPaperContext extends Context {

    constructor() {
        super();
        // All papers are held in a list of papers
        this.paperList = new PaperList(this);

        this.bidList = new BidList(this);
        this.accountList = new AccountList(this);
    }

}

/**
 * Define commercial paper smart contract by extending Fabric Contract class
 *
 */
class CommercialPaperContract extends Contract {

    constructor() {
        // Unique name when multiple contracts per chaincode file
        super('org.papernet.commercialpaper');
    }

    /**
     * Define a custom context for commercial paper
     */
    createContext() {
        return new CommercialPaperContext();
    }

    /**
     * Instantiate to perform any setup of the ledger that might be required.
     * @param {Context} ctx the transaction context
     */
    async instantiate(ctx) {
        // No implementation required with this example
        // It could be where data migration is performed, if necessary
        console.log('Instantiate the contract');
    }

    async offer(ctx, issuer, paperNumber, issueDateTime, maturityDateTime, faceValue, quantity) {

        // create an instance of the paper
        let paper = CommercialPaper.createInstance(issuer, paperNumber, issueDateTime, maturityDateTime, faceValue, quantity);

        paper.setOffered();

        // Add the paper to the list of all similar commercial papers in the ledger world state
        await ctx.paperList.addPaper(paper);

        // Must return a serialized paper to caller of smart contract
        return paper;
    }

    async bid(ctx, paperNumber, bidder, bidDateTime, price, quantity) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        if (!paper.isOffered()) {
            throw new Error('Paper ' + paperNumber + ' is not in OFFERED state. Current state = ' + paper.getCurrentState());
        }

        let bid = Bid.createInstance(paperNumber, bidder, bidDateTime, price, quantity);

        await ctx.bidList.addBid(bid);

        return bid;
    }

    async issue(ctx, paperNumber, issueDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        if (!paper.isOffered()) {
            throw new Error('Paper ' + paperNumber + ' is not in OFFERED state. Current state = ' + paper.getCurrentState());
        }

        // Smart contract, rather than paper, moves paper into ISSUED state
        paper.setIssued(issueDateTime);
        await ctx.paperList.updatePaper(paper);

        // Get all bids for current paper
        let bids = await ctx.bidList.getBidsByPaper(paperNumber);

        // Sort bids by price descendent
        bids.sort((a, b) => b.price - a.price);

        // Collect required quantity bid by bid
        let needQuantity = paper.getQuantity();

        let accounts = new Map();
        let finalPrice = 0;

        bids.forEach(bid => {
            if (needQuantity <= 0) return;

            let bidQuantity = bid.getQuantity();

            let accountQuantity;
            if (bidQuantity <= needQuantity) {
                accountQuantity = bidQuantity;
            } else {
                accountQuantity = needQuantity;
            }

            needQuantity -= accountQuantity;

            if (accounts.has(bid.bidder)) {
                // Add balance to account
                let account = accounts.get(bid.bidder);
                account.quantity += accountQuantity;
                accounts.set(bid.bidder, account);
            } else {
                // Create accounts with balance
                let account = Account.createInstance(paperNumber, bid.bidder, accountQuantity);
                accounts.set(bid.bidder, account);
            }

            finalPrice = bid.price;
        });

        // Save accounts
        let accountsArray = [];
        for (const account of accounts.values()) {
            await ctx.accountList.addAccount(account);
            accountsArray.push(account);
        }

        return {accounts: accountsArray, finalPrice};
    }

    async cancel(ctx, paperNumber, cancelDateTime) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        if (!paper.isOffered()) {
            throw new Error('Paper ' + paperNumber + ' is not in OFFERED state. Current state = ' + paper.getCurrentState());
        }

        paper.setCanceled(cancelDateTime);

        await ctx.paperList.updatePaper(paper);

        return paper;
    }

    async buy(ctx, paperNumber, currentOwner, newOwner, purchaseDateTime, price, quantity) {

        // Retrieve the current paper using key fields provided
        let paperKey = CommercialPaper.makeKey([paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        // First buy moves state from ISSUED to TRADING
        if (paper.isIssued()) {
            paper.setTrading();
            await ctx.paperList.updatePaper(paper);
        }

        if (!paper.isTrading()) {
            throw new Error('Paper ' + paperNumber + ' is not trading. Current state = ' + paper.getCurrentState());
        }

        let sellerAccountKey = Account.makeKey([paperNumber, currentOwner]);
        let sellerAccount = await ctx.accountList.getAccount(sellerAccountKey);

        let buyerAccountKey = Account.makeKey([paperNumber, newOwner]);
        let buyerAccount = await ctx.accountList.getAccount(buyerAccountKey);

        quantity = parseInt(quantity);

        if (sellerAccount.getQuantity() < quantity) {
            throw new Error('Seller ' + currentOwner + ' does not have enough papers');
        }

        if (!buyerAccount) {
            buyerAccount = Account.createInstance(newOwner, paperNumber, 0);
        }

        sellerAccount.subQuantity(quantity);
        buyerAccount.addQuantity(quantity);

        await ctx.accountList.updateAccount(sellerAccount);
        await ctx.accountList.updateAccount(buyerAccount);

        return {paper, quantity, sellerAccount, buyerAccount}
    }

    async redeem(ctx, paperNumber, redeemerOwner, redeemDateTime, quantity) {

        let paperKey = CommercialPaper.makeKey([paperNumber]);
        let paper = await ctx.paperList.getPaper(paperKey);

        let redeemerAccountKey = Account.makeKey([paperNumber, redeemerOwner]);
        let redeemerAccount = await ctx.accountList.getAccount(redeemerAccountKey);

        let issuerAccountKey = Account.makeKey([paperNumber, paper.getIssuer()]);
        let issuerAccount = await ctx.accountList.getAccount(issuerAccountKey);

        quantity = parseInt(quantity);

        if (redeemerAccount.getQuantity() < quantity) {
            throw new Error(redeemerOwner + ' does not have enough papers');
        }

        if (!issuerAccount) {
            issuerAccount = Account.createInstance(paperNumber, paper.getIssuer(), 0);
        }

        redeemerAccount.subQuantity(quantity);
        issuerAccount.addQuantity(quantity);

        await ctx.accountList.updateAccount(redeemerAccount);
        await ctx.accountList.updateAccount(issuerAccount);

        return {paper, quantity, redeemerAccount, issuerAccount};
    }

    async listBids(ctx, paperNumber) {

        // Get all bids for current paper
        return await ctx.bidList.getBidsByPaper(paperNumber);
    }

    async listAccounts(ctx, paperNumber) {

        // Get all accounts for current paper
        return await ctx.accountList.getAccountsByPaper(paperNumber);
    }

}

module.exports = CommercialPaperContract;
