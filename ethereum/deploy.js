const wallet = require('@truffle/hdwallet-provider');
const compiledCampaignFactory = require('./build/campaignFactory.json'); // Address @ Rinkeby: 0x52F78fFEe162Ba8956B8a603b1D5A7C3e12Da04A

const Web3 = require('web3');
require('dotenv').config();

// get a new provider. Since we are connecting to Rinkeby test network, the provider is actually a wallet.
// we need to provide the secret phrase to access the wallet we are going to be using for testing.
const provider = new wallet(
  process.env.SECRET_PHRASE,
  process.env.INFURA_API_KEY
);
// create a new web3 instance with the newly created provider
const web3 = new Web3(provider);

const deploy = async function () {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const contract = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object })
    .send({ from: accounts[0], gas: 20000000 });

  console.log('contract deployed to:\n', contract.options.address);
  console.log(
    'contract interface\n',
    JSON.stringify(compiledCampaignFactory.abi)
  ); // It is KEY that when using the ABI to create an interface we use the STRINGIFIED version.
  provider.engine.stop();
};
deploy();

// Campaign Factory interface:
// [{"inputs":[{"internalType":"uint256","name":"minimumContribution","type":"uint256"}],"name":"createCampaign","outputs":[],"stateMutability":"payable","type":"function","payable":true,"signature":"0xa3303a75"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"deployedCampaigns","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x339d50a5"},{"inputs":[],"name":"getDeployedCampaigns","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function","constant":true,"signature":"0x4acb9d4f"}]
