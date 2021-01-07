// tslint:disable: max-classes-per-file
import { BigNumber } from '@0x/utils'
import * as mobx from 'mobx'
import { StakingProvider } from 'src/services/StakingProvider'
import StakingStore from '../StakingStore'
import errorUtils from 'app-lib/errorUtils'

type rewardsProp =
  | 'bzrx'
  | 'bzrxVesting'
  | 'error'
  | 'pendingStakingRewards'
  | 'pendingRebateRewards'
  | 'rebateRewards'
  | 'stableCoin'
  | 'stableCoinVesting'
  | 'stakingProvider'

export default class Rewards {
  public bzrx = new BigNumber(0)
  public bzrxVesting = new BigNumber(0)
  public error: Error | null = null
  public pendingRebateRewards = false
  public pendingStakingRewards = false
  public rebateRewards = new BigNumber(0)
  public stableCoin = new BigNumber(0)
  public stableCoinVesting = new BigNumber(0)
  public stakingProvider: StakingProvider
  public stakingStore: StakingStore

  get canClaimStakingRewards() {
    const { bzrx, stableCoin } = this
    return !this.pendingRebateRewards && (bzrx.gt(0.01) || stableCoin.gt(0.01))
  }

  get canClaimVBZRXRewards() {
    return !this.pendingStakingRewards && this.rebateRewards.gt(0.01)
  }

  /**
   * Helper to set the value of one prop through a mobx action.
   */
  public set(prop: rewardsProp, value: any) {
    this[prop] = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public async getRewards() {
    this.assign({ error: null, pendingStakingRewards: true })
    try {
      const sp = this.stakingProvider
      this.set('rebateRewards', await sp.getRebateRewards())
      const rewards = await sp.getUserEarnings()
      this.assign(rewards)
      return { rewards }
    } catch (err) {
      const error = errorUtils.decorateError(err, { title: 'Failed to get rewards estimates' })
      this.set('error', error)
    } finally {
      this.set('pendingStakingRewards', false)
    }
  }

  public async claimStakingRewards(shouldRestake: boolean = false) {
    this.assign({ error: null, pendingStakingRewards: true })
    const claimedAmounts = {bzrx: this.bzrx, stableCoin: this.stableCoin}
    try {
      await this.stakingProvider.claimStakingRewards(shouldRestake)
      this.assign({
        bzrx: new BigNumber(0),
        stableCoin: new BigNumber(0)
        // TODO: What do we do with vesting ones?
      })
      return claimedAmounts
    } catch (err) {
      const error = errorUtils.decorateError(err, { title: 'Failed to claim rewards' })
      this.set('error', error)
      throw error
    } finally {
      this.set('pendingStakingRewards', false)
    }
  }

  public async claimRebateRewards() {
    this.assign({ error: null, pendingRebateRewards: true })
    try {
      await this.stakingProvider.claimRebateRewards()
      this.set('rebateRewards', new BigNumber(0))
    } catch (err) {
      const error = errorUtils.decorateError(err, { title: 'Failed to claim rebate rewards' })
      this.set('error', error)
    } finally {
      this.set('pendingRebateRewards', false)
    }
  }

  public clearBalances() {
    this.bzrx = new BigNumber(0)
    this.bzrxVesting = new BigNumber(0)
    this.rebateRewards = new BigNumber(0)
    this.stableCoin = new BigNumber(0)
    this.stableCoinVesting = new BigNumber(0)
  }

  constructor(stakingProvider: StakingProvider, stakingStore: StakingStore) {
    this.stakingProvider = stakingProvider
    this.stakingStore = stakingStore
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
