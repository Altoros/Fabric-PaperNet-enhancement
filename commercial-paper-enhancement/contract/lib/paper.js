/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Utility class for ledger state
const State = require('../ledger-api/state.js');

// Enumerate commercial paper state values
const cpState = {
    OFFERED: 1,
    ISSUED: 2,
    TRADING: 3,
    REDEEMED: 4,
    CANCELED: 5
};

/**
 * CommercialPaper class extends State class
 * Class will be used by application and smart contract to define a paper
 */
class CommercialPaper extends State {

    constructor(obj) {
        super(CommercialPaper.getClass(), [obj.paperNumber]);
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

    getQuantity() {
        return parseInt(this.quantity);
    }

    /**
     * Useful methods to encapsulate commercial paper states
     */
    setOffered() {
        this.currentState = cpState.OFFERED;
    }

    setIssued(issueDateTime) {
        this.currentState = cpState.ISSUED;
        this.issueDateTime = issueDateTime;
    }

    setCanceled(cancelDateTime) {
        this.currentState = cpState.CANCELED;
        this.cancelDateTime = cancelDateTime;
    }

    setTrading() {
        this.currentState = cpState.TRADING;
    }

    setRedeemed() {
        this.currentState = cpState.REDEEMED;
    }

    isOffered() {
        return this.currentState === cpState.OFFERED;
    }

    isIssued() {
        return this.currentState === cpState.ISSUED;
    }

    isTrading() {
        return this.currentState === cpState.TRADING;
    }

    isRedeemed() {
        return this.currentState === cpState.REDEEMED;
    }

    isCanceled() {
        return this.currentState === cpState.CANCELED;
    }

    static fromBuffer(buffer) {
        return CommercialPaper.deserialize(buffer);
    }

    toBuffer() {
        return Buffer.from(JSON.stringify(this));
    }

    /**
     * Deserialize a state data to commercial paper
     * @param {Buffer} data to form back into the object
     */
    static deserialize(data) {
        return State.deserializeClass(data, CommercialPaper);
    }

    /**
     * Factory method to create a commercial paper object
     */
    static createInstance(issuer, paperNumber, issueDateTime, maturityDateTime, faceValue, quantity) {
        return new CommercialPaper({issuer, paperNumber, issueDateTime, maturityDateTime, faceValue, quantity});
    }

    static getClass() {
        return 'org.papernet.commercialpaper';
    }
}

module.exports = CommercialPaper;
