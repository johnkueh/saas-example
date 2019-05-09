import sgMail from '@sendgrid/mail';
import { graphqlRequest, prisma } from '../../lib/test-util';
import {
  ME,
  SIGNUP,
  LOGIN,
  UPDATE_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  DELETE_USER
} from '../../queries/user';

let user;
let jwt;

beforeEach(async () => {
  ({
    data: {
      signup: { user, jwt }
    }
  } = await graphqlRequest({
    query: SIGNUP,
    variables: {
      input: {
        name: 'Test User',
        email: 'test@user.com',
        password: 'testpassword'
      }
    }
  }));
});

afterEach(async () => {
  await prisma.deleteManyUsers();
});

it('able to get user profile', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: ME
  });

  expect(res.data.me).toEqual({
    email: user.email,
    name: user.name
  });
});

it('able to login successfully', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: LOGIN,
    variables: {
      input: {
        email: user.email,
        password: 'testpassword'
      }
    }
  });

  expect(res.data).toEqual({
    login: expect.objectContaining({
      jwt: expect.any(String),
      user: {
        email: user.email,
        name: user.name
      }
    })
  });
});

it('able to signup successfully', async () => {
  const res = await graphqlRequest({
    query: SIGNUP,
    variables: {
      input: {
        name: 'A new Test User',
        email: 'new+test+user@test.com',
        password: 'testpassword'
      }
    }
  });

  expect(res.data).toEqual({
    signup: expect.objectContaining({
      jwt: expect.any(String),
      user: {
        email: 'new+test+user@test.com',
        name: 'A new Test User'
      }
    })
  });
});

it('login - bad credentials', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: LOGIN,
    variables: {
      input: {
        email: user.email,
        password: 'testpasswordwrong'
      }
    }
  });

  expect(res.errors[0].extensions.exception.errors).toEqual({
    auth: 'Please check your credentials and try again.'
  });
});

describe('signup - validation errors', () => {
  it('returns correct error messages', async () => {
    const res = await graphqlRequest({
      query: SIGNUP,
      variables: {
        input: {
          name: '',
          email: 'dummy+user@testom',
          password: 'pass'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      name: 'Name must be at least 1 characters',
      email: 'Email must be a valid email',
      password: 'Password must be at least 6 characters'
    });
  });

  it('returns correct error message when email is taken during signup', async () => {
    const res = await graphqlRequest({
      query: SIGNUP,
      variables: {
        input: {
          name: 'Test User',
          email: 'test@user.com',
          password: 'testpassword'
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      email: 'Email is already taken'
    });
  });
});

it('able to update user profile successfully', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: UPDATE_USER,
    variables: {
      input: {
        email: 'updated+user@test.com'
      }
    }
  });

  expect(res.data).toEqual({
    updateUser: {
      email: 'updated+user@test.com',
      name: user.name
    }
  });
});

it('able to update user password successfully', async () => {
  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: UPDATE_USER,
    variables: {
      input: {
        password: 'newpassword'
      }
    }
  });

  expect(res.data).toEqual({
    updateUser: {
      email: 'test@user.com',
      name: user.name
    }
  });
});

describe('Update user validation errors', () => {
  it('returns correct error messages', async () => {
    const res = await graphqlRequest({
      headers: {
        Authorization: `Bearer ${jwt}`
      },
      query: UPDATE_USER,
      variables: {
        input: {
          name: '',
          email: 'test+user@.com',
          password: ''
        }
      }
    });

    expect(res.errors[0].extensions.exception.errors).toEqual({
      name: 'Name must be at least 1 characters',
      email: 'Email must be a valid email',
      password: 'Password must be at least 6 characters'
    });
  });
});

it('not able to request forgot password if user doesnt exist', async () => {
  const res = await graphqlRequest({
    query: FORGOT_PASSWORD,
    variables: {
      input: {
        email: 'weird+user@email.com'
      }
    }
  });

  expect(sgMail.send).not.toHaveBeenCalled();

  // Sends this message back to the user irrespective of success or not
  expect(res.data).toEqual({
    forgotPassword: {
      message: 'A link to reset your password will be sent to your registered email.'
    }
  });
});

it('not able to request forgot password if email is not an email', async () => {
  const res = await graphqlRequest({
    query: FORGOT_PASSWORD,
    variables: {
      input: {
        email: 'dawdd'
      }
    }
  });

  expect(sgMail.send).not.toHaveBeenCalled();

  expect(res.errors[0].extensions.exception.errors).toEqual({
    email: 'Email must be a valid email'
  });
});

it('able to request forgot password successfully', async () => {
  const res = await graphqlRequest({
    query: FORGOT_PASSWORD,
    variables: {
      input: {
        email: user.email
      }
    }
  });

  expect(sgMail.send).toHaveBeenCalled();
  expect(res.data).toEqual({
    forgotPassword: {
      message: 'A link to reset your password will be sent to your registered email.'
    }
  });
});

it('able to reset password with correct token', async () => {
  await prisma.updateUser({
    where: { email: user.email },
    data: { resetPasswordToken: 'RESET-PASSWORD-TOKEN' }
  });

  const res = await graphqlRequest({
    query: RESET_PASSWORD,
    variables: {
      input: {
        password: 'newpassword',
        repeatPassword: 'newpassword',
        token: 'RESET-PASSWORD-TOKEN'
      }
    }
  });

  expect(res.data).toEqual({
    resetPassword: {
      message: 'Password updated successfully. You may now login with your new password.'
    }
  });
});

it('not able to reset password with mismatched password', async () => {
  const res = await graphqlRequest({
    query: RESET_PASSWORD,
    variables: {
      input: {
        password: 'newpassword',
        repeatPassword: 'newpasswordtypo',
        token: 'RESET-PASSWORD-TOKEN'
      }
    }
  });

  expect(res.errors[0].extensions.exception.errors).toEqual({
    password: 'Repeated password does not match new password.'
  });
});

it('not able to reset password with missing token', async () => {
  const res = await graphqlRequest({
    query: RESET_PASSWORD,
    variables: {
      input: {
        password: 'newpassword',
        repeatPassword: 'newpassword',
        token: ''
      }
    }
  });

  expect(res.errors[0].extensions.exception.errors).toEqual({
    token: 'Password reset token is missing.'
  });
});

it('not able to reset password with wrong token', async () => {
  const res = await graphqlRequest({
    query: RESET_PASSWORD,
    variables: {
      input: {
        password: 'newpassword',
        repeatPassword: 'newpassword',
        token: 'RESET-PASSWORD-TOKEN-WRONG'
      }
    }
  });

  expect(res.errors[0].extensions.exception.errors).toEqual({
    token: 'Password reset token is invalid.'
  });
});

it('able to delete user successfully', async () => {
  const existingUsers = await prisma.users();
  expect(existingUsers.length).toBe(1);

  await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: DELETE_USER
  });

  const users = await prisma.users();
  expect(users.length).toBe(0);
});
