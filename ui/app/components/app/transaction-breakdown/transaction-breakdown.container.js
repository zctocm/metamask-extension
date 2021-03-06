import { connect } from 'react-redux'
import TransactionBreakdown from './transaction-breakdown.component'
import {
  getIsMainnet,
  getNativeCurrency,
  preferencesSelector,
} from '../../../selectors/selectors'
import { getHexGasTotal, getHexStorageTotal } from '../../../helpers/utils/confirm-tx.util'
import { sumHexes } from '../../../helpers/utils/transactions.util'

const mapStateToProps = (state, ownProps) => {
  const { transaction } = ownProps
  const {
    txParams: { gas, gasPrice, value, storageLimit } = {},
    txReceipt: { gasUsed } = {},
  } = transaction
  const { showFiatInTestnets } = preferencesSelector(state)
  const isMainnet = getIsMainnet(state)

  const gasLimit = typeof gasUsed === 'string' ? gasUsed : gas

  const hexGasTotal =
    (gasLimit && gasPrice && getHexGasTotal({ gasLimit, gasPrice })) || '0x0'

  const hexStorageTotal =
        (storageLimit && getHexStorageTotal({ storageLimit })) || '0x0'

  const totalInHex = sumHexes(hexStorageTotal, hexGasTotal, value)

  return {
    nativeCurrency: getNativeCurrency(state),
    showFiat: isMainnet || !!showFiatInTestnets,
    totalInHex,
    gas,
    gasPrice,
    value,
    gasUsed,
    storageCollateralized: storageLimit,
    collateralized: hexStorageTotal,
  }
}

export default connect(mapStateToProps)(TransactionBreakdown)
