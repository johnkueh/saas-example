import React, { useReducer } from 'react';
import PropTypes from 'prop-types';
import { getItem, setItem } from '../lib/local-storage';

// For server side vs client side in next.js
let initialState = {
  isLoggedIn: false,
  jwt: null,
  user: {}
};

if (process.browser) {
  initialState = {
    isLoggedIn: getItem('isLoggedIn'),
    jwt: getItem('jwt'),
    user: getItem('user') || {}
  };
}
// end

const reducer = (state, action) => {
  switch (action.type) {
    case 'auth.SET_JWT':
      setItem('jwt', action.jwt);
      return {
        ...state,
        jwt: action.jwt
      };
    case 'auth.SET_USER':
      setItem('user', action.user);
      return {
        ...state,
        user: action.user
      };
    case 'auth.SET_IS_LOGGED_IN':
      setItem('isLoggedIn', action.isLoggedIn);
      return {
        ...state,
        isLoggedIn: action.isLoggedIn
      };
    default:
      return initialState;
  }
};

export const AuthContext = React.createContext(initialState);

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        setUser: user => {
          dispatch({ type: 'auth.SET_USER', user });
        },
        setJwt: jwt => {
          dispatch({ type: 'auth.SET_JWT', jwt });
        },
        setIsLoggedIn: isLoggedIn => {
          dispatch({ type: 'auth.SET_IS_LOGGED_IN', isLoggedIn });
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};
