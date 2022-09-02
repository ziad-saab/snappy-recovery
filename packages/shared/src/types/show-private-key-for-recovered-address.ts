import { GetRecoveredAddressesParams, RecoveredAddressIndices } from './get-recovered-addresses';

export interface ShowPrivateKeyForRecoveredAddressParams extends GetRecoveredAddressesParams {
  addressIndices: RecoveredAddressIndices;
}
