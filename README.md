# Sleepy Storage

## To Do
- Pay IPFS Node
- Display all photos for current account and display
- Find a way to check for proof
- Calculate amount to be paid?
- Store data redundantly across multiple hosts
- Periodically submit proof of their continued storage until contract expires
- Host is compensated for every proof they submit, penalized for missing proof

<!-- Start IPFS NODE -->
https://medium.com/@s_van_laar/deploy-a-private-ipfs-network-on-ubuntu-in-5-steps-5aad95f7261b
<!-- IPFS CORS -->
`ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"`

## Setup
Start Web Server: `npm start`
Start IPFS on BootNode: `sudo su; ipfs daemon`
Start IPFS on ClientNode: `sudo su; ipfs daemon`
Start Ganache `./ganache-2.5.4-linux-x86_64.AppImage`
When editing contract: `truffle compile --reset; truffle migrate --reset;`