import { BigNumber } from '@0x/utils'
import React from 'react'
import NumberEasing from 'react-number-easing'
import { ReactComponent as BzrxIcon } from 'app-images/token-bzrx.svg'
import { ReactComponent as CRVIcon } from 'app-images/token-crv.svg'
import { ReactComponent as VBzrxIcon } from 'app-images/token-vbzrx.svg'
import { ReactComponent as IBzrxIcon } from 'app-images/token-ibzrx.svg'
import { ReactComponent as BptIcon } from 'app-images/token-bpt.svg'

const tokenIcons = {
  bzrx: <BzrxIcon />,
  crv: <CRVIcon />,
  vbzrx: <VBzrxIcon />,
  ibzrx: <IBzrxIcon />,
  bpt: <BptIcon />
}

interface IAssetBalanceProps {
  id?: keyof typeof tokenIcons
  size?: 'small' | 'normal'
  variant: 'green' | ''
  className?: string
  balance: BigNumber
  link?: string
  name: string
  tokenLogo?: React.ReactNode
  decimals?: number
}

function customFunctionRender (num: number) {
  return (num > -1 && num <-0.01 || num >= 0.01 && num < 1) ? num.toPrecision(2) : Math.floor(num).toFixed()
}

export function AssetBalance(props: IAssetBalanceProps) {
  let cssClass = props.variant ? `st-asset-balance--${props.variant}` : 'st-asset-balance'
  if (props.className) {
    cssClass += ` ${props.className}`
  }

  if (props.size === 'small') {
    cssClass += ' st-asset-balance--small'
  }

  const icon = props.tokenLogo ? props.tokenLogo : props.id ? tokenIcons[props.id] : null

  return (
    <div className={cssClass}>
      <a href={props.link} target="_blank" rel="noopener noreferrer">
        <span className="icon">{icon}</span>
      </a>
      <span title={props.balance.toFixed(18, 1)} className="value">
        <NumberEasing
          value={props.balance.toNumber()}
          // decimals={0}
          customFunctionRender={customFunctionRender}
          ease="quintInOut"
        />
      </span>
      <div className="token-label">{props.name}</div>
    </div>
  )
}

AssetBalance.defaultProps = {
  variant: '',
  size: 'normal'
}

export default React.memo(AssetBalance)
