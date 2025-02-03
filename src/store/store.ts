import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import walletReducer from './slices/walletSlice';
import templateReducer from './slices/templateSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    wallet: walletReducer,
    template: templateReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['wallet/setProvider', 'wallet/setSigner'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.provider', 'payload.signer'],
        // Ignore these paths in the state
        ignoredPaths: ['wallet.provider', 'wallet.signer'],
      },
    }),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
