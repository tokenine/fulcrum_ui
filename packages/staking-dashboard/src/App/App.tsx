import { Web3ReactProvider } from '@web3-react/core'
import React from 'react'
import Intercom from 'react-intercom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import appConfig from 'src/config/appConfig'
import AppVM from './AppVM'
import Footer from './Footer'
import Header from './Header'
import ProviderMenu from './ProviderMenu'
import Staking from './Staking'
import Web3ReactExporter from 'shared-components/Web3ReactExporter'

export default function App({ vm }: { vm: AppVM }) {
  const { stakingProvider } = vm.rootStore
  return (
    <React.Fragment>
      <Web3ReactProvider getLibrary={stakingProvider.getLibrary}>
        <Web3ReactExporter web3Connection={vm.rootStore.web3Connection} />
        <ProviderMenu appVM={vm} />
      </Web3ReactProvider>
      {appConfig.isMainnetProd ? <Intercom appID="dfk4n5ut" /> : null}
      <Router>
        <>
          <Header appVM={vm} />
          <Switch>
            <Route exact={true} path="/">
              <Staking />
            </Route>
          </Switch>
        </>
      </Router>
      <Footer />
    </React.Fragment>
  )
}
