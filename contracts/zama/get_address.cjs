const { mnemonicToAccount } = require('../../node_modules/viem/accounts');
const account = mnemonicToAccount('afraid behave yard gospel amateur dad observe hip antique sea heart cliff');
console.log('ZAMA_DEPLOYER_ADDRESS:', account.address);
