import * as mobx from 'mobx'
import { RootStore } from 'src/stores'
import { DialogVM } from 'ui-framework'
import ProviderType from 'src/domain/ProviderType'

type AppVMProps = 'pending'

export default class AppVM {
  [name: string]: any
  public rootStore: RootStore
  public pending = false
  public headerMenu = new DialogVM()
  public providerMenu = new DialogVM()
  public section: 'dao' | 'stake' | 'rewards' = 'stake'
  private stopAutoHidingProviderMenu: mobx.IReactionDisposer | null = null
  private stopAutoSettingBodyOverflow: mobx.IReactionDisposer | null = null

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: AppVMProps, value: any) {
    ;(this[prop] as any) = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public connect (providerType: ProviderType) {
    this.providerMenu.hide()
    this.rootStore.web3Connection.connect(providerType)
  }

  public disconnect () {
    this.providerMenu.hide()
    this.rootStore.web3Connection.disconnect()
  }

  public init() {
    this.stopAutoSettingBodyOverflow = mobx.reaction(
      () => this.headerMenu.visible || this.providerMenu.visible,
      (menuVisible) => {
        if (menuVisible) {
          document.body.classList.add('overflow')
        } else {
          document.body.classList.remove('overflow')
        }
      }
    )

    // This is purely to help performance issue when loading contracts
    this.stopPreloadContract = mobx.reaction(
      () => this.section === 'rewards',
      (shouldPreload) => {
        if (shouldPreload) {
          setTimeout(() => {
            this.rootStore.stakingProvider.preloadIBZXContract()
          }, 1000)
        }
      }
    )
  }

  public destroyVM() {
    if (this.stopAutoHidingProviderMenu) {
      this.stopAutoHidingProviderMenu()
    }
    if (this.stopAutoSettingBodyOverflow) {
      this.stopAutoSettingBodyOverflow()
    }
    if (this.stopPreloadContract) {
      this.stopPreloadContract()
    }
  }

  constructor({ rootStore }: { rootStore: RootStore }) {
    this.rootStore = rootStore
    this.init()
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
