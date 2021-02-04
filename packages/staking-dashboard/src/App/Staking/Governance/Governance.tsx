import { ReactComponent as SearchIcon } from 'app-images/icon-search.svg'
import React from 'react'
import GovernanceItem from './GovernanceItem'
import GovernanceVM from './GovernanceVM'
import Proposals from './Proposals/Proposals'
import { Loader } from 'ui-framework'

const loader = (
  <Loader
    title="Loading proposals"
    className="margin-top-2"
    quantityDots={3}
    sizeDots="small"
    isOverlay={false}
  />
)

export default function Governance({ vm }: { vm: GovernanceVM }) {
  const { proposalsList } = vm.governanceStore

  if (vm.proposalPopup.visible) {
    return (
      <div className="panel--white padded-2 margin-bottom-2">
        <Proposals vm={vm} />
      </div>
    )
  }

  return (
    <div className="panel--white padded-2 margin-bottom-2">
      <div className="governance__search margin-bottom-2">
        <input value={vm.name} placeholder="Search" onChange={(e) => (vm.name = e.target.value)} />
        <div className="governance__search__button" onClick={vm.search}>
          <SearchIcon />
        </div>
      </div>
      <table className="table">
        <thead>
          <tr>
            <td className="table__head">Description</td>
            <td className="table__head">Author</td>
            <td className="table__head txt-center">Action</td>
          </tr>
        </thead>
        <tbody>
          {proposalsList.map((proposal) => (
            <GovernanceItem key={proposal.id} proposal={proposal} openProposals={vm.showProposal} />
          ))}
        </tbody>
      </table>
      {vm.governanceStore.pending && loader}
      {vm.governanceStore.listFailedToLoad && <p>The list could not be loaded</p>}
    </div>
  )
}
