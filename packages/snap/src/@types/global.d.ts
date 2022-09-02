import { SnapProvider } from '@metamask/snap-types';

declare global {
  const wallet: SnapProvider;
}
