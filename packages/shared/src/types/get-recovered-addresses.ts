import { AesEncryptedData, EncryptedBackupKeypairPart } from './crypto';

export interface GetRecoveredAddressesParams {
  encryptedEthereumNode: AesEncryptedData;
  encryptedBackupKeypairParts: EncryptedBackupKeypairPart[];
}

export interface RecoveredAddressIndices {
  accountIndex: number;
  addressIndex: number;
}

export interface RecoveredAddress extends RecoveredAddressIndices {
  address: string;
  balanceInEth: string;
  numTransactions: number;
}

export interface GetRecoveredAddressesResult {
  recoveredAddresses: RecoveredAddress[];
}
