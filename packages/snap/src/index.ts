import { OnRpcRequestHandler } from '@metamask/snap-types';
import { assistWithRecovery, isAssistWithRecoveryParams } from './rpc/assist-with-recovery';
import { getRecoveredAddresses, isGetRecoveredAddressesParams } from './rpc/get-recovered-addresses';
import { getRecoveryPublicKey } from './rpc/get-recovery-public-key';
import { getSnappyKeys } from './rpc/get-snappy-keys';
import { isSetupRecoveryParams, setupRecovery } from './rpc/setup-recovery';
import { isShowPrivateKeyForRecoveredAddressParams, showPrivateKeyForRecoveredAddress } from './rpc/show-private-key-for-recovered-address';

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    case 'check':
      return true;

    case 'getSnappyKeys':
      return getSnappyKeys();

    case 'setupRecovery':
      isSetupRecoveryParams(request.params);
      return setupRecovery(request.params);

    case 'getRecoveryPublicKey':
      return getRecoveryPublicKey();

    case 'assistWithRecovery':
      isAssistWithRecoveryParams(request.params);
      return assistWithRecovery(request.params);

    case 'getRecoveredAddresses':
      isGetRecoveredAddressesParams(request.params);
      return getRecoveredAddresses(request.params);

    case 'showPrivateKeyForRecoveredAddress':
      isShowPrivateKeyForRecoveredAddressParams(request.params);
      await showPrivateKeyForRecoveredAddress(request.params);
      return true;

    default:
      throw new Error('Method not found.');
  }
};
