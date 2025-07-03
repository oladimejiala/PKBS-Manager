// action types
export const LOGIN_START = 'LOGIN_START';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILURE = 'LOGIN_FAILURE';
export const LOGOUT = 'LOGOUT';

export const FETCH_TRANSACTIONS_START = 'FETCH_TRANSACTIONS_START';
export const FETCH_TRANSACTIONS_SUCCESS = 'FETCH_TRANSACTIONS_SUCCESS';
export const FETCH_TRANSACTIONS_FAILURE = 'FETCH_TRANSACTIONS_FAILURE';

// Action creators

// Auth
export const loginStart = () => ({ type: LOGIN_START });
export const loginSuccess = (user, token) => ({ type: LOGIN_SUCCESS, payload: { user, token } });
export const loginFailure = (error) => ({ type: LOGIN_FAILURE, payload: error });
export const logout = () => ({ type: LOGOUT });

// Transactions
export const fetchTransactionsStart = () => ({ type: FETCH_TRANSACTIONS_START });
export const fetchTransactionsSuccess = (transactions) => ({ type: FETCH_TRANSACTIONS_SUCCESS, payload: transactions });
export const fetchTransactionsFailure = (error) => ({ type: FETCH_TRANSACTIONS_FAILURE, payload: error });

// Thunk async action example (requires redux-thunk middleware)
import { fetchAllTransactions } from '../services/api';

export const fetchTransactions = () => {
  return async (dispatch) => {
    dispatch(fetchTransactionsStart());
    try {
      const data = await fetchAllTransactions();
      dispatch(fetchTransactionsSuccess(data));
    } catch (error) {
      dispatch(fetchTransactionsFailure(error.message));
    }
  };
};
