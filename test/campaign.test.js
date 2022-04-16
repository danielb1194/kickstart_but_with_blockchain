const ganache = require('ganache')
const assert = require('assert')
const { beforeEach, it, describe } = require('mocha')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledCampaignFactory = require('../ethereum/build/campaignFactory.json')
const compiledCampaign = require('../ethereum/build/campaign.json')

let accounts, factory, campaignAddress, campaign

beforeEach( async () => {
  accounts = await web3.eth.getAccounts()

  factory = await new web3.eth.Contract(compiledCampaignFactory.abi)
    .deploy({ data: compiledCampaignFactory.evm.bytecode.object })
    .send({
      from: accounts[0],
      gas: 10000000
    })

  await factory.methods.createCampaign('100').send({ 
    from: accounts[0], gas: 10000000, value: 50000
  })

  const campaignAddresses = await factory.methods.getDeployedCampaigns().call() // .filter( c => c.address == accounts[0] )
  campaignAddress = campaignAddresses[0]
  campaign = await new web3.eth.Contract(
    compiledCampaign.abi,
    campaignAddress
  )
})

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address)
    assert.ok(campaign.options.address)
  })

  it('correctly marks the caller as the campaign manager', async () => {
    const manager = await campaign.methods.manager().call()
    assert.equal(manager, accounts[0])
  })
})
