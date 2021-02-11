export const mainnetAddress = '0xe95ebce2b02ee07def5ed6b53289801f7fc137a4'

export const stakingV1Json = {
  abi: [
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'bzrxAmount',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'stableCoinAmount',
          type: 'uint256'
        }
      ],
      name: 'AddRewards',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'user',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'oldDelegate',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newDelegate',
          type: 'address'
        }
      ],
      name: 'ChangeDelegate',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'user',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'bzrxAmount',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'stableCoinAmount',
          type: 'uint256'
        }
      ],
      name: 'Claim',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'bzrxOutput',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'stableCoinOutput',
          type: 'uint256'
        }
      ],
      name: 'ConvertFees',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'bzrxRewards',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'stableCoinRewards',
          type: 'uint256'
        }
      ],
      name: 'DistributeFees',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'previousOwner',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'newOwner',
          type: 'address'
        }
      ],
      name: 'OwnershipTransferred',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'user',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'token',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'delegate',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'Stake',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'user',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'token',
          type: 'address'
        },
        {
          indexed: true,
          internalType: 'address',
          name: 'delegate',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'amount',
          type: 'uint256'
        }
      ],
      name: 'Unstake',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: 'address',
          name: 'sender',
          type: 'address'
        }
      ],
      name: 'WithdrawFees',
      type: 'event'
    },
    {
      constant: true,
      inputs: [],
      name: 'BZRX',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'BZRXWeightStored',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'DAI',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'LPToken',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'LPTokenWeightStored',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'USDC',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'USDT',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'WETH',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'address[]',
          name: 'accounts',
          type: 'address[]'
        },
        {
          internalType: 'uint256[]',
          name: 'bzrxAmounts',
          type: 'uint256[]'
        },
        {
          internalType: 'uint256[]',
          name: 'stableCoinAmounts',
          type: 'uint256[]'
        }
      ],
      name: 'addDirectRewards',
      outputs: [
        {
          internalType: 'uint256',
          name: 'bzrxTotal',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'stableCoinTotal',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'uint256',
          name: 'newBZRX',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'newStableCoin',
          type: 'uint256'
        }
      ],
      name: 'addRewards',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'bZx',
      outputs: [
        {
          internalType: 'contract IBZxPartial',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'token',
          type: 'address'
        },
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'balanceOfByAsset',
      outputs: [
        {
          internalType: 'uint256',
          name: 'balance',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'balanceOfByAssets',
      outputs: [
        {
          internalType: 'uint256',
          name: 'bzrxBalance',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'iBZRXBalance',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'vBZRXBalance',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'LPTokenBalance',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'balanceOfStored',
      outputs: [
        {
          internalType: 'uint256',
          name: 'vestedBalance',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'vestingBalance',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'bzrxPerTokenStored',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'bzrxRewards',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'bzrxRewardsPerTokenPaid',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'bzrxVesting',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'callerRewardDivisor',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'bool',
          name: 'restake',
          type: 'bool'
        }
      ],
      name: 'claim',
      outputs: [
        {
          internalType: 'uint256',
          name: 'bzrxRewardsEarned',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'stableCoinRewardsEarned',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'claim3Crv',
      outputs: [
        {
          internalType: 'uint256',
          name: 'stableCoinRewardsEarned',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'claimBzrx',
      outputs: [
        {
          internalType: 'uint256',
          name: 'bzrxRewardsEarned',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'cliffDuration',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      name: 'currentFeeTokens',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'curve3Crv',
      outputs: [
        {
          internalType: 'contract IERC20',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'curve3pool',
      outputs: [
        {
          internalType: 'contract ICurve3Pool',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'delegate',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'delegateBalanceOf',
      outputs: [
        {
          internalType: 'uint256',
          name: 'totalVotes',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        },
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'delegatedPerToken',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'account',
          type: 'address'
        }
      ],
      name: 'earned',
      outputs: [
        {
          internalType: 'uint256',
          name: 'bzrxRewardsEarned',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'stableCoinRewardsEarned',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'bzrxRewardsVesting',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'stableCoinRewardsVesting',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'exit',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'fundsWallet',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'getVariableWeights',
      outputs: [
        {
          internalType: 'uint256',
          name: 'vBZRXWeight',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'iBZRXWeight',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'LPTokenWeight',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'iBZRX',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'iBZRXWeightStored',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'implementation',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'initialCirculatingSupply',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'isOwner',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'isPaused',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'lastRewardsAddTime',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'maxCurveDisagreement',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'maxUniswapDisagreement',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'owner',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'rewardPercent',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'uint256',
          name: '_callerRewardDivisor',
          type: 'uint256'
        }
      ],
      name: 'setCallerRewardDivisor',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'setCurveApproval',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'address[]',
          name: 'tokens',
          type: 'address[]'
        }
      ],
      name: 'setFeeTokens',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'address',
          name: '_fundsWallet',
          type: 'address'
        }
      ],
      name: 'setFundsWallet',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'uint256',
          name: '_maxCurveDisagreement',
          type: 'uint256'
        }
      ],
      name: 'setMaxCurveDisagreement',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'uint256',
          name: '_maxUniswapDisagreement',
          type: 'uint256'
        }
      ],
      name: 'setMaxUniswapDisagreement',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'address[][]',
          name: 'paths',
          type: 'address[][]'
        }
      ],
      name: 'setPaths',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'uint256',
          name: '_rewardPercent',
          type: 'uint256'
        }
      ],
      name: 'setRewardPercent',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'stableCoinPerTokenStored',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'stableCoinRewards',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'stableCoinRewardsPerTokenPaid',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'stableCoinVesting',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'address[]',
          name: 'tokens',
          type: 'address[]'
        },
        {
          internalType: 'uint256[]',
          name: 'values',
          type: 'uint256[]'
        }
      ],
      name: 'stake',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'stakingRewards',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        },
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      name: 'swapPaths',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [],
      name: 'sweepFees',
      outputs: [
        {
          internalType: 'uint256',
          name: 'bzrxRewards',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'crv3Rewards',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'address[]',
          name: 'assets',
          type: 'address[]'
        }
      ],
      name: 'sweepFeesByAsset',
      outputs: [
        {
          internalType: 'uint256',
          name: 'bzrxRewards',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'crv3Rewards',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'bool',
          name: '_isPaused',
          type: 'bool'
        }
      ],
      name: 'togglePause',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'address',
          name: 'token',
          type: 'address'
        }
      ],
      name: 'totalSupplyByAsset',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'totalSupplyStored',
      outputs: [
        {
          internalType: 'uint256',
          name: 'supply',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'address',
          name: 'newOwner',
          type: 'address'
        }
      ],
      name: 'transferOwnership',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'uniswapRouter',
      outputs: [
        {
          internalType: 'contract IUniswapV2Router',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: false,
      inputs: [
        {
          internalType: 'address[]',
          name: 'tokens',
          type: 'address[]'
        },
        {
          internalType: 'uint256[]',
          name: 'values',
          type: 'uint256[]'
        }
      ],
      name: 'unstake',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'vBZRX',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'vBZRXWeightStored',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [
        {
          internalType: 'uint256',
          name: 'tokenBalance',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'lastUpdate',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'vestingEndTime',
          type: 'uint256'
        }
      ],
      name: 'vestedBalanceForAmount',
      outputs: [
        {
          internalType: 'uint256',
          name: 'vested',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'vestingDuration',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
  ]
}
