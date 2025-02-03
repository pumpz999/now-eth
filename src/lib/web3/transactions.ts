import { ethers } from 'ethers';
import { web3Service } from './contracts';

export class TransactionService {
  async sendTransaction(transaction: ethers.TransactionRequest) {
    const signer = await web3Service.getSigner();
    const gasPrice = await web3Service.getGasPrice();
    const gasLimit = await web3Service.estimateGas(transaction);

    const tx = await signer.sendTransaction({
      ...transaction,
      gasPrice: gasPrice.gasPrice,
      gasLimit: gasLimit,
    });

    return tx;
  }

  async waitForTransaction(txHash: string) {
    const provider = await web3Service.getProvider();
    const receipt = await provider.waitForTransaction(txHash);
    return receipt;
  }

  async deployContract(abi: any[], bytecode: string, args: any[] = []) {
    const signer = await web3Service.getSigner();
    const factory = new ethers.ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(...args);
    await contract.waitForDeployment();
    return contract;
  }
}

export const transactionService = new TransactionService();
