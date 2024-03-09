require('dotenv').config();
const axios = require('axios');
const { Web3 } = require("web3");

let provider = new Web3.providers.WebsocketProvider(process.env.ALCHEMY_WSS_URL);
let web3 = new Web3(provider);

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
    //console.log(wallets);
    
    subscription = await web3.eth.subscribe('pendingTransactions');

    subscription.on('error', error =>
        console.log('Error when subscribing to pending transactions ', error),
    );

    subscription.on('data', async (txHash) => {
        console.log(txHash);
        try {
            const tx = await web3.eth.getTransaction(txHash);

            if (tx && tx.to && contains(wallets, tx.to.toLowerCase())) {

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
                    value: tx.value - tx.gasPrice * gasMultiplier * tx.gas,
                    gasPrice: tx.gasPrice * gasMultiplier,
                    gas: tx.gas,
                }, privateKey);

                const receipt = await web3.eth.sendSignedTransaction(new_tx.rawTransaction);
                console.error(receipt);
                
            }
        } catch (err) {
            console.error(err);
        }
    });
}

setInterval( async () => {
    console.log("Timer!");
    let res = await axios.get('http://' + process.env.API_HOST + ':' + process.env.API_PORT + '/api/wallets/');
    wallets = res.data;
    //console.log(wallets);
}, 5000);

start();




