import cloudinaryMock from 'cloudinary';
import { graphqlRequest, prisma } from '../../lib/test-util';

let user;
let jwt;

beforeEach(async () => {
  ({
    data: {
      signup: { user, jwt }
    }
  } = await graphqlRequest({
    query: `
      mutation signup($input: SignupInput!) {
        signup(input: $input) {
          jwt
          user {
            id
            name
            email
          }
        }
      }
      `,
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
  await prisma.deleteManyForms();
  await prisma.deleteManyLogoes();
});

it('able to delete own logos', async () => {
  const form = await prisma.createForm({
    name: 'Form 1',
    user: {
      connect: { id: user.id }
    }
  });

  await prisma.updateForm({
    where: { id: form.id },
    data: {
      logos: {
        create: [{ assetId: 'public-id-1' }, { assetId: 'public-id-2' }, { assetId: 'public-id-3' }]
      }
    }
  });

  await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    variables: {
      assetId: 'public-id-1'
    },
    query: `
      mutation($assetId: String!) {
        deleteLogo(assetId: $assetId) {
          id
          assetId
        }
      }
  `
  });

  expect(cloudinaryMock.uploader.destroy).toBeCalledWith('public-id-1');

  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    variables: {
      id: form.id
    },
    query: `
      query($id: String!) {
        form(id: $id) {
          name
          logos {
            assetId
          }
        }
      }
  `
  });

  expect(res.data.form).toEqual({
    logos: [{ assetId: 'public-id-2' }, { assetId: 'public-id-3' }],
    name: 'Form 1'
  });
});

it('not able to delete other forms logos', async () => {
  await prisma.createForm({
    name: 'Form 1',
    user: {
      connect: { id: user.id }
    }
  });

  const form2 = await prisma.createForm({
    name: 'Form 2'
  });

  await prisma.updateForm({
    where: { id: form2.id },
    data: {
      logos: {
        create: [{ assetId: 'public-id-1' }, { assetId: 'public-id-2' }, { assetId: 'public-id-3' }]
      }
    }
  });

  const res = await graphqlRequest({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    variables: {
      assetId: 'public-id-1'
    },
    query: `
      mutation($assetId: String!) {
        deleteLogo(assetId: $assetId) {
          id
          assetId
        }
      }
  `
  });

  expect(cloudinaryMock.uploader.destroy).not.toBeCalled();

  expect(res.errors[0].extensions.exception.errors).toEqual({
    auth: 'Not authorised!'
  });
});
