/*
SPDX-License-Identifier: Apache-2.0
*/

'use strict';

// Bring key classes into scope, most importantly Fabric SDK network class
const fs = require('fs');
const yaml = require('js-yaml');
const { FileSystemWallet, Gateway } = require('fabric-network');
const Bid = require('../../../contract/lib/bid.js');

// A wallet stores a collection of identities for use
const wallet = new FileSystemWallet('../identity/user/ali/wallet');

// Main program function
async function main () {

    // A gateway defines the peers used to access Fabric networks
    const gateway = new Gateway();

    // Main try/catch block
    try {

        // Specify userName for network access
        const userName = 'User4@org1.example.com';

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/networkConnection.yaml', 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: false, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');

        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');

        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');

        const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

        // bid commercial paper
        console.log('Submit commercial paper bid transaction.');

        const response = await contract.submitTransaction('bid', '00001', 'HedgeMatic', '2020-05-31', '61900.9', '300');

        // process response
        console.log('Process bid transaction response.');

        let bid = Bid.fromBuffer(response);

        console.log(`${bid.bidder} bid for commercial paper ${bid.paperNumber}, price ${bid.price}, quantity ${bid.quantity}`);
        console.log('Transaction complete.');

    } catch (error) {

        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

    } finally {

        // Disconnect from the gateway
        console.log('Disconnect from Fabric gateway.');
        gateway.disconnect();

    }
}
main().then(() => {

    console.log('Bid program complete.');

}).catch((e) => {

    console.log('Bid program exception.');
    console.log(e);
    console.log(e.stack);
    process.exit(-1);

});