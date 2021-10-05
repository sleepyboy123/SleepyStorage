# Sleepy Storage

## To Do
- Find a way to check for proof
    - PoRep
    - PoST
- Calculate amount to be paid?
- Periodically submit proof of their continued storage until contsract expires
- Host is compensated for every proof they submit, penalized for missing proof

<!-- START IPFS NODE -->
https://medium.com/@s_van_laar/deploy-a-private-ipfs-network-on-ubuntu-in-5-steps-5aad95f7261b
<!-- IPFS CORS -->
`ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"`
<!-- IPFS EXAMPLES -->
https://docs.ipfs.io/concepts/usage-ideas-examples/
<!-- IPFS PRIVATE STAMP -->
https://github.com/mustafarefaey/private-stamp/blob/master/blockchain/contracts/PrivateStamp.sol
<!-- BLOCKCHAIN GAME -->
https://github.com/dappuniversity/blockchain_game

<!-- Proof of Storage -->
When a storage deal is agreed upon, miners must continuously prove that they are acting in good will by storing clients’ data. Filecoin’s consensus mechanisms play critical roles in removing third parties. In order to prove to the network that storage of data is occurring as outlined by the initiated deal between client and miner, Filecoin verifies storage data through “proof of replication” (PoRep) and ”proof of spacetime” (PoST). 

In PoRep, the storage provider generates a unique encoding of data, which is designed to occur slowly. After encoding, storage providers are challenged to prove that a unique encoding of data exists in the storage. And so, as the encoding sequence is designed to occur gradually, a swift response from the storage provider means that the data has been encoded and the client’s data is safely stored. However, if the storage provider fails to respond quickly, it would mean that the storage provider has generated a new encoding and is not acting in good faith. 

## Setup
Start Web Server: `npm start`
Start IPFS on BootNode: `sudo su; ipfs daemon`
Start IPFS on ClientNode: `sudo su; ipfs daemon`
Start Ganache `./ganache-2.5.4-linux-x86_64.AppImage`
When editing contract: `truffle compile --reset; truffle migrate --reset;`