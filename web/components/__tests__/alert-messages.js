import 'jest-dom/extend-expect';
import React from 'react';
import { render, cleanup } from 'react-testing-library';
import Alert from '../alert-messages';

afterEach(() => {
  cleanup();
});

it('does not render anything if empty', () => {
  const { container } = render(<Alert />);

  expect(container).toBeEmpty();
});

it('renders success alert type', () => {
  const { getByText } = render(
    <Alert
      messages={{
        success: { email: 'Email is available!' }
      }}
    />
  );

  const alert = getByText('Email is available!');
  expect(alert).toHaveTextContent('Email is available!');
  expect(alert.parentNode).toHaveClass('alert alert-success');
});

it('renders error alert type', () => {
  const { getByText } = render(
    <Alert
      messages={{
        error: { name: 'Name is too long' }
      }}
    />
  );

  const alert = getByText('Name is too long');
  expect(alert.parentNode).toHaveClass('alert alert-error');
});
