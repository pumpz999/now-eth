import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface WalletState {
  address: string | null;
  chainId: number | null;
  balance: string | null;
  isConnected: boolean;
  provider: any | null;
  signer: any | null;
}

const initialState: WalletState = {
  address: null,
  chainId: null,
  balance: null,
  isConnected: false,
  provider: null,
  signer: null,
};

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletInfo: (
      state,
      action: PayloadAction<{
        address: string;
        chainId: number;
        balance: string;
      }>
    ) => {
      state.address = action.payload.address;
      state.chainId = action.payload.chainId;
      state.balance = action.payload.balance;
      state.isConnected = true;
    },
    setProvider: (state, action: PayloadAction<any>) => {
      state.provider = action.payload;
    },
    setSigner: (state, action: PayloadAction<any>) => {
      state.signer = action.payload;
    },
    disconnect: (state) => {
      state.address = null;
      state.chainId = null;
      state.balance = null;
      state.isConnected = false;
      state.provider = null;
      state.signer = null;
    },
  },
});

export const { setWalletInfo, setProvider, setSigner, disconnect } = walletSlice.actions;

export const selectWallet = (state: RootState) => state.wallet;

export default walletSlice.reducer;