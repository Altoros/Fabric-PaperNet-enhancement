/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const Bid = require('./bid.js');

class BidList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.bidlist');
        this.use(Bid);
    }

    async addBid(bid) {
        return this.addState(bid);
    }

    async getBid(bidKey) {
        return this.getState(bidKey);
    }

    async updateBid(bid) {
        return this.updateState(bid);
    }

    async getBidsByPaper(paperNumber) {
        return this.getStatesByPartialKey([paperNumber]);
    }
}


module.exports = BidList;
