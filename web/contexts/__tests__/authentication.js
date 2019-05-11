import React, { useContext } from 'react';
import { render, fireEvent, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import AuthProvider, { AuthContext } from '../authentication';

let isLoggedIn;
let jwt;
let user;
let setIsLoggedIn;
let setJwt;
let setUser;
let getByTestId;

beforeEach(() => {
  const Child = props => {
    ({ isLoggedIn, jwt, user, setIsLoggedIn, setJwt, setUser } = useContext(AuthContext));
    return (
      <div>
        <button
          type="button"
          data-testid="login"
          onClick={() => {
            setIsLoggedIn(true);
          }}
        >
          Login
        </button>
        <button
          type="button"
          data-testid="logout"
          onClick={() => {
            setIsLoggedIn(false);
          }}
        >
          Logout
        </button>
        <button
          type="button"
          data-testid="set_jwt"
          onClick={() => {
            setJwt('fake-jwt');
          }}
        >
          Set JWT
        </button>
        <button
          type="button"
          data-testid="set_user"
          onClick={() => {
            setUser({
              email: 'test@user.com'
            });
          }}
        >
          Set User
        </button>
      </div>
    );
  };

  ({ getByTestId } = render(
    <AuthProvider>
      <Child />
    </AuthProvider>
  ));
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

it('able to set isLoggedIn', () => {
  expect(isLoggedIn).toBe(false);

  fireEvent.click(getByTestId('login'));
  expect(isLoggedIn).toBe(true);

  fireEvent.click(getByTestId('logout'));
  expect(isLoggedIn).toBe(false);
});

it('able to set jwt', () => {
  expect(jwt).toBe(null);
  fireEvent.click(getByTestId('set_jwt'));
  expect(jwt).toBe('fake-jwt');
});

it('able to set user', () => {
  expect(user).toEqual({});
  fireEvent.click(getByTestId('set_user'));
  expect(user).toEqual({
    email: 'test@user.com'
  });
});

it('able to set both jwt isLoggedIn', () => {
  expect(isLoggedIn).toBe(false);
  expect(jwt).toBe(null);

  fireEvent.click(getByTestId('login'));
  fireEvent.click(getByTestId('set_jwt'));

  expect(isLoggedIn).toBe(true);
  expect(jwt).toBe('fake-jwt');
});
