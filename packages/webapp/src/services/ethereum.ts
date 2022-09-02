import { SNAPPY_RECOVERY_SNAP_ID } from 'utils/constants';

const getSnaps = async () => {
  if (typeof ethereum === 'undefined') {
    return {};
  }
  return ethereum.request({
    method: 'wallet_getSnaps',
  }) as Promise<Record<string, unknown>>;
};

export const isSnapInstalled = async (querySnapId: string) => {
  const snaps = await getSnaps();
  return Object.keys(snaps).some((snapId) => snapId === querySnapId);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).isSnap = isSnapInstalled;

export const connectToMetaMask = async () => {
  await ethereum.request({
    method: 'wallet_enable',
    params: [{
      wallet_snap: { [SNAPPY_RECOVERY_SNAP_ID]: {} },
    }],
  });
};
