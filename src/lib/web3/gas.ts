import { ethers } from 'ethers';
import { web3Service } from './contracts';

export class GasService {
  private async getGasPrice() {
    const feeData = await web3Service.getGasPrice();
    return {
      standard: feeData.gasPrice,
      fast: feeData.gasPrice! * BigInt(120) / BigInt(100), // 20% higher
      fastest: feeData.gasPrice! * BigInt(150) / BigInt(100), // 50% higher
    };
  }

  async optimizeGas(transaction: ethers.TransactionRequest, speed: 'standard' | 'fast' | 'fastest' = 'standard') {
    const gasPrices = await this.getGasPrice();
    const gasLimit = await web3Service.estimateGas(transaction);
    
    // Add 20% buffer to estimated gas limit for safety
    const safeGasLimit = gasLimit * BigInt(120) / BigInt(100);

    return {
      ...transaction,
      gasLimit: safeGasLimit,
      gasPrice: gasPrices[speed],
      type: 2, // EIP-1559 transaction type
    };
  }

  async estimateTransactionCost(transaction: ethers.TransactionRequest) {
    const gasPrices = await this.getGasPrice();
    const gasLimit = await web3Service.estimateGas(transaction);

    return {
      standard: (gasLimit * gasPrices.standard),
      fast: (gasLimit * gasPrices.fast),
      fastest: (gasLimit * gasPrices.fastest),
    };
  }
}

export const gasService = new GasService();
