import { Web3ProviderEngine } from "@0x/subproviders";
import { BigNumber } from "@0x/utils";
import { Web3Wrapper } from "@0x/web3-wrapper";
import { EventEmitter } from "events";
import { erc20Contract } from "../contracts/erc20";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { BorrowRequest } from "../domain/BorrowRequest";
import { ExtendLoanRequest } from "../domain/ExtendLoanRequest";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";
import { IBorrowEstimate } from "../domain/IBorrowEstimate";
import { ICollateralChangeEstimate } from "../domain/ICollateralChangeEstimate";
import { ICollateralManagementParams } from "../domain/ICollateralManagementParams";
import { IExtendEstimate } from "../domain/IExtendEstimate";
import { IExtendState } from "../domain/IExtendState";
import { IRepayEstimate } from "../domain/IRepayEstimate";
import { IRepayState } from "../domain/IRepayState";
import { IWalletDetails } from "../domain/IWalletDetails";
import { IWeb3ProviderSettings } from "../domain/IWeb3ProviderSettings";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { ProviderType } from "../domain/ProviderType";
import { RepayLoanRequest } from "../domain/RepayLoanRequest";
import { SetupENSRequest } from "../domain/SetupENSRequest";
import { WalletType } from "../domain/WalletType";
import { Web3ConnectionFactory } from "../domain/Web3ConnectionFactory";
import { ContractsSource } from "./ContractsSource";
import { TorqueProviderEvents } from "./events/TorqueProviderEvents";

import { ProviderChangedEvent } from "./events/ProviderChangedEvent";

export class TorqueProvider {
  public static Instance: TorqueProvider;

  public readonly gasLimit = "4000000";

  // gasBufferCoeff equal 110% gas reserve
  public readonly gasBufferCoeff = new BigNumber("1.02");
  // 5000ms
  public readonly successDisplayTimeout = 5000;

  public static readonly UNLIMITED_ALLOWANCE_IN_BASE_UNITS = new BigNumber(2)
    .pow(256)
    .minus(1);

  public static readonly ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

  public readonly eventEmitter: EventEmitter;
  public providerType: ProviderType = ProviderType.None;
  public providerEngine: Web3ProviderEngine | null = null;
  public web3Wrapper: Web3Wrapper | null = null;
  public web3ProviderSettings: IWeb3ProviderSettings | null = null;
  public contractsSource: ContractsSource | null = null;
  public accounts: string[] = [];
  public isLoading: boolean = false;
  public unsupportedNetwork: boolean = false;

  constructor() {
    // init
    this.eventEmitter = new EventEmitter();
    this.eventEmitter.setMaxListeners(1000);

    // singleton
    if (!TorqueProvider.Instance) {
      TorqueProvider.Instance = this;
    }

    const storedProvider: any = TorqueProvider.getLocalstorageItem('providerType');
    const providerType: ProviderType | null = ProviderType[storedProvider] as ProviderType || null;

    if (providerType) {
      TorqueProvider.Instance.setWeb3Provider(providerType).then(() => {
        this.eventEmitter.emit(TorqueProviderEvents.ProviderAvailable);
        TorqueProvider.Instance.eventEmitter.emit(
          TorqueProviderEvents.ProviderChanged,
          new ProviderChangedEvent(TorqueProvider.Instance.providerType, TorqueProvider.Instance.web3Wrapper)
        );
      });
    } else {

      // setting up readonly provider
      Web3ConnectionFactory.getWeb3Provider(null, this.eventEmitter).then((providerData) => {
        // @ts-ignore
        const web3Wrapper = providerData[0];
        TorqueProvider.getWeb3ProviderSettings(providerData[3]).then((web3ProviderSettings) => {
          if (web3Wrapper && web3ProviderSettings) {
            const contractsSource = new ContractsSource(providerData[1], web3ProviderSettings.networkId, providerData[2]);
            contractsSource.Init().then(() => {
              this.web3Wrapper = web3Wrapper;
              this.providerEngine = providerData[1];
              this.web3ProviderSettings = web3ProviderSettings;
              this.contractsSource = contractsSource;
              this.eventEmitter.emit(TorqueProviderEvents.ProviderAvailable);
            });
          }
        });
      });

    }

    return TorqueProvider.Instance;
  }

