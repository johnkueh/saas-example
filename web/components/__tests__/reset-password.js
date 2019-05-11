import 'jest-dom/extend-expect';
import React from 'react';
import { render, fireEvent, cleanup, wait } from 'react-testing-library';
import ResetPassword from '../reset-password';

afterEach(() => {
  cleanup();
});

it('displays go to login if no token', () => {
  const handler = jest.fn();
  const { container } = render(<ResetPassword onSubmit={handler} />);

  expect(container).not.toHaveTextContent('Set a new password for your account');
  expect(container).not.toHaveTextContent('New password');
  expect(container).toHaveTextContent('Go to login');
});

it('displays success messages', () => {
  const handler = jest.fn();
  const { getByText } = render(
    <ResetPassword
      token="aabbcc"
      messages={{ success: { password: 'Your password has been reset' } }}
      onSubmit={handler}
    />
  );

  const alert = getByText('Your password has been reset');
  expect(alert.parentNode).toHaveClass('alert alert-success');
  expect(alert).toHaveTextContent('Your password has been reset');
});

it('displays error messages', () => {
  const handler = jest.fn();
  const { getByText } = render(
    <ResetPassword
      token="aabbcc"
      messages={{ error: { password: 'New password is too short' } }}
      onSubmit={handler}
    />
  );

  const alert = getByText('New password is too short');
  expect(alert.parentNode).toHaveClass('alert alert-error');
});

it('sets token', () => {
  const handler = jest.fn();
  const { container } = render(<ResetPassword token="aabbcc" onSubmit={handler} />);

  expect(container.firstChild).toHaveFormValues({
    token: 'aabbcc'
  });
});

it('submits with correct data', async () => {
  const handler = jest.fn((_, { setSubmitting }) => {
    setSubmitting(false);
  });
  const { container, getByText, getByPlaceholderText } = render(
    <ResetPassword token="aabbcc" onSubmit={handler} />
  );
  fireEvent.change(getByPlaceholderText('New password'), { target: { value: 'newpassword' } });
  fireEvent.change(getByPlaceholderText('Re-enter new password'), {
    target: { value: 'newpassword' }
  });
  const submitButton = getByText(/reset password/i);
  expect(container.firstChild).toHaveFormValues({
    password: 'newpassword',
    repeatPassword: 'newpassword'
  });
  expect(submitButton).not.toHaveAttribute('disabled');
  fireEvent.click(submitButton);
  expect(submitButton).toHaveAttribute('disabled');
  await wait(() => {
    expect(handler).toHaveBeenCalledWith(
      { password: 'newpassword', repeatPassword: 'newpassword', token: 'aabbcc' },
      expect.objectContaining({ setSubmitting: expect.any(Function) })
    );
    expect(submitButton).not.toHaveAttribute('disabled');
  });
});
