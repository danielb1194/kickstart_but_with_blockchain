import web3 from './web3';
import campaignFactory from './build/campaignFactory.json';

const instance = new web3.eth.Contract(
  campaignFactory.abi,
  '0x41F9b4BA2871e04c311438Dd88aFe4dC62191ae5'
);

export default instance;
