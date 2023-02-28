/**
 * Detect if the wallet injecting the ethereum object is Flask.
 *
 * @returns True if the MetaMask version is Flask, false otherwise.
 */
import { GetSnapsResponse, Snap } from 'types';
import { SNAPPY_RECOVERY_SNAP_ID } from './constants';

export const isFlask = async () => {
  const provider = window.ethereum;

  try {
    const clientVersion = await provider?.request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    return Boolean(provider && isFlaskDetected);
  } catch {
    return false;
  }
};

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.

 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = SNAPPY_RECOVERY_SNAP_ID,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_requestSnaps',
    params: {
      [snapId]: params,
    },
  });
};

/**
 * Get the snap from MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns The snap object returned by the extension.
 */
export const getSnap = async (version?: string): Promise<Snap | undefined> => {
  try {
    const snaps = await getSnaps();

    return Object.values(snaps).find(
      (snap) => snap.id === SNAPPY_RECOVERY_SNAP_ID && (!version || snap.version === version),
    );
  } catch (e) {
    console.log('Failed to obtain installed snap', e);
    return undefined;
  }
};

export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
