# hardhat-template

Set up project:

```bash
yarn install
```

Commands:

```bash
yarn clean              #Clear cache.
yarn compile            #Compile smart-contract.

yarn coverage           #Coverage test.

yarn test               #Summary test.
yarn test:unit          #Unit test.
yarn test:integrate     #Integrate test.

yarn rpc                #Run hardhat node.

yarn deploy:localhost   #Run task deploy to localhost network.
yarn deploy:ganache     #Run task deploy to ganache network.
yarn deploy:ropsten     #Run task deploy to ropsten network.
yarn deploy:rinkeby     #Run task deploy to rinkeby network.
yarn deploy:mainnet     #Run task deploy to mainnet network.

yarn verify:ropsten     #Run task verify for ropsten network.
yarn verify:rinkeby     #Run task verify for rinkeby network.
yarn verify:mainnet     #Run task verify for mainnet network.
```

Verify smart-contract:

```bash
#should run `yarn clean` before run verify command.

yarn verify:ropsten ${YOUR_CONTRACT_ADDRESS}
yarn verify:rinkeby ${YOUR_CONTRACT_ADDRESS}
yarn verify:mainnet ${YOUR_CONTRACT_ADDRESS}
```