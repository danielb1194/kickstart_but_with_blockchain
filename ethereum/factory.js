import web3 from './web3';
import campaignFactory from './build/campaignFactory.json';

const instance = new web3.eth.Contract(
  campaignFactory.abi,
  '0x34a2608375c3E9b43c4Ee2B47d24e2330e8CeeDE'
);

export default instance;
