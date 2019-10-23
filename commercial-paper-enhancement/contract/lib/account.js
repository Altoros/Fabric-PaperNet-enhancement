/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

class Account extends State {

    constructor(obj) {
        super(Account.getClass(), [obj.paperNumber, obj.owner]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
     */
    getOwner() {
        return this.owner;
    }

    getPaperNumber() {
        return this.paperNumber;
    }

    getQuantity() {
        return parseInt(this.quantity);
    }

    setQuantity(newQuantity) {
        this.quantity = newQuantity;
    }

    subQuantity(quantity) {
        this.quantity = this.getQuantity() - parseInt(quantity);
    }

    addQuantity(quantity) {
        this.quantity = this.getQuantity() + parseInt(quantity);
    }

    static fromBuffer(buffer) {
        return Account.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Account);
    }

    static createInstance(paperNumber, owner, quantity) {
        return new Account({paperNumber, owner, quantity});
    }

    static getClass() {
        return 'org.papernet.account';
    }
}

module.exports = Account;
