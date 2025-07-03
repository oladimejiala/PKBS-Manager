import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import transactionReducer from './slices/transactionSlice';
import salesReducer from './slices/salesSlice';
import sourcingReducer from './slices/sourcingSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
    sales: salesReducer,
    sourcing: sourcingReducer,
  },
  // Optional middleware & devtools config here
});

export default store;
