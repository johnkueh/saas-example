import 'jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, cleanup, wait } from 'react-testing-library';
import Login from '../log-in';

afterEach(() => {
  cleanup();
});

it('displays errors', () => {
  const handler = jest.fn();
  const { container } = render(
    <Login messages={{ errors: { name: 'Too long', email: 'Not an email' } }} onSubmit={handler} />
  );

  expect(container).toHaveTextContent('Too long');
  expect(container).toHaveTextContent('Not an email');
});

it('submits with correct data', async () => {
  const handler = jest.fn((_, { setSubmitting }) => {
    setSubmitting(false);
  });
  const { container, getByText, getByPlaceholderText } = render(<Login onSubmit={handler} />);

  fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'test@user.com' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });

  const submitButton = getByText(/log in/i);

  expect(container.firstChild).toHaveFormValues({
    email: 'test@user.com',
    password: 'password'
  });

  expect(submitButton).not.toHaveAttribute('disabled');
  fireEvent.click(submitButton);
  expect(submitButton).toHaveAttribute('disabled');

  await wait(() => {
    expect(handler).toHaveBeenCalledWith(
      { email: 'test@user.com', password: 'password' },
      expect.objectContaining({ setSubmitting: expect.any(Function) })
    );
    expect(submitButton).not.toHaveAttribute('disabled');
  });
});
