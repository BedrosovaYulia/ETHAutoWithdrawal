require('dotenv').config();
const axios = require('axios');

const processing = async data => {
    //const checksPassed = await initialChecks(data);
    //if (!checksPassed) return false;
    console.log('checks passed', data);
}

async function start() {
    
    processing('');
    
}

axios.get('http://'+process.env.API_HOST+':'+process.env.API_PORT+'/api/wallets/')
  .then(res => {
    const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
    //console.log('Status Code:', res.status);
    //console.log('Date in Response header:', headerDate);

    const wallets = res.data;

    for(wallet of wallets) {
      console.log('Got wallet with address:', wallet.address);
    }

    start();

  })
  .catch(err => {
    console.log('Error: ', err.message);
  });




