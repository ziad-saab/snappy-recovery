import { deriveBIP44AddressKey } from '@metamask/key-tree';
import { GetRecoveryPublicKeyResult } from '@snappy-recovery/shared';
import { DUMMY_ACCOUNT_NUMBERS } from '../utils/constants';
import { getParentEthereumNode } from '../utils/keys';

export const getRecoveryKey = async () => {
  const parentEthereumNode = await getParentEthereumNode();
  return deriveBIP44AddressKey(parentEthereumNode, {
    account: DUMMY_ACCOUNT_NUMBERS.snappyRecovery,
    change: 0,
    address_index: 0,
  });
};

export const getRecoveryPublicKey = async (): Promise<GetRecoveryPublicKeyResult> => {
  const { publicKey } = await getRecoveryKey();
  return { publicKeyHex: publicKey };
};
