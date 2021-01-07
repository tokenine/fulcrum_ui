import { observer } from 'mobx-react'
import React from 'react'
import { Button } from 'ui-framework'
import StakingFormVM from '../StakingFormVM'
import InputStake from './InputStake'

export function AddToBalance({ vm }: { vm: StakingFormVM }) {
  const { wallet } = vm.stakingStore.userBalances

  return (
    <React.Fragment>
      <h3 className="section-header">Add to staking balance:</h3>
      {wallet.bzrx.gte(0.01) && (
        <InputStake
          id="bzrx"
          label="BZRX"
          max={wallet.bzrx}
          onChange={vm.changeTokenBalance}
          value={vm.bzrxInput}
        />
      )}
      {wallet.vbzrx.gte(0.01) && (
        <InputStake
          id="vbzrx"
          label="vBZRX"
          max={wallet.vbzrx}
          onChange={vm.changeTokenBalance}
          value={vm.vbzrxInput}
        />
      )}
      {wallet.ibzrx.gte(0.01) && (
        <InputStake
          id="ibzrx"
          label="iBZRX"
          max={wallet.ibzrx}
          onChange={vm.changeTokenBalance}
          value={vm.ibzrxInput}
        />
      )}
      {wallet.bpt.gte(0.01) && (
        <InputStake
          id="bpt"
          label="BPT"
          max={wallet.bpt}
          onChange={vm.changeTokenBalance}
          value={vm.bptInput}
        />
      )}

      <Button
        isLoading={vm.stakingStore.stakingPending}
        className="button full-button blue"
        disabled={!vm.canStake}
        onClick={vm.stake}>
        Stake
      </Button>

    </React.Fragment>
  )
}

export default observer(AddToBalance)
