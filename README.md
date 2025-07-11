# 🧾 Freelancia Client — Blockchain Escrow dApp

This is the **client-side React application** for the Freelancia project — a decentralized freelancing platform built on the **Solana blockchain** using the **Anchor framework**.

The app allows users to simulate freelance work escrow flows by connecting their **Phantom Wallet**, creating and viewing escrow contracts, submitting deliverables, and approving completed work.

---

## 🚀 Features

- 🔐 **Phantom Wallet Integration** – Users can connect their Solana wallet to the app.
- 🪙 **Wallet Balance Display** – Shows the connected wallet’s balance in SOL.
- 🧾 **Escrow Creation** – Button interface to create new escrow contracts.
- 📋 **Escrow Viewer** – Displays all escrows associated with the user (either as maker or taker).
- 📤 **Submit Work** – Taker can submit the work/deliverable hash for review.
- ✅ **Approve Work** – Maker can approve submitted work and release funds to the taker.
- 💡 Built with **Anchor framework** and simulates real smart contract logic on the devnet/testnet.

---

## 🛠️ Tech Stack

- ⚛️ React + TypeScript
- 💼 [@coral-xyz/anchor](https://github.com/coral-xyz/anchor) for interacting with Solana smart contracts
- 🦄 [@solana/wallet-adapter](https://github.com/solana-labs/wallet-adapter) for Phantom Wallet integration
- 💅 TailwindCSS for styling
- 🌐 Solana Devnet/Testnet for simulation

---



## ⚙️ Setup Instructions

1. **Clone the Repository**

```bash
git clone https://github.com/timus999/freelancia-client.git
cd freelancia-client
```

2. **Install Dependencies**
```bash
yarn install
# or
npm install
```

3. **Import Anchor IDL**

4. **Start the Development Server**
```bash
yarn dev
# or
npm run dev
```