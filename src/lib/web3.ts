import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers';

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  const provider = new BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);
  const signer = await provider.getSigner();
  const network = await provider.getNetwork();
  const balance = await provider.getBalance(accounts[0]);

  return {
    address: accounts[0],
    chainId: Number(network.chainId),
    balance: formatEther(balance),
    signer,
  };
}

export async function switchNetwork(chainId: number) {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed');
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${chainId.toString(16)}` }],
    });
    return true;
  } catch (error: any) {
    if (error.code === 4902) {
      // Chain not added to MetaMask
      return false;
    }
    throw error;
  }
}

export async function purchaseTemplate(
  marketplace: any,
  templateId: string,
  price: number
) {
  if (!marketplace) {
    throw new Error('Marketplace contract not initialized');
  }

  return marketplace.purchaseTemplate(templateId, {
    value: parseEther(price.toString())
  });
}
