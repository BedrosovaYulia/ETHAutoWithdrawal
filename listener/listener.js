require('dotenv').config();
const axios = require('axios');
const { Web3 } = require("web3");
const { Alchemy, Network, AlchemySubscription } = require("alchemy-sdk");

let provider = new Web3.providers.WebsocketProvider(process.env.ALCHEMY_WSS_URL);
let web3 = new Web3(provider);

console.log("Network:", Network.ETH_SEPOLIA);

const settings = {
    apiKey: process.env.ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

let wallets;
let addresses;

async function start() {

    let res = await axios.get('http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/api/wallets/');
    wallets = res.data;
    //console.log(wallets);

    addresses=[];

    for (wallet of wallets) {
        addresses.push(wallet.address);
    }

    console.log('Addresses:',addresses);

    console.log('Listening on transaction');
    // Subscription for Alchemy's pendingTransactions API
    alchemy.ws.on(
        {
            method: AlchemySubscription.PENDING_TRANSACTIONS,
            toAddress: addresses,
            hashesOnly: true
        },
        async (txHash) => {
            console.log(txHash);
            try {
                const tx = await web3.eth.getTransaction(txHash);

                console.log(tx);

                if (tx && tx.to) {

                    
                    let addressTo = '';
                    let privateKey = '';
                    let gasMultiplier = 1;

                    for (wallet of wallets) {
                        if (wallet.address.toLowerCase() === tx.to.toLowerCase()) {
                            addressTo = wallet.addressTo;
                            privateKey = wallet.privateKey;
                            gasMultiplier = wallet.gasMultiplier;
                        }
                    }

                    console.log({
                        address: tx.from,
                        value: web3.utils.fromWei(tx.value, 'ether'),
                        gasPrice: tx.gasPrice,
                        gas: tx.gas,
                        input: tx.input,
                        timestamp: new Date()
                    });

                    //auto withdraw
                    const new_tx = await web3.eth.accounts.signTransaction({
                        from: tx.to.toLowerCase(),
                        to: addressTo,
                        value: tx.value,
                        gasPrice: tx.gasPrice, //TODO: add multiplier
                        gas: tx.gas,
                    }, privateKey);

                    const receipt = await web3.eth.sendSignedTransaction(new_tx.rawTransaction);
                    console.error(receipt);

                }
            } catch (err) {
                console.error(err);
            }
        }
    );

}

/*setInterval( async () => {
    console.log("Timer!");
    let res = await axios.get('http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/api/wallets/');
    wallets = res.data;
    //console.log(wallets);
}, 5000);*/

start();




