import React from 'react'
import Modal from 'react-modal'
import { Loader } from 'ui-framework'
import AddToBalance from './AddToBalance'
import AnimationTx from './AnimationTx'
import Delegates from './Delegates'
import FindRepresentative from './FindRepresentative'
import StakingFormVM from './StakingFormVM'
import UserBalances from './UserBalances'
// import ChangeStake from './ChangeStake' // This is a proof of concept to stake and unstake

export default function StakingForm({ vm }: { vm: StakingFormVM }) {
  const { userBalances } = vm.stakingStore
  const { wallet, staked } = userBalances

  return (
    <React.Fragment>
      <Modal
        isOpen={vm.findRepDialogIsOpen}
        onRequestClose={vm.closeFindRepDialog}
        className="modal-content-div"
        overlayClassName="modal-overlay-div"
        ariaHideApp={false}>
        <FindRepresentative vm={vm} />
      </Modal>
      <div>
        <div>
          {vm.transactionIsRunning ? (
            <AnimationTx rootStore={vm.stakingStore.rootStore} />
          ) : (
            <React.Fragment>
              <div className="balance">
                {userBalances.pending && (
                  <Loader
                    className="calculator__balance-loader"
                    quantityDots={3}
                    sizeDots="small"
                    title=""
                    isOverlay={false}
                  />
                )}
                <UserBalances rootStore={vm.rootStore} />
              </div>

              {/* {vm.repListLoaded && vm.rootStore.web3Connection.isConnected && (
                // DELEGATES aren't shown until we have the DAO. Code commented until then.
                <Delegates vm={vm} />
              )} */}
              {(wallet.isWorthEnough || staked.isWorthEnough) && <AddToBalance vm={vm} />}
              {/* <ChangeStake vm={vm} /> */}
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}