  public static getLocalstorageItem(item: string): string {
    let response = "";
    try {
      response = localStorage.getItem(item) || "";
    } catch(e) {
      // console.log(e);
    }
    return response;
  }

  public static setLocalstorageItem(item: string, val: string) {
    try {
      localStorage.setItem(item, val);
    } catch(e) {
      // console.log(e);
    }
  }

  public async setWeb3Provider(providerType: ProviderType) {
    this.unsupportedNetwork = false;
    await this.setWeb3ProviderFinalize(providerType, await Web3ConnectionFactory.getWeb3Provider(providerType, this.eventEmitter));
  }

  public async setWeb3ProviderFinalize(providerType: ProviderType, providerData: [Web3Wrapper | null, Web3ProviderEngine | null, boolean, number]) { // : Promise<boolean> {
    this.web3Wrapper = providerData[0];
    this.providerEngine = providerData[1];
    let canWrite = providerData[2];
    let networkId = providerData[3];

    this.web3ProviderSettings = await TorqueProvider.getWeb3ProviderSettings(networkId);
    if (this.web3Wrapper) {
      if (this.web3ProviderSettings.networkName !== process.env.REACT_APP_ETH_NETWORK) {
        // TODO: inform the user they are on the wrong network. Make it provider specific (MetaMask, etc)

        this.unsupportedNetwork = true;
        canWrite = false; // revert back to read-only
        networkId = await this.web3Wrapper.getNetworkIdAsync();
        this.web3ProviderSettings = await TorqueProvider.getWeb3ProviderSettings(networkId);
      }
    }

    if (this.web3Wrapper && canWrite) {
      try {
        this.accounts = await this.web3Wrapper.getAvailableAddressesAsync() || [];
      } catch(e) {
        // console.log(e);
        this.accounts = [];
      }
      if (this.accounts.length === 0) {
        canWrite = false; // revert back to read-only
      }
    } else {
      // this.accounts = [];
      if (providerType === ProviderType.Bitski && networkId !== 1) {
        this.unsupportedNetwork = true;
      }
    }

    if (this.web3Wrapper && this.web3ProviderSettings.networkId > 0) {
      this.contractsSource = await new ContractsSource(this.providerEngine, this.web3ProviderSettings.networkId, canWrite);
      if (canWrite) {
        this.providerType = providerType;
      } else {
        this.providerType = ProviderType.None;
      }
      TorqueProvider.setLocalstorageItem('providerType', providerType);
    } else {
      this.contractsSource = null;
    }

    if (this.contractsSource) {
      await this.contractsSource.Init();
    }
  }

  public static async getWeb3ProviderSettings(networkId: number| null): Promise<IWeb3ProviderSettings> {
    // tslint:disable-next-line:one-variable-per-declaration
    let networkName, etherscanURL;
    switch (networkId) {
      case 1:
        networkName = "mainnet";
        etherscanURL = "https://etherscan.io/";
        break;
      case 3:
        networkName = "ropsten";
        etherscanURL = "https://ropsten.etherscan.io/";
        break;
      case 4:
        networkName = "rinkeby";
        etherscanURL = "https://rinkeby.etherscan.io/";
        break;
      case 42:
        networkName = "kovan";
        etherscanURL = "https://kovan.etherscan.io/";
        break;
      default:
        networkId = 0;
        networkName = "local";
        etherscanURL = "";
        break;
    }
    return {
      networkId,
      networkName,
      etherscanURL
    };
  }

