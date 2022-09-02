import { MetaMaskInpageProvider } from '@metamask/providers'

declare global {
  const ethereum: MetaMaskInpageProvider;
}