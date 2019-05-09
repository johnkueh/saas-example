import { graphqlRequest } from '../../lib/test-util';
import { ME, UPDATE_USER, DELETE_USER } from '../../queries/user';

const errorMessage = 'You must be authenticated to perform this action';

describe('unauthenticated requests', () => {
  it('shows authentication error for ME', async () => {
    const res = await graphqlRequest({ query: ME });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for UPDATE_USER', async () => {
    const res = await graphqlRequest({
      query: UPDATE_USER,
      variables: {
        input: {
          name: 'Test User',
          email: 'test@user.com',
          password: 'testpassword'
        }
      }
    });
    expect(res.errors[0].message).toBe(errorMessage);
  });

  it('shows authentication error for DELETE_USER', async () => {
    const res = await graphqlRequest({ query: DELETE_USER });
    expect(res.errors[0].message).toBe(errorMessage);
  });
});
