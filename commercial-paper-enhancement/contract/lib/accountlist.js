/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for collections of ledger states --  a state list
const StateList = require('../ledger-api/statelist.js');

const Account = require('./account.js');

class AccountList extends StateList {

    constructor(ctx) {
        super(ctx, 'org.papernet.accountlist');
        this.use(Account);
    }

    async addAccount(account) {
        return this.addState(account);
    }

    async getAccount(accountKey) {
        return this.getState(accountKey);
    }

    async updateAccount(account) {
        return this.updateState(account);
    }

    async getAccountsByPaper(paperNumber) {
        return this.getStatesByPartialKey([paperNumber]);
    }
}


module.exports = AccountList;
