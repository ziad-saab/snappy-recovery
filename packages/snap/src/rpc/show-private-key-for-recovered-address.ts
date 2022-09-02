import { deriveBIP44AddressKey } from '@metamask/key-tree';
import { ShowPrivateKeyForRecoveredAddressParams } from '@snappy-recovery/shared';
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
  const confirmed = await wallet.request({
    method: 'snap_confirm',
    params: [{
      prompt: 'Are you sure?',
      description: `Click "Approve" to reveal the private key for address ${targetAddress.address}`,
    }],
  }) as boolean;

  if (confirmed) {
    await wallet.request({
      method: 'snap_confirm',
      params: [{
        prompt: 'Your private key',
        description: `Here is the private key for address ${targetAddress.address}`,
        textAreaContent: targetAddress.privateKey?.toString(),
      }],
    });
  }
};
