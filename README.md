# Decentralized Digital Ownership Platform

This project is a blockchain-based system for registering and managing ownership of digital assets. It allows creators to prove ownership of their work, verify it publicly, and transfer ownership securely using Ethereum.

The main idea is simple: instead of relying on centralized platforms, ownership records are stored on-chain, making them tamper-proof and verifiable by anyone.

---

## What this project does

* Registers digital assets using a file hash and IPFS CID
* Stores ownership data on the Ethereum blockchain
* Allows anyone to verify asset ownership
* Restricts ownership transfer to the current owner only

---

## Tech Stack

* Solidity (smart contract)
* Hardhat (development framework)
* Ethers.js (interaction with blockchain)
* Ethereum Sepolia testnet
* Node.js

---

## Project Structure

contracts/ → smart contract files
scripts/ → deployment scripts
hardhat.config.js → Hardhat configuration
.env.example → environment variables template

---

## Environment Variables

Create a `.env` file in the root directory and add:

SEPOLIA_RPC_URL=your_rpc_url
PRIVATE_KEY=your_wallet_private_key

Example:

SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_API_KEY
PRIVATE_KEY=0xabc123...

Do not upload your `.env` file to GitHub.

---

## How to run the project

### 1. Initialize the project

npm init -y

---

### 2. Install dependencies

npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install dotenv

---

### 3. Start Hardhat

npx hardhat

Select:
Create a JavaScript project

---

### 4. Add the smart contract

Create the file:

contracts/DigitalOwnership.sol

Paste the smart contract code into it.

---

### 5. Configure Hardhat

Update `hardhat.config.js`:

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
solidity: "0.8.19",
networks: {
sepolia: {
url: process.env.SEPOLIA_RPC_URL,
accounts: [process.env.PRIVATE_KEY],
},
},
};

---

### 6. Compile the contract

npx hardhat compile

---

### 7. Deploy to Sepolia

npx hardhat run scripts/deploy.js --network sepolia

After deployment, you will get a contract address. Save this address — it is required for interacting with the contract.

---

## Contract Functions

registerAsset(hash, cid, owner)
Registers a new asset on the blockchain.

getAsset(assetId)
Returns ownership and metadata of the asset.

transferOwnership(assetId, newOwner)
Transfers ownership to another address (only callable by the current owner).

---

## How the system works

1. A file is uploaded
2. A hash of the file is generated
3. The file is stored on IPFS (optional but recommended)
4. The hash and CID are registered on-chain
5. Ownership can be verified anytime
6. Ownership can be transferred securely

---

## Notes

* Only the contract owner can register new assets
* Only the asset owner can transfer ownership
* All ownership records are permanent and cannot be altered

---

## Future Improvements

* NFT-based ownership (ERC-721)
* Royalty system for creators
* Marketplace integration
* Better UI for asset management

---

## Author

Pradhumn Koshta
B.Tech CSE (Blockchain)

