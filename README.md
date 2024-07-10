# rns-using-rpc-api

Call RNS contracts using rpc api. 

See index.js file in this project.

# Reproduce Bug

Run the project using following commands

```bash
npm install
npm start 
# or
node index.js
```

# Bug Report

- RNS contract calls works fine with public node: https://public-node.rsk.co
- Run the index.js file in this project to reproduce the issue. 
- Using rpc api (https://rpc.testnet.rootstock.io/api_key) with RNS contracts is giving following errors:

```bash
Error: could not decode result data (value="0x", info={ "method": "resolver", "signature": "resolver(bytes32)" }, code=BAD_DATA, version=6.13.1)
 
code: 'BAD_DATA',
  value: '0x',
  info: { method: 'resolver', signature: 'resolver(bytes32)' },
  shortMessage: 'could not decode result data'
```

# NodeJs version
Used v20.12.2 in this project. Feel free to use node.js LTS version. 