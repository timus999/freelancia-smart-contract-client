# 🧾 Freelancia Client — Blockchain Escrow dApp

This is the **client-side React application** for the Freelancia project — a decentralized freelancing platform built on the **Solana blockchain** using the **Anchor framework**.

The app allows users to simulate freelance work escrow flows by connecting their **Phantom Wallet**, creating and viewing escrow contracts, submitting deliverables, and approving completed work.

---

## 🚀 Features

- 🔐 **Phantom Wallet Integration**  
  Users can connect their Solana wallet securely to the application.

- 🪙 **Wallet Balance Display**  
  Real-time display of the connected wallet’s balance in SOL.

- 🧾 **Escrow Creation**  
  Users can create new escrow contracts that lock funds into a program-controlled vault. Each escrow includes a deadline, auto-release time, and optional arbiter.

- 📋 **Escrow Viewer**  
  Dynamically lists all escrows associated with the connected wallet, including their current status and actionable options.

- 📤 **Submit Work**  
  The taker (freelancer) can submit deliverables by providing a hashed representation of their work.

- ✅ **Approve Work**  
  The maker (client) can review the submitted deliverable and approve the escrow. Funds are transferred to the taker upon approval.

- 🔁 **Request Revision**  
  If the maker is not satisfied with the submission, they can request a revision. This sets the escrow status back to **Active**, allowing the taker to revise and resubmit.

- 🚩 **Raise Dispute**  
  Either party can raise a dispute if expectations are not met. This locks the escrow into a **Disputed** state and stores a hash pointing to off-chain evidence.

- ⚖️ **Dispute Resolver (Arbiter Resolution)**  
  A trusted arbiter (set at escrow creation) can resolve disputes by splitting the locked funds between the maker and taker in any proportion. A secure UI allows input of split amounts with optional auto-fill presets (e.g., 50/50) and confirmation modal.

- 🧪 **Testnet Simulation**  
  The app uses the Anchor framework and can be tested on Solana Devnet/Testnet for realistic simulations of smart contract behavior.


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