import 'jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, cleanup, wait } from 'react-testing-library';
import Signup from '../sign-up';

afterEach(() => {
  cleanup();
});

it('displays errors', () => {
  const handler = jest.fn();
  const { container } = render(
    <Signup messages={{ errors: { name: 'Too long', email: 'Not an email' } }} onSubmit={handler} />
  );

  expect(container).toHaveTextContent('Too long');
  expect(container).toHaveTextContent('Not an email');
});

it('submits with correct data', async () => {
  const handler = jest.fn((_, { setSubmitting }) => {
    setSubmitting(false);
  });
  const { container, getByText, getByPlaceholderText } = render(<Signup onSubmit={handler} />);

  fireEvent.change(getByPlaceholderText('Name'), { target: { value: 'John Doe' } });
  fireEvent.change(getByPlaceholderText('Email address'), { target: { value: 'test@user.com' } });
  fireEvent.change(getByPlaceholderText('Password'), { target: { value: 'password' } });

  const submitButton = getByText(/sign up/i);

  expect(container.firstChild).toHaveFormValues({
    name: 'John Doe',
    email: 'test@user.com',
    password: 'password'
  });

  expect(submitButton).not.toHaveAttribute('disabled');
  fireEvent.click(submitButton);
  expect(submitButton).toHaveAttribute('disabled');

  await wait(() => {
    expect(handler).toHaveBeenCalledWith(
      { email: 'test@user.com', name: 'John Doe', password: 'password' },
      expect.objectContaining({ setSubmitting: expect.any(Function) })
    );
    expect(submitButton).not.toHaveAttribute('disabled');
  });
});
