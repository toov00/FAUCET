# Faucet

A complete ERC-20 token and faucet ecosystem running on the Ethereum Sepolia testnet. Deploy, distribute, and interact with your custom token through a simple browser interface.

## Features

* Custom ERC-20 token deployment
* Faucet contract for token distribution
* One-click token claiming via web interface
* Rate-limited claims to prevent abuse
* Sepolia testnet integration

## Getting Started

### Prerequisites

* Node.js (v20+)
```sh
  brew install nvm
  nvm install 20
  nvm use 20
```
* MetaMask wallet with Sepolia ETH ([get free Sepolia ETH](https://sepoliafaucet.com))
* Alchemy or Infura account for RPC access

### Installation

1. Clone the repo
```sh
   git clone https://github.com/toov00/FAUCET.git
   cd FAUCET
```
2. Install dependencies
```sh
   npm install
```
3. Create environment file
```sh
   cp .env.example .env
```
4. Configure `.env` with your credentials
```env
   PRIVATE_KEY=your-wallet-private-key
   RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
```
   > ⚠️ Never commit your private key! Keep `.env` in `.gitignore`

## Usage

### 1. Deploy Contracts

Deploy the token and faucet to Sepolia:
```sh
npx hardhat run scripts/deploy.js --network sepolia
```

Save the outputted addresses:
```
Token deployed to: 0x...
Faucet deployed to: 0x...
```

### 2. Configure Frontend

Update `frontend/index.html` with your deployed addresses:
```js
const TOKEN_ADDRESS = '0x...';   // Your token address
const FAUCET_ADDRESS = '0x...';  // Your faucet address
```

### 3. Start the App
```sh
npx serve frontend
```

### 4. Claim Tokens

1. Navigate to `http://localhost:3000`
2. Connect your MetaMask wallet
3. Click "Claim Tokens" to receive free tokens!

![Faucet Interface](popupwindow2.png)

## Project Structure
```
FAUCET/
├── contracts/
│   ├── Token.sol          # ERC-20 token contract
│   └── Faucet.sol         # Faucet distribution contract
├── scripts/
│   └── deploy.js          # Deployment script
├── frontend/
│   └── index.html         # Web interface
├── hardhat.config.js
├── .env.example
└── package.json
```

## Smart Contracts

### Token.sol
Standard ERC-20 token with:
* Configurable name, symbol, and supply
* Minting capability for faucet

### Faucet.sol
Token distribution contract with:
* Claim cooldown period (prevents spam)
* Configurable claim amount
* Owner-only refill function

## Configuration

| Variable | Description | Example |
|----------|-------------|---------|
| `PRIVATE_KEY` | Deployer wallet private key | `abc123...` |
| `RPC_URL` | Sepolia RPC endpoint | `https://eth-sepolia.g.alchemy.com/v2/...` |
| `TOKEN_ADDRESS` | Deployed token address | `0x...` |
| `FAUCET_ADDRESS` | Deployed faucet address | `0x...` |

## Useful Commands

| Command | Description |
|---------|-------------|
| `npx hardhat compile` | Compile contracts |
| `npx hardhat test` | Run tests |
| `npx hardhat run scripts/deploy.js --network sepolia` | Deploy to Sepolia |
| `npx serve frontend` | Start frontend |

## Roadmap

- [x] ERC-20 token contract
- [x] Faucet contract with rate limiting
- [x] Web frontend for claiming
- [ ] Chrome Extension version
- [ ] Claim history display
- [ ] Multiple token support
- [ ] Admin dashboard for refilling faucet
- [ ] ENS integration

## Tech Stack

* Solidity
* Hardhat
* ethers.js
* HTML/CSS/JavaScript
* MetaMask SDK

## Resources

* [Sepolia Faucet](https://sepoliafaucet.com) — Get free testnet ETH
* [Alchemy](https://www.alchemy.com) — RPC provider
* [OpenZeppelin ERC-20](https://docs.openzeppelin.com/contracts/4.x/erc20) — Token standard reference

## License

Distributed under the MIT License. 
