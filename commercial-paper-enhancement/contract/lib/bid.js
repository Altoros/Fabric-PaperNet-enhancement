/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

class Bid extends State {

    constructor(obj) {
        super(Bid.getClass(), [obj.paperNumber, obj.bidder, obj.price]);
        Object.assign(this, obj);
    }

    /**
     * Basic getters and setters
     */
    getIssuer() {
        return this.issuer;
    }

    setIssuer(newIssuer) {
        this.issuer = newIssuer;
    }

    getOwner() {
        return this.owner;
    }

    setOwner(newOwner) {
        this.owner = newOwner;
    }

    getQuantity() {
        return parseInt(this.quantity);
    }

    static fromBuffer(buffer) {
        return Bid.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    static deserialize(data) {
        return State.deserializeClass(data, Bid);
    }

    static createInstance(paperNumber, bidder, bidDateTime, price, quantity) {
        return new Bid({ paperNumber, bidder, bidDateTime, price, quantity });
    }

    static getClass() {
        return 'org.papernet.bid';
    }
}

module.exports = Bid;
