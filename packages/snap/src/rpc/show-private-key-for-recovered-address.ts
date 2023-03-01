import { deriveBIP44AddressKey } from '@metamask/key-tree';
import { ShowPrivateKeyForRecoveredAddressParams } from '@snappy-recovery/shared';

import {
  panel, text, heading, copyable,
} from '@metamask/snaps-ui';

import { getDecryptedEthereumNode, isGetRecoveredAddressesParams } from './get-recovered-addresses';

export function isShowPrivateKeyForRecoveredAddressParams(_params: unknown): asserts _params is ShowPrivateKeyForRecoveredAddressParams {
  isGetRecoveredAddressesParams(_params);
  // @TODO
}

export const showPrivateKeyForRecoveredAddress = async (params: ShowPrivateKeyForRecoveredAddressParams): Promise<void> => {
  const decryptedEthereumNode = await getDecryptedEthereumNode(params);
  const targetAddress = await deriveBIP44AddressKey(decryptedEthereumNode, {
    account: params.addressIndices.accountIndex,
    address_index: params.addressIndices.addressIndex,
  });

  const confirmed = await snap.request({
    method: 'snap_dialog',
    params: {
      type: 'Confirmation',
      content: panel([
        heading('Are you sure?'),
        text(`Click "Approve" to reveal the private key for address ${targetAddress.address}`),
      ]),
    },
  }) as boolean;

  if (confirmed) {
    await snap.request({
      method: 'snap_dialog',
      params: {
        type: 'Alert',
        content: panel([
          heading('Your private key'),
          text(`Here is the private key for address ${targetAddress.address}`),
          copyable(targetAddress.privateKey?.toString()),
        ]),
      },
    });
  }
};
