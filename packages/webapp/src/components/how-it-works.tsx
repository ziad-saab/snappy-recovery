import { Box } from '@mui/material';

export const HowItWorks = () => {
  return (
    <Box sx={{ p: 2 }}>
      <h2>Why it's safe-ish?</h2>
      <ul>
        <li>The Snap code runs in a protected context inside the MetaMask extension</li>
        <li>The Snap code has access to private keys, but no internet access</li>
        <li>The Snap never exposes a sensitive private key to the Dapp (browser environment) unless it's encrypted</li>
        <li>The Snap code is installed from NPM and can be audited at all times</li>
      </ul>
      <h2>Why it's probably not so safe?</h2>
      <ul>
        <li>I have only a rudimentary cryptography training</li>
        <li>I built this alone, working late at night</li>
        <li>Nobody reviewed nor audited this code</li>
        <li>MetaMask Snaps are still a new feature in development</li>
      </ul>
      <h2>What does this mean?</h2>
      <p>USE ONLY WITH ON TEST NETWORKS AND WITH TEST MNEMONICS</p>
      <h2>How it works?</h2>
      <ol>
        <li>Connect to Metamask</li>
        <li>Accept the permission to manage your Ethereum private keys</li>
        <li>Find 5 friends with whom to split a secret backup key, send them to this site, and ask them for their Snappy Recovery public key (they have to login and click "View your public key")</li>
        <li>Enter the 5 public keys in the "Setup Recovery" section, and press "Setup"</li>
        <li>
          The Snappy Recovery Snap, working fully inside MetaMask's protected environment, will:
          <ol>
            <li>Grab your parent Ethereum node, used to generate all your accounts</li>
            <li>Create a brand new backup AES encryption key</li>
            <li>Use this backup key to symmetrically encrypt your Ethereum node</li>
            <li>Split the backup key using a 3-of-5 Shamir secret sharing scheme</li>
            <li>Encrypt each backup key part using one of your friends' public keys</li>
            <li>
              Return the encrypted Ethereum key + the 5 encrypted shards to this Dapp.
              This means that
              {' '}
              <strong>
                at no point will the Dapp be able to "see" your master Ethereum private key in the clear
              </strong>
            </li>
          </ol>
        </li>
        <li>Your encrypted Ethereum key + the 5 encrypted shards will be stored on <a href="https://gun.eco/docs">Gun</a>, a distributed peer-to-peer database </li>
        <li>All you have to do is save your Snappy Recovery public key ("View your public key" at the top) somewhere like your email or cloud storage</li>
        <li>
          If you lose your MetaMask wallet:
          <ol>
            <li>Reinstall MetaMask</li>
            <li>Come to this site and re-connect metamask, installing the Snap</li>
            <li>Login</li>
            <li>Press "Start Recovery"</li>
            <li>Enter your Snappy Recovery public key that you copied back when you had access to your wallet</li>
            <li>Press "Get recovery URL"</li>
            <li>You'll get a URL, share it with at least three of your five friends</li>
            <li>The recovery page will self-update as your friends follow the procedure on their side</li>
            <li>Once 3 of your friends have fulfilled their responsibility, press "Recover my ETH!"</li>
            <li>You'll see your old accounts appear, with their balances and transaction count</li>
            <li>
              To recover an account:
              <ol>
                <li>press "Show private key" next to the address</li>
                <li>Go to metamask's menu and choose "Import Account"</li>
                <li>Paste your private key to import your account</li>
                <li>Send your funds to an account from your current wallet</li>
              </ol>
            </li>
          </ol>
        </li>
      </ol>
    </Box>
  );
};
