/* eslint-disable @typescript-eslint/no-explicit-any */
import { AesEncryptedData, EncryptedBackupKeypairPart } from '@snappy-recovery/shared';
import Gun from 'gun';
import 'gun/sea';
import 'gun/lib/then';
import 'gun/lib/webrtc';

type GunUserSchema = {
  recoveryPartsByPublicKey: {
    [publicKey: string]: EncryptedBackupKeypairPart;
  };
  encryptedEthereumNode: AesEncryptedData;
  backupPublicKeyHex: string;
};

type GunPublicSchema = {
  snappyRecoveries: {
    [recoveryKey: string]: {
      [friendKey: string]: EncryptedBackupKeypairPart;
    }
  }
};

export const gun = Gun<GunPublicSchema>('https://snappy-recovery-gun-relay.herokuapp.com/gun');
export const user = gun.user<GunUserSchema>();

// Data chains
export const userData = <T extends keyof GunUserSchema>(key: T, pubKey?: string) => {
  if (pubKey) {
    return gun.user<GunUserSchema>(pubKey).get(key);
  }
  return user.get(key);
};

// export const gunData;
export const gunData = <T extends keyof GunPublicSchema>(key: T) => {
  return gun.get(key);
};

(window as any).gun = gun;
(window as any).user = user;
