const ganache = require('ganache')
const assert = require('assert')
const { beforeEach, it, describe } = require('mocha')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())

const compiledCampaignFactory = require('../ethereum/build/campaignFactory.json')
const compiledCampaign = require('../ethereum/build/campaign.json')
const { utils } = require('mocha')

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

  it('correctly marks backers', async () => {
    await campaign.methods.back().send({ from: accounts[1], value: 1000, gas: 1000000 })

    assert.ok(await campaign.methods.backers(accounts[1]).call())
  })

  it('correctly deploys requests', async () => {
    await campaign.methods.createRequest('This is a description', 100, accounts[0])
      .send({ from: accounts[0], gas: 1000000 })

    // get the request we just created and confirm that the creator is the manager
    const newRequest = campaign.methods.requests(0).call()
    // console.log(newRequest);
    assert(newRequest)
    
    try {
      // this should fail, if it doesnt, it means any user can create a request
      await campaign.methods.createRequest('This is a description', 100, accounts[0])
        .send({ from: accounts[2], gas: 1000000 })
      assert(false)
    } catch (err) {
      assert(err)
    }
  })

  it('requires a minimum contribution', async () => {
    try {
      await campaign.methods.back().send({ from: accounts[2], value: 0 })
      assert(false)
    } catch (err) {
      // console.log(err)
      assert(err)
    }
  })

  it('only allows backers vote on requests', async () => {
    await campaign.methods.createRequest('This is a description', 100, accounts[5])
      .send({ from: accounts[0], gas: 1000000 })
    // console.log(newRequest)
    try {
      await campaign.methods.approveRequest(0).call({ from: accounts[4] })
    } catch (err) {
      // console.log(err)
      assert(err)
    }

    // console.log('newRequest object:\n\n\n', newRequest)
    // now back the campaign with the same account
    await campaign.methods.back().send({from: accounts[4], value: 10000, gas: 1000000 })
    // and try to aprove the request (it should NOT fail now)
    try {
      await campaign.methods.approveRequest(0).send({ from: accounts[4], gas: 1000000 })
    } catch (err) {
      // console.log(err)
      assert(false)
    }

    // console.log('oldRequest object:\n\n\n', newRequest)
    const newRequest = await campaign.methods.requests(0).call()
    const backersArr = await campaign.methods.getBackers().call()
    // console.log('##############\n\n', newRequest)
    // console.log('##############\n\n', backersArr)

    assert(newRequest.approvers > backersArr.length / 2)
  })

  it('processes requests', async () => {
    await campaign.methods.back().send({ from: accounts[0], value: web3.utils.toWei('1', 'ether'), gas: 1000000 })
    // console.log('backed campaign')

    await campaign.methods.createRequest('buy batteries', web3.utils.toWei('.5', 'ether'), accounts[5])
      .send({ from: accounts[0], gas: 1000000 })
      // console.log('created request')

    await campaign.methods.approveRequest(0).send({ from: accounts[0], gas: 1000000 })
    // console.log('voted on the request')

    const balanceBefore = await web3.eth.getBalance(accounts[5])
    await campaign.methods.finalizeRequest(0).send({ from: accounts[0], gas: 1000000 })
    const balanceAfter = await web3.eth.getBalance(accounts[5])
    // console.log('finalized the request.\nBalance Before:\n', balanceBefore, '\nBalance after:\n', balanceAfter)

    assert(parseFloat(balanceBefore) < parseFloat(balanceAfter))
  })
})
