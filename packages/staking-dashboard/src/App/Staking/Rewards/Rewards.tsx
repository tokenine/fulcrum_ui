import { ReactComponent as BzrxIcon } from 'app-images/token-bzrx.svg'
import { ReactComponent as CRVIcon } from 'app-images/token-crv.svg'
import { ReactComponent as VBzrxIcon } from 'app-images/token-vbzrx.svg'
import React from 'react'
import RewardsVM from './RewardsVM'
import AssetBalance from 'shared-components/AssetBalance'
import { Button, InputBasic } from 'ui-framework'

export default function Rewards({ vm }: { vm: RewardsVM }) {
  const { rootStore } = vm
  const { etherscanURL, stakingStore } = rootStore
  const { rewards } = stakingStore

  return (
    <div>
      <div className="bg-darken padded-2 margin-bottom-2 border-rounded-1">
        <div className="ui-grid-wmin-260px">
          <div className="margin-bottom-1">
            <h3 className="section-header">Staking Rewards:</h3>
            <AssetBalance
              className="margin-bottom-2"
              variant="green"
              tokenLogo={<BzrxIcon />}
              balance={rewards.bzrx}
              name="BZRX"
            />

            <AssetBalance
              className="margin-bottom-2"
              variant="green"
              tokenLogo={<CRVIcon />}
              balance={rewards.stableCoin}
              name="3CRV"
            />

            <div>
              <Button
                isLoading={rewards.pendingStakingRewards}
                className="button blue btn--medium margin-bottom-1"
                disabled={!rewards.canClaimStakingRewards}
                onClick={vm.claimStakingRewards}>
                Claim {vm.inputRestake ? '& Restake' : ''}
              </Button>
              <div className="margin-left-1">
                <InputBasic
                  id="input-restake"
                  type="checkbox"
                  onChange={vm.set}
                  onChangeEmit="name-value"
                  name="inputRestake"
                  value={vm.inputRestake}
                />
                <label className="margin-left-1ch label" htmlFor="input-restake">
                  Restake
                </label>
              </div>
            </div>
          </div>

          <div className="margin-bottom-1">
            <h3 className="section-header">Vesting rewards:</h3>
            <AssetBalance
              className="margin-bottom-2"
              tokenLogo={<BzrxIcon />}
              balance={rewards.bzrxVesting}
              name="BZRX"
            />
            <AssetBalance
              className="margin-bottom-2"
              tokenLogo={<CRVIcon />}
              balance={rewards.stableCoinVesting}
              name="3CRV"
            />
          </div>
        </div>
      </div>

      <div className="padded-2 bg-darken border-rounded-1">
        <h3 className="section-header">Incentive rewards:</h3>
        <AssetBalance
          className="margin-bottom-3"
          balance={rewards.rebateRewards}
          link={`${etherscanURL}token/0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F`}
          name="vBZRX"
          tokenLogo={<VBzrxIcon />}
        />
        <Button
          isLoading={rewards.pendingRebateRewards}
          className="button blue btn--medium"
          disabled={!rewards.canClaimVBZRXRewards}
          onClick={rewards.claimRebateRewards}>
          Claim
        </Button>
      </div>
    </div>
  )
}
