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
let subscription;

function contains(wallets, elem) {
    for (wallet of wallets) {
        if (wallet.address === elem) {
            return true;
        }
    }
    return false;
}

async function start() {

    let res = await axios.get('http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/api/wallets/');
    wallets = res.data;
    console.log(wallets);

    console.log('Listening on transaction');
    // Subscription for Alchemy's pendingTransactions API
    alchemy.ws.on(
        {
            method: AlchemySubscription.PENDING_TRANSACTIONS,
            toAddress: ['0x7ea24F4D352cB352926A95820ea2D935b139161b', '0x39b3255e76Af969372DE43A3C8f1e4A86Ce42B95'],
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
                        if (wallet.address === tx.to.toLowerCase()) {
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
                        to: addressTo,
                        value: tx.value,
                        gasPrice: tx.gasPrice,
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

    /*
    
    subscription = await web3.eth.subscribe('pendingTransactions');

    subscription.on('error', error =>
        console.log('Error when subscribing to pending transactions ', error),
    );

    subscription.on('data', async (txHash) => {
        //console.log(txHash);
        
    });*/
}

/*setInterval( async () => {
    console.log("Timer!");
    let res = await axios.get('http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/api/wallets/');
    wallets = res.data;
    //console.log(wallets);
}, 5000);*/

start();