  public async getAssetTokenBalanceOfUser(asset: Asset): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0);
    if (asset === Asset.UNKNOWN) {
      // always 0
      result = new BigNumber(0);
    } else if (asset === Asset.ETH) {
      // get eth (wallet) balance
      result = await this.getEthBalance()
    } else {
      // get erc20 token balance
      const precision = AssetsDictionary.assets.get(asset)!.decimals || 18;
      const assetErc20Address = this.getErc20AddressOfAsset(asset);
      if (assetErc20Address) {
        result = await this.getErc20BalanceOfUser(assetErc20Address);
        result = result.multipliedBy(10 ** (18 - precision));
      }
    }

    return result;
  }

  public getLimitedBorrowAmount = async (borrowRequest: BorrowRequest): Promise<BigNumber> => {
    return borrowRequest.borrowAmount.minus(new BigNumber(-1));
  };

  public getBorrowGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1500000);
  };

  public getBorrowDepositEstimate = async (
    walletType: WalletType,
    borrowAsset: Asset,
    collateralAsset: Asset,
    amount: BigNumber
  ): Promise<IBorrowEstimate> => {
    const result = { depositAmount: new BigNumber(0), gasEstimate: new BigNumber(0) };
    
    if (this.contractsSource && this.web3Wrapper) {
      const iTokenContract = await this.contractsSource.getiTokenContract(borrowAsset);
      const collateralAssetErc20Address = this.getErc20AddressOfAsset(collateralAsset) || "";
      if (amount.gt(0) && iTokenContract && collateralAssetErc20Address) {
        const loanPrecision = AssetsDictionary.assets.get(borrowAsset)!.decimals || 18;
        const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18;
        const borrowEstimate = await iTokenContract.getDepositAmountForBorrow.callAsync(
          amount.multipliedBy(10**loanPrecision),
          new BigNumber(4 * 10**18),
          new BigNumber(7884000), // approximately 3 months
          collateralAssetErc20Address
        );
        result.depositAmount = borrowEstimate
          .multipliedBy(150)
          .dividedBy(125)
          .dividedBy(10**collateralPrecision);
        
        /*result.gasEstimate = await this.web3Wrapper.estimateGasAsync({
          ...
        }));*/
      }
    }

    return result;
  }

  public checkENSSetup = async (user: string): Promise<boolean | undefined> => {
    let result;
    if (this.contractsSource && this.web3Wrapper) {
      const iENSOwnerContract = await this.contractsSource.getiENSOwnerContract();
      if (iENSOwnerContract) {
        result = (await iENSOwnerContract.checkUserSetup.callAsync(user)) !== TorqueProvider.ZERO_ADDRESS;
      }
    }
    return result;
  }

  public checkAndSetApproval = async (asset: Asset, spender: string, amountInBaseUnits: BigNumber): Promise<boolean> => {
    let result = false;

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      let tokenErc20Contract: erc20Contract | null = null;
      const assetErc20Address = this.getErc20AddressOfAsset(asset);
      if (assetErc20Address) {
        tokenErc20Contract = await this.contractsSource.getErc20Contract(assetErc20Address);
      } else {
        throw new Error("No ERC20 contract available!");
      }
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      if (account && tokenErc20Contract) {
        const erc20allowance = await tokenErc20Contract.allowance.callAsync(account, spender);
        if (amountInBaseUnits.gt(erc20allowance)) {
          await tokenErc20Contract.approve.sendTransactionAsync(spender, TorqueProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS, { from: account });
        }
        result = true;
      }
    }

    return result;
  }

  public doBorrow = async (borrowRequest: BorrowRequest) => {
    // console.log(borrowRequest);
    
    if (borrowRequest.borrowAmount.lte(0) || borrowRequest.depositAmount.lte(0)) {
      return;
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      const iTokenContract = await this.contractsSource.getiTokenContract(borrowRequest.borrowAsset);
      const collateralAssetErc20Address = this.getErc20AddressOfAsset(borrowRequest.collateralAsset) || "";
      if (account && iTokenContract && collateralAssetErc20Address) {
        const loanPrecision = AssetsDictionary.assets.get(borrowRequest.borrowAsset)!.decimals || 18;
        const collateralPrecision = AssetsDictionary.assets.get(borrowRequest.collateralAsset)!.decimals || 18;
        const borrowAmountInBaseUnits = new BigNumber(borrowRequest.borrowAmount.multipliedBy(10**loanPrecision).toFixed(0, 1));
        const depositAmountInBaseUnits = new BigNumber(borrowRequest.depositAmount.multipliedBy(10**collateralPrecision).toFixed(0, 1));

        let gasAmountBN;
        if (borrowRequest.collateralAsset === Asset.ETH) {
          try {
            const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
              borrowAmountInBaseUnits,
              new BigNumber(4 * 10**18),
              new BigNumber(7884000), // approximately 3 months
              new BigNumber(0),
              account,
              TorqueProvider.ZERO_ADDRESS,
              "0x",
              { 
                from: account,
                value: depositAmountInBaseUnits,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          } catch(e) {
            // console.log(e);
          }

          const txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
            borrowAmountInBaseUnits,      // borrowAmount
            new BigNumber(4 * 10**18),    // leverageAmount
            new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
            new BigNumber(0),             // collateralTokenSent
            account,                      // borrower
            TorqueProvider.ZERO_ADDRESS,  // collateralTokenAddress
            "0x",                         // loanData
            { 
              from: account,
              value: depositAmountInBaseUnits,
              gas: gasAmountBN ? gasAmountBN.toString() : "2000000",
              gasPrice: await this.gasPrice()
            }
          );
          // console.log(txHash);
        } else {
          await this.checkAndSetApproval(
            borrowRequest.collateralAsset,
            iTokenContract.address,
            depositAmountInBaseUnits
          );

          try {
            const gasAmount = await iTokenContract.borrowTokenFromDeposit.estimateGasAsync(
              borrowAmountInBaseUnits,
              new BigNumber(4 * 10**18),
              new BigNumber(7884000), // approximately 3 months
              depositAmountInBaseUnits,
              account,
              TorqueProvider.ZERO_ADDRESS,
              "0x",
              { 
                from: account,
                gas: this.gasLimit
              }
            );
            gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
          } catch(e) {
            // console.log(e);
          }

          const txHash = await iTokenContract.borrowTokenFromDeposit.sendTransactionAsync(
            borrowAmountInBaseUnits,      // borrowAmount
            new BigNumber(4 * 10**18),    // leverageAmount
            new BigNumber(7884000),       // initialLoanDuration (approximately 3 months)
            depositAmountInBaseUnits,     // collateralTokenSent
            account,                      // borrower
            collateralAssetErc20Address,  // collateralTokenAddress
            "0x",                         // loanData
            { 
              from: account,
              gas: gasAmountBN ? gasAmountBN.toString() : "2000000",
              gasPrice: await this.gasPrice()
            }
          );
          // console.log(txHash);
        }
      }
    }
  
    return;
  };

  public gasPrice = async (): Promise<BigNumber> => {
    let result = new BigNumber(30).multipliedBy(10 ** 9); // upper limit 30 gwei
    const lowerLimit = new BigNumber(3).multipliedBy(10 ** 9); // lower limit 3 gwei

    const url = `https://ethgasstation.info/json/ethgasAPI.json`;
    try {
      const response = await fetch(url);
      const jsonData = await response.json();
      // console.log(jsonData);
      if (jsonData.average) {
        // ethgasstation values need divide by 10 to get gwei
        const gasPriceAvg = new BigNumber(jsonData.average).multipliedBy(10**8);
        const gasPriceSafeLow = new BigNumber(jsonData.safeLow).multipliedBy(10**8);
        if (gasPriceAvg.lt(result)) {
          result = gasPriceAvg;
        } else if (gasPriceSafeLow.lt(result)) {
          result = gasPriceSafeLow;
        }
      }
    } catch (error) {
      // console.log(error);
      result = new BigNumber(12).multipliedBy(10 ** 9); // error default 8 gwei
    }

    if (result.lt(lowerLimit)) {
      result = lowerLimit;
    }

    return result;
  }

  public doDeployManagementContract = async (walletDetails: IWalletDetails) => {
    return ;
  };

  public getLoansList = async (walletDetails: IWalletDetails): Promise<IBorrowedFundsState[]> => {
    let result: IBorrowedFundsState[] = [];
    if (this.contractsSource) {
      const iBZxContract = await this.contractsSource.getiBZxContract();
      if (iBZxContract && walletDetails.walletAddress) {
        const loansData = await iBZxContract.getBasicLoansData.callAsync(walletDetails.walletAddress, new BigNumber(6));
        const zero = new BigNumber(0);
        result = loansData.filter(e => !e.loanTokenAmountFilled.eq(zero)).map(e => {
          const loanAsset = this.contractsSource!.getAssetFromAddress(e.loanTokenAddress);
          const loanPrecision = AssetsDictionary.assets.get(loanAsset)!.decimals || 18;
          const collateralAsset = this.contractsSource!.getAssetFromAddress(e.collateralTokenAddress);
          // const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18;
          return {
            accountAddress: walletDetails.walletAddress || "",
            loanOrderHash: e.loanOrderHash,
            loanAsset: loanAsset,
            collateralAsset: collateralAsset,
            amount: e.loanTokenAmountFilled.dividedBy(10**loanPrecision).dp(5, BigNumber.ROUND_CEIL),
            amountOwed: e.loanTokenAmountFilled.minus(e.interestDepositRemaining).dividedBy(10**loanPrecision).dp(6, BigNumber.ROUND_CEIL),
            collateralizedPercent: e.currentMarginAmount.dividedBy(10**20),
            interestRate: e.interestOwedPerDay.dividedBy(e.loanTokenAmountFilled).multipliedBy(365),
            interestOwedPerDay: e.interestOwedPerDay.dividedBy(10**loanPrecision),
            hasManagementContract: true,
            isInProgress: false,
            loanData: e
          }
        });
        // console.log(result);
      }
    }
    return result;
  };

  public getLoansListTest = async (walletDetails: IWalletDetails): Promise<IBorrowedFundsState[]> => {
    return [
      {
        // TEST ORDER 01
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0x0061583F7764A09B35F5594B5AC5062E090614B7FE2B5EF96ACF16496E8B914C",
        loanAsset: Asset.ETH,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0x2F099560938A4831006D674082201DC31762F2C3926640D4DB3748BDB1A813BF",
        loanAsset: Asset.WBTC,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0x0A708B339C4472EF9A348269FACAD686E18345EC1342E8C171CCB0DF7DB13A28",
        loanAsset: Asset.DAI,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0xAA81E9EA1EABE0EBB47A6557716839A7C149864220F10EB628E4DEA6249262DE",
        loanAsset: Asset.BAT,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0xD826732AC58AB77E4EE0EB80B95D8BC9053EDAB328E5E4DDEAF6DA9BF1A6FCEB",
        loanAsset: Asset.MKR,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0xE6F8A9C8CDF06CA7C73ACD0B1F414EDB4CE23AD8F9144D22463686A11DD53561",
        loanAsset: Asset.KNC,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      },
      {
        accountAddress: walletDetails.walletAddress || "0x1a9f2F3697EbFB35ab0bf337fd7f847637931D4C",
        loanOrderHash: "0xA4B2E54FDA03335C1EF63A939A06E2192E0661F923E7C048CDB94B842016CA61",
        loanAsset: Asset.USDC,
        collateralAsset: Asset.ETH,
        amount: BigNumber.random(),
        amountOwed: BigNumber.random(),
        collateralizedPercent: BigNumber.random(),
        interestRate: BigNumber.random(),
        interestOwedPerDay: BigNumber.random(),
        hasManagementContract: true,
        isInProgress: false
      }
    ];
  };

  public getSetupENSAddress = async (): Promise<string | null> => {
    return `tokenloan.eth`;
  };

  public getLoanCollateralManagementManagementAddress = async (
    asset: Asset,
    walletDetails: IWalletDetails,
    borrowedFundsState: IBorrowedFundsState,
    loanValue: BigNumber,
    selectedValue: BigNumber
  ): Promise<string | null> => {
    if (walletDetails.walletType === WalletType.NonWeb3) {
      return `topup.${asset.toLowerCase()}.tokenloan.eth`;
    } else {
      return `${loanValue > selectedValue ? `withdraw.${asset.toLowerCase()}.tokenloan.eth` : `topup.${asset.toLowerCase()}.tokenloan.eth`}`;
    }
  };

  public getPositionSafetyText = (borrowedFundsState: IBorrowedFundsState): string => {
    if (borrowedFundsState.collateralizedPercent.gt(0.25)) {
      return "Safe";
    } else if (borrowedFundsState.collateralizedPercent.gt(0.15)) {
      return "Danger";
    } else {
      return "Liquidation Pending";
    }
  };

  public getLoanCollateralManagementGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1000000);
  };

  public getLoanCollateralManagementParams = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<ICollateralManagementParams> => {
    return { minValue: 0, maxValue: 100, currentValue: borrowedFundsState.collateralizedPercent.multipliedBy(100).toNumber() };
  };

  public getLoanCollateralChangeEstimate = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState, loanValue: BigNumber, newValue: BigNumber): Promise<ICollateralChangeEstimate> => {

    const result = {
      diffAmount: 0, // new BigNumber(Math.abs(newValue - loanValue) * 2 ),
      collateralizedPercent: new BigNumber(0),
      liquidationPrice: new BigNumber(0),
      gasEstimate: new BigNumber(0)
    };

    if (this.contractsSource && this.web3Wrapper && borrowedFundsState.loanData) {
      const oracleContract = await this.contractsSource.getOracleContract();
      const collateralAsset = this.contractsSource!.getAssetFromAddress(borrowedFundsState.loanData.collateralTokenAddress);
      const collateralPrecision = AssetsDictionary.assets.get(collateralAsset)!.decimals || 18;
      let newAmount = new BigNumber(0);
      if (newValue && newValue.gt(0)) {
        newAmount = newValue.multipliedBy(10**collateralPrecision);
      }
      try {
        const newCurrentMargin: BigNumber = await oracleContract.getCurrentMarginAmount.callAsync(
          borrowedFundsState.loanData.loanTokenAddress,
          borrowedFundsState.loanData.loanTokenAddress, // positionTokenAddress
          borrowedFundsState.loanData.collateralTokenAddress,
          borrowedFundsState.loanData.loanTokenAmountFilled,
          borrowedFundsState.loanData.positionTokenAmountFilled,
          borrowedFundsState.loanData.collateralTokenAmountFilled.plus(newAmount)
        );
        result.collateralizedPercent = newCurrentMargin.dividedBy(10**18).plus(100);
      } catch(e) {
        // console.log(e);
        result.collateralizedPercent = borrowedFundsState.collateralizedPercent.times(100).plus(100);
      }
    }

    return result;
  };

  public setupENS = async (setupENSRequest: SetupENSRequest) => {
    return ;
  };

  public setLoanCollateral = async (manageCollateralRequest: ManageCollateralRequest) => {
    return ;
  };

  public getLoanRepayGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(2000000);
  };

  public getLoanRepayAddress = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<string | null> => {
    return `repay.${borrowedFundsState.loanAsset.toLowerCase()}.tokenloan.eth`;
  };

  public getLoanRepayParams = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<IRepayState> => {
    return (walletDetails.walletType === WalletType.Web3)
        ? { minValue: 0, maxValue: 100, currentValue: 100 }
        : { minValue: 0, maxValue: 100, currentValue: 100 };
  };

  public getLoanRepayEstimate = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState, repayPercent: number): Promise<IRepayEstimate> => {
    return (walletDetails.walletType === WalletType.NonWeb3)
      ? { repayAmount: new BigNumber(0) }
      : { repayAmount: borrowedFundsState.amountOwed.multipliedBy(repayPercent).dividedBy(100) };
  };

  public doRepayLoan = async (repayLoanRequest: RepayLoanRequest) => {
    // console.log(repayLoanRequest);

    if (repayLoanRequest.repayAmount.lte(0)) {
      return;
    }

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      const bZxContract = await this.contractsSource.getiBZxContract();
      if (account && bZxContract) {
        const loanPrecision = AssetsDictionary.assets.get(repayLoanRequest.borrowAsset)!.decimals || 18;
        let closeAmountInBaseUnits;
        if (repayLoanRequest.repayPercent.gte(100)) {
          // send a large amount to close entire loan
          closeAmountInBaseUnits = new BigNumber(repayLoanRequest.repayAmount.multipliedBy(10000**loanPrecision).toFixed(0, 1))
        } else {
          closeAmountInBaseUnits = new BigNumber(repayLoanRequest.repayAmount.multipliedBy(10**loanPrecision).toFixed(0, 1));
        }

        if (repayLoanRequest.borrowAsset !== Asset.ETH) {
          await this.checkAndSetApproval(
            repayLoanRequest.borrowAsset,
            this.contractsSource.getVaultAddress().toLowerCase(),
            closeAmountInBaseUnits,
            
          );
        }

        let gasAmountBN;
        try {
          const gasAmount = await bZxContract.paybackLoanAndClose.estimateGasAsync(
            repayLoanRequest.loanOrderHash,
            account,
            account,
            this.isETHAsset(repayLoanRequest.collateralAsset) ? 
              TorqueProvider.ZERO_ADDRESS: // will refund with ETH  
              account,
            closeAmountInBaseUnits,
            { 
              from: account,
              value: repayLoanRequest.borrowAsset === Asset.ETH ?
                closeAmountInBaseUnits :
                undefined,
              gas: this.gasLimit
            }
          );
          gasAmountBN = new BigNumber(gasAmount).multipliedBy(this.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
        } catch(e) {
          // console.log(e);
        }

        const txHash = await bZxContract.paybackLoanAndClose.sendTransactionAsync(
          repayLoanRequest.loanOrderHash,                       // loanOrderHash
          account,                                              // borrower
          account,                                              // payer
          this.isETHAsset(repayLoanRequest.collateralAsset) ?   // receiver
            TorqueProvider.ZERO_ADDRESS:                        // will refund with ETH  
            account,
          closeAmountInBaseUnits,                               // closeAmount
          { 
            from: account,
            value: repayLoanRequest.borrowAsset === Asset.ETH ?
              closeAmountInBaseUnits :
              undefined,
            gas: gasAmountBN ? gasAmountBN.toString() : "2000000",
            gasPrice: await this.gasPrice()
          }
        );
        // console.log(txHash);
      }
    }

    return;
  };

  public isETHAsset = (asset: Asset): boolean => {
    return asset === Asset.ETH || asset === Asset.WETH;
  }

  public getLoanExtendGasAmount = async (): Promise<BigNumber> => {
    return new BigNumber(1000000);
  };

  public getLoanExtendManagementAddress = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<string | null> => {
    return `extend.${borrowedFundsState.loanAsset.toLowerCase()}.tokenloan.eth`;
  };

  public getLoanExtendParams = async (walletDetails: IWalletDetails, borrowedFundsState: IBorrowedFundsState): Promise<IExtendState> => {
    return { minValue: 1, maxValue: 365, currentValue: 90 };
  };

  public getLoanExtendEstimate = async (interestOwedPerDay: BigNumber, daysToAdd: number): Promise<IExtendEstimate> => {
    return { depositAmount: interestOwedPerDay.multipliedBy(daysToAdd) };
  };

  public doExtendLoan = async (extendLoanRequest: ExtendLoanRequest) => {
    return ;
  };

  public getAssetInterestRate = async (asset: Asset): Promise<BigNumber> => {
    let result = new BigNumber(0);
    
    if (this.contractsSource && this.web3Wrapper) {
      const iTokenContract = await this.contractsSource.getiTokenContract(asset);
      if (iTokenContract) {
        let borrowRate = await iTokenContract.nextBorrowInterestRate.callAsync(new BigNumber("0"));
        borrowRate = borrowRate.dividedBy(10**18);

        if (borrowRate.gt(new BigNumber(16))) {
          result = borrowRate;
        } else {
          result = new BigNumber(16);
        }
      }
    }

    return result;
  };

  public getErc20AddressOfAsset(asset: Asset): string | null {
    let result: string | null = null;

    const assetDetails = AssetsDictionary.assets.get(asset);
    if (this.web3ProviderSettings && assetDetails) {
      result = assetDetails.addressErc20.get(this.web3ProviderSettings.networkId) || "";
    }
    return result;
  }

  public async getEthBalance(): Promise<BigNumber> {
    let result: BigNumber = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      const account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : null;
      if (account) {
        const balance = await this.web3Wrapper.getBalanceInWeiAsync(account);
        result = new BigNumber(balance);
      }
    }

    return result;
  }

  private async getErc20BalanceOfUser(addressErc20: string, account?: string): Promise<BigNumber> {
    let result = new BigNumber(0);

    if (this.web3Wrapper && this.contractsSource) {
      if (!account && this.contractsSource.canWrite) {
        account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : undefined;
      }

      if (account) {
        const tokenContract = await this.contractsSource.getErc20Contract(addressErc20);
        if (tokenContract) {
          result = await tokenContract.balanceOf.callAsync(account);
        }
      }
    }

    return result;
  }

  public async getErc20BalancesOfUser(addressesErc20: string[], account?: string): Promise<Map<string, BigNumber>> {
    let result: Map<string, BigNumber> = new Map<string, BigNumber>();
    if (this.web3Wrapper && this.contractsSource && this.contractsSource.canWrite) {
      if (!account && this.contractsSource.canWrite) {
        account = this.accounts.length > 0 && this.accounts[0] ? this.accounts[0].toLowerCase() : undefined;
      }
      if (account) {
        // @ts-ignore
        const resp = await Web3ConnectionFactory.alchemyProvider!.alchemy!.getTokenBalances(account, addressesErc20);
        if (resp) {
          // @ts-ignore
          result = resp.tokenBalances.filter(t => !t.error && t.tokenBalance !== "0").reduce((map, obj) => (map.set(obj.contractAddress, new BigNumber(obj.tokenBalance!)), map), new Map<string, BigNumber>());
        }
      }
    }
    return result;
  }

  private getGoodSourceAmountOfAsset(asset: Asset): BigNumber {
    switch (asset) {
      case Asset.WBTC:
        return new BigNumber(10**6);
      case Asset.USDC:
        return new BigNumber(10**4);
      default:
        return new BigNumber(10**16);
    }
  }

  public waitForTransactionMined = async (
    txHash: string): Promise<any> => {

    return new Promise((resolve, reject) => {
      try {
        if (!this.web3Wrapper) {
          throw new Error("web3 is not available");
        }

        this.waitForTransactionMinedRecursive(txHash, this.web3Wrapper, resolve, reject);
      } catch (e) {
        throw e;
      }
    });
  };

  private waitForTransactionMinedRecursive = async (
    txHash: string,
    web3Wrapper: Web3Wrapper,
    resolve: (value: any) => void,
    reject: (value: any) => void) => {

    try {
      const receipt = await web3Wrapper.getTransactionReceiptIfExistsAsync(txHash);
      if (receipt) {
        resolve(receipt);
      } else {
        window.setTimeout(() => {
          this.waitForTransactionMinedRecursive(txHash, web3Wrapper, resolve, reject);
        }, 5000);
      }
    }
    catch (e) {
      reject(e);
    }
  };

  public sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// tslint:disable-next-line
new TorqueProvider();
