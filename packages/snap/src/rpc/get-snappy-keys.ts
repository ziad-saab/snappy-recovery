import { deriveBIP44AddressKey } from '@metamask/key-tree';
import { GetSnappyKeysResult } from '@snappy-recovery/shared';
import { DUMMY_ACCOUNT_NUMBERS } from '../utils/constants';
import { getParentEthereumNode, p256JwkFromPrivateKey } from '../utils/keys';

const getKeysForGunEncryption = (privateKeyHex: string) => {
  const jwkKey = p256JwkFromPrivateKey(privateKeyHex);

  return {
    epub: `${jwkKey.x}.${jwkKey.y}`,
    epriv: jwkKey.d,
  };
};

const getKeysForGunSigning = (privateKeyHex: string) => {
  const jwkKey = p256JwkFromPrivateKey(privateKeyHex);

  return {
    pub: `${jwkKey.x}.${jwkKey.y}`,
    priv: jwkKey.d,
  };
};

export const getSnappyBackupKey = async () => {
  const parentEthereumNode = await getParentEthereumNode();
  return deriveBIP44AddressKey(parentEthereumNode, {
    account: DUMMY_ACCOUNT_NUMBERS.snappyBackup,
    change: 0,
    address_index: 0,
  });
};

export const getSnappyKeys = async (): Promise<GetSnappyKeysResult> => {
  const parentEthereumNode = await getParentEthereumNode();

  /**
   * Derive "dummy" addresses. Their private keys will be used to create a Gun database user
   */
  const gunEncryptionKey = await deriveBIP44AddressKey(parentEthereumNode, {
    account: DUMMY_ACCOUNT_NUMBERS.gunEncryption,
    change: 0,
    address_index: 0,
  });

  const gunSigningKey = await deriveBIP44AddressKey(parentEthereumNode, {
    account: DUMMY_ACCOUNT_NUMBERS.gunSigning,
    change: 0,
    address_index: 0,
  });

  const backupKey = await getSnappyBackupKey();

  return {
    gun: {
      ...getKeysForGunEncryption(gunEncryptionKey.privateKey!),
      ...getKeysForGunSigning(gunSigningKey.privateKey!),
      identiconAddress: gunSigningKey.address,
    },
    backupPublicKeyHex: backupKey.publicKey.toString(),
  };
};
