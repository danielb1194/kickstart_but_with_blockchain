const path = require("path")
const solc = require("solc")
const fs = require("fs-extra")

const buildPath = (__dirname, "ethereum/build")
fs.removeSync(buildPath)

const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol")
const source = fs.readFileSync(campaignPath, 'utf8')

const input = {
  language: 'Solidity',
  sources: {
    'output': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['*'],
      },
    },
  },
}

const output = JSON.parse(solc.compile(JSON.stringify(input)))['contracts']['output']
fs.ensureDirSync(buildPath)

for (let contract in output) {
  console.log(contract)
  fs.outputJSONSync(
    path.resolve(buildPath, contract.replace(':', '') + '.json'),
    output[contract]
  )
}