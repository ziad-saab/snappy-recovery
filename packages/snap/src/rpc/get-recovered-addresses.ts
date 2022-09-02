import { deriveBIP44AddressKey, JsonBIP44CoinTypeNode } from '@metamask/key-tree';
import {
  GetRecoveredAddressesParams, GetRecoveredAddressesResult, RecoveredAddress, RECOVERY_THRESHOLD_PARTS, RECOVERY_TOTAL_PARTS,
} from '@snappy-recovery/shared';
import { BN } from 'bn.js';
import { decryptWithPrivateKey } from 'eth-crypto';
import * as secrets from 'secrets.js-grempe';
import { fromWei } from 'ethjs-unit';
import { decryptAes, importAesKey } from '../utils/keys';
import { getRecoveryKey } from './get-recovery-public-key';

const zeroBn = new BN(0);

/**
   * 1. Iterate over account index, and for each index interate over address index (change is 0)
   * 2. Find out if the address has either a balance or any outgoing transaction
   * 3. If the address has either, add it to the list and check the next address
   * 4. If the address has none, then move to the next account
   * 5. If an account doesn't have any addresses, then done.
   */
const findAllAddressesForNode = async (node: JsonBIP44CoinTypeNode): Promise<RecoveredAddress[]> => {
  const recoveredAddresses: RecoveredAddress[] = [];

  let accountIndex = 0;
  while (true) {
    let foundAddressForAccount = false;
    let addressIndex = 0;
    /* eslint-disable no-await-in-loop */
    while (true) {
      const address = await deriveBIP44AddressKey(node, { account: accountIndex, address_index: addressIndex });
      const numTransactionsHex = await wallet.request({
        method: 'eth_getTransactionCount',
        params: [
          address.address,
          'latest',
        ],
      }) as string;
      const numTransactions = parseInt(numTransactionsHex, 16);
      const balanceHex = await wallet.request({
        method: 'eth_getBalance',
        params: [
          address.address,
          'latest',
        ],
      }) as string;
      const balanceInWei = new BN(balanceHex.replace('0x', ''), 16);
      const balanceInEth = fromWei(balanceInWei, 'ether');

      if (numTransactions > 0 || balanceInWei.gt(zeroBn)) {
        recoveredAddresses.push({
          accountIndex,
          addressIndex,
          address: address.address,
          balanceInEth,
          numTransactions,
        });

        addressIndex += 1;
        foundAddressForAccount = true;
      } else {
        break;
      }
    }
    /* eslint-enable no-await-in-loop */

    if (foundAddressForAccount) {
      accountIndex += 1;
    } else {
      break;
    }
  }

  return recoveredAddresses;
};

export function isGetRecoveredAddressesParams(_params: unknown): asserts _params is GetRecoveredAddressesParams {
  // @TODO
}

export const getDecryptedEthereumNode = async ({
  encryptedBackupKeypairParts,
  encryptedEthereumNode,
}: GetRecoveredAddressesParams) => {
  if (encryptedBackupKeypairParts.length < RECOVERY_THRESHOLD_PARTS) {
    throw new Error(`Must provide at least ${RECOVERY_THRESHOLD_PARTS}/${RECOVERY_TOTAL_PARTS} shared secrey parts to recover`);
  }

  const recoveryKey = await getRecoveryKey();
  const decryptedBackupKeypairParts = await Promise.all(encryptedBackupKeypairParts.map((encryptedPart) => decryptWithPrivateKey(
    recoveryKey.privateKey!.toString(),
    encryptedPart,
  )));

  const reconstructedBackupKeypairHex = secrets.combine(decryptedBackupKeypairParts);
  const reconstructedStringifiedBackupKeypair = secrets.hex2str(reconstructedBackupKeypairHex);
  const reconstructedBackupKeypair = JSON.parse(reconstructedStringifiedBackupKeypair) as JsonWebKey;
  const importedBackupKeypair = await importAesKey(reconstructedBackupKeypair);

  return JSON.parse(await decryptAes(
    encryptedEthereumNode,
    importedBackupKeypair,
  )) as JsonBIP44CoinTypeNode;
};

export const getRecoveredAddresses = async (params: GetRecoveredAddressesParams): Promise<GetRecoveredAddressesResult> => {
  const decryptedEthereumNode = await getDecryptedEthereumNode(params);

  const recoveredAddresses = await findAllAddressesForNode(decryptedEthereumNode);

  return { recoveredAddresses };
};
