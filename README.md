# Drug Traceability Blockchain

A proof-of-concept blockchain-based drug traceability project using Ethereum smart contracts and a simple front-end. The repository contains:

- `backend/` � Hardhat smart contract project with Solidity contracts, tests, artifacts, and deployment scripts.
- `front-end/` � Static front-end assets for interacting with the smart contracts.


## Demo Video 
Attached is a demo video of the POC 


https://github.com/user-attachments/assets/c6228a18-0f8b-43aa-ae4d-991757b4391a


## Backend

The backend is a Hardhat project implementing:

- `contracts/BatchNFT.sol` � Batch token contract for representing drug batches.
- `contracts/UnitNFT.sol` � Unit token contract for representing individual drug units.
- `contracts/Lock.sol` � Example contract for locking mechanism or additional logic.
- `contracts/SimpleStorage.sol` � Example smart contract for storage demonstration.

It uses OpenZeppelin contracts and Hardhat tooling.

### Setup

```powershell
cd backend
npm install
```

### Common commands

```powershell
cd backend
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.ts --network <network>
```

## Front-end

The front-end is a minimal static app with `index.html`, `script.js`, and `styles.css`.

To serve locally, use any static server or the built-in Live Server extension for VS Code.

## Notes

- This README is intentionally concise and focused on the repository structure.
- Add network and deployment details to `backend/scripts/deploy.ts` as needed for your environment.
