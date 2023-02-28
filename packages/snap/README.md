# 💥 Snappy Recovery

Social Recovery for MetaMask wallets using "Snaps", sandboxed JS plugins for MetaMask.

## Why it's safe-ish?
* The Snap code runs in a **sandboxed environment** inside the MetaMask extension
* The Snap code has access to private keys, but no internet access -- it doesn't request that permission
* The Snap never exposes a sensitive private key to the Dapp (browser environment) unless it's encrypted
* The Snap code is installed from NPM and can be audited at all times

## Why it's probably not so safe?
* I have only a rudimentary cryptography training
* I built this alone, working late at night
* Nobody reviewed nor audited this code
* MetaMask Snaps are still a new feature in development

## What does this mean?
⚠️ **USE ONLY WITH ON TEST NETWORKS AND WITH TEST MNEMONICS**

## How it works?

### Setup the social recovery
1. Connect to MetaMask
1. Accept the permission to manage your Ethereum private keys
1. Go to your profile and copy your Snappy Recovery public key, save it somewhere. It's public data, harmless to save it in the clear.
1. Find 5 friends with whom to split a secret backup key, send them to Snappy Recovery, and ask them for their Snappy Recovery public key (they have to login and go to their profile)
1. Enter the 5 public keys in the "Setup Recovery" section, and press "Setup"
1. The Snappy Recovery Snap, working fully inside MetaMask's sandboxed environment, will:
  1. Grab your parent Ethereum node, used to generate all your accounts
  1. Create a brand new backup AES encryption key
  1. Use this backup key to symmetrically encrypt your Ethereum node
  1. Split the backup key using a 3-of-5 Shamir secret sharing scheme
  1. Encrypt each backup key part using one of your friends' public keys
  1. Return the encrypted Ethereum key + the 5 encrypted shards to this Dapp. This means that at no point will the Dapp be able to "see" your master Ethereum private key in the clear
1. Your encrypted Ethereum key + the 5 encrypted shards will be stored on Gun, a distributed peer-to-peer database
1. All you have to do is save your Snappy Recovery public key ("View your public key" at the top) somewhere like your email or cloud storage

### Recover your wallet / funds
1. Reinstall MetaMask
1. Go to Snappy Recovery and connect metamask, installing the Snap
1. Press "I lost my private key!"
1. Enter your Snappy Recovery public key that you copied back when you had access to your wallet
1. Press "Get recovery URL"
1. You'll get a URL, share it with at least three of your five friends
1. The recovery page will self-update as your friends follow the procedure on their side -- they just have to click a button
1. Once 3 of your friends have fulfilled their responsibility, press "Recover my ETH!"
1. After a few seconds, you'll see your old accounts appear, with their balances and transaction count
1. To recover an account:
  1. Press "Show private key" next to the address
  1. Go to MetaMask's menu and choose "Import Account"
  1. Paste your private key to import your account
  1. Send your funds to a non-imported account from your current wallet