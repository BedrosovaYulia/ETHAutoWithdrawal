require('dotenv').config();


const process = async data => {
    //const checksPassed = await initialChecks(data);
    //if (!checksPassed) return false;
    console.log('checks passed', data);
}

async function start() {
    
    process('');
    
}

start()