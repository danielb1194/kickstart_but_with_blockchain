import web3 from './web3';
import campaign from './build/campaign.json';

export default (address) => {
  return new web3.eth.Contract(campaign.abi, address);
};
