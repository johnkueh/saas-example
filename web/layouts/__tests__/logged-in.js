import React from 'react';
import * as RouterMock from 'next/router';
import * as HooksMock from 'react-apollo-hooks';
import { render, cleanup } from 'react-testing-library';
import 'jest-dom/extend-expect';
import Layout from '../logged-in';
import { AuthContext } from '../../contexts/authentication';

beforeEach(() => {
  RouterMock.default.push = jest.fn();
});

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

it('shows loading when fetching data', () => {
  HooksMock.useQuery = jest.fn().mockReturnValue({
    error: null,
    loading: true
  });

  const { container } = render(
    <AuthContext.Provider
      value={{
        isLoggedIn: false,
        user: {}
      }}
    >
      <Layout>
        <div>Children</div>
      </Layout>
    </AuthContext.Provider>
  );

  expect(container).toHaveTextContent('Loading...');
  expect(container).not.toHaveTextContent('Children');
  expect(container).not.toHaveTextContent('Logout');
});

it('shows layout elements and children when logged in', () => {
  HooksMock.useQuery = jest.fn().mockReturnValue({
    error: null,
    loading: false
  });

  const { container } = render(
    <AuthContext.Provider
      value={{
        isLoggedIn: true,
        user: {
          email: 'test@user.com'
        }
      }}
    >
      <Layout>
        <div>Children</div>
      </Layout>
    </AuthContext.Provider>
  );

  expect(container).not.toHaveTextContent('Loading...');
  expect(container).toHaveTextContent('Children');
  expect(container).toHaveTextContent('Logout');
  expect(container).toHaveTextContent('test@user.com');
});

it('redirects to /login if not logged in', () => {
  HooksMock.useQuery = jest.fn().mockReturnValue({
    error: null,
    loading: false
  });

  render(
    <AuthContext.Provider
      value={{
        isLoggedIn: false,
        user: {}
      }}
    >
      <Layout>
        <div>Children</div>
      </Layout>
    </AuthContext.Provider>
  );

  expect(RouterMock.default.push).toHaveBeenCalledWith('/login');
});

it('redirects to /login if query for profile has errors', () => {
  HooksMock.useQuery = jest.fn().mockReturnValue({
    error: {
      auth: 'Authentication error'
    },
    loading: false
  });

  render(
    <AuthContext.Provider
      value={{
        isLoggedIn: true,
        user: {}
      }}
    >
      <Layout>
        <div>Children</div>
      </Layout>
    </AuthContext.Provider>
  );

  expect(RouterMock.default.push).toHaveBeenCalledWith('/login');
});
