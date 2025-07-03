import {
  LOGIN_START,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
  FETCH_TRANSACTIONS_START,
  FETCH_TRANSACTIONS_SUCCESS,
  FETCH_TRANSACTIONS_FAILURE,
} from './actions';

// Auth reducer
const initialAuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export function authReducer(state = initialAuthState, action) {
  switch (action.type) {
    case LOGIN_START:
      return { ...state, loading: true, error: null };
    case LOGIN_SUCCESS:
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token };
    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case LOGOUT:
      return { ...state, user: null, token: null };
    default:
      return state;
  }
}

// Transactions reducer
const initialTransactionState = {
  data: [],
  loading: false,
  error: null,
};

export function transactionReducer(state = initialTransactionState, action) {
  switch (action.type) {
    case FETCH_TRANSACTIONS_START:
      return { ...state, loading: true, error: null };
    case FETCH_TRANSACTIONS_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_TRANSACTIONS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}
