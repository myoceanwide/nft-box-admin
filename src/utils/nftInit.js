/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/

import detectEthereumProvider from '@metamask/detect-provider';
import { Message } from 'element-ui';

export default class NftProvider {
  constructor() {
    this.isInstall = false;
    this.isLogin = false;
    this.provider = null;
    this.chainId = null;
    this.currentAccount = null;
    this.init();
  }

  async init() {
    // this returns the provider, or null if it wasn't detected
    this.provider = await detectEthereumProvider();

    if (this.provider) {
      this.isInstall = true;
      this.startApp(this.provider); // Initialize your app
    } else {
      Message.warning('未安装MetaMask, MetaMask功能暂不可用');
      console.log('Please install MetaMask!');
    }
  }

  /**
   * 创建
   * chainId监听事件
   * account监听事件
   * 动态监听变化
   * @param {} provider
   */
  async startApp(provider) {
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
    }

    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/

    this.chainId = await provider.request({ method: 'eth_chainId' });
    // this.handleChainChanged(this.chainId);
    this.provider.on('chainChanged', this.handleChainChanged);

    /***********************************************************/
    /* Handle user accounts and accountsChanged (per EIP-1193) */
    /***********************************************************/

    this.watchAccounts();
    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    this.provider.on('accountsChanged', this.handleAccountsChanged);
    // Access the decentralized web!
  }

  watchAccounts() {
    this.provider
      .request({ method: 'eth_accounts' })
      .then((accounts) => this.handleAccountsChanged(accounts))
      .catch((err) => {
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available,
        // eth_accounts will return an empty array.
        console.error(err);
      });
  }

  /**
   * 移除监听事件！
   */
  removeLister() {
    this.provider.removeListener('chainChanged', this.handleChainChanged);
    this.provider.removeListener('accountsChanged', this.handleAccountsChanged);
  }

  handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  // For now, 'eth_accounts' will continue to always return an array
  handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
      Message.warning('MetaMask is unconnected, please connect to MetaMask.');
    } else if (accounts[0] !== this.currentAccount) {
      this.currentAccount = accounts[0];
      // Do any other work!
    }
  }

  /*********************************************/
  /* Access the user's accounts (per EIP-1102) */
  /*********************************************/

  // You should only attempt to request the user's accounts in response to user
  // interaction, such as a button click.
  // Otherwise, you popup-spam the user like it's 1999.
  // If you fail to retrieve the user's account(s), you should encourage the user
  // to initiate the attempt.

  // While you are awaiting the call to eth_requestAccounts, you should disable
  // any buttons the user can click to initiate the request.
  // MetaMask will reject any additional requests while the first is still
  // pending.
  // 未连接的时候，可触发直接打开 Metamask, 已连接则无任何操作
  connect() {
    if (!this.isInstall)
      return Message.warning('未安装MetaMask,请先安装MetaMask');

    this.provider
      .request({ method: 'eth_requestAccounts' })
      .then((accounts) => {
        this.handleAccountsChanged(accounts);
        this.isLogin = true;
      })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
          Message.warning(
            'MetaMask is unconnected, please connect to MetaMask.'
          );
        } else if (err.code === -32002) {
          Message.error(`已发出连接账号的请求，请直接打开MetaMask进行连接`);
        } else {
          console.error(err);
          Message.error(
            `[MetaMask存在操作，请先结束操作~]${err.code}:${err.message}`
          );
        }
      });
  }

  /**
   *
   * @param {
   *  to: contact address
   * } row
   */
  sendTransaction(row) {
    if (!this.isInstall || !this.isLogin) return;
    let params = [
      {
        to: row.to,
        from: this.currentAccount,
        chainId: this.chainId,
      },
    ];
    this.provider
      .request({
        method: 'eth_sendTransaction',
        params,
      })
      .then((res) => {
        console.log('go', res);
      })
      .catch((err) => {
        Message.error(`${err.code}: ${err.message}`);
        console.log('catch err', err);
      });
  }
}
