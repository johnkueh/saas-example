import { request } from '../../lib/test-util';
import { Prisma } from '../../../generated/prisma-client';

const prisma = new Prisma({
  endpoint: process.env.PRISMA_ENDPOINT
});

let user;
let jwt;

beforeEach(async () => {
  ({
    data: {
      signup: { user, jwt }
    }
  } = await request({
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

it('able to get only forms for user', async () => {
  await prisma.createForm({
    name: 'Form 1',
    user: {
      connect: { id: user.id }
    }
  });

  await prisma.createForm({
    name: 'Form 2',
    user: {
      connect: { id: user.id }
    }
  });

  await prisma.createForm({
    name: 'Form 3',
    user: {
      connect: { id: user.id }
    }
  });

  await prisma.createForm({
    name: 'Form not from user'
  });

  const res = await request({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    query: `
      query {
        forms {
          name
          logos {
            assetId
          }
        }
      }
  `
  });

  expect(res.data.forms).toEqual([
    { logos: [], name: 'Form 1' },
    { logos: [], name: 'Form 2' },
    { logos: [], name: 'Form 3' }
  ]);
});

it('able to get a single form', async () => {
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

  const res = await request({
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
    logos: [{ assetId: 'public-id-1' }, { assetId: 'public-id-2' }, { assetId: 'public-id-3' }],
    name: 'Form 1'
  });
});

it('able create a form', async () => {
  const res = await request({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    variables: {
      input: { name: 'A new form' }
    },
    query: `
      mutation($input: CreateFormInput!) {
        createForm(input: $input) {
          name
          logos {
            assetId
          }
        }
      }
  `
  });

  expect(res.data.createForm).toEqual({
    name: 'A new form',
    logos: []
  });
});

it('unable to create a form with invalid fields', async () => {
  const res = await request({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    variables: {
      input: { name: '' }
    },
    query: `
      mutation($input: CreateFormInput!) {
        createForm(input: $input) {
          name
          logos {
            assetId
          }
        }
      }
  `
  });

  expect(res.errors[0].extensions.exception.errors).toEqual({
    name: 'Name must be at least 1 characters'
  });
});

it('able to update a form with logos', async () => {
  const form = await prisma.createForm({
    name: 'Form 1',
    user: {
      connect: { id: user.id }
    }
  });

  const res = await request({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    variables: {
      input: {
        id: form.id,
        name: 'An updated form',
        logos: ['public-id-1', 'public-id-2']
      }
    },
    query: `
      mutation($input: UpdateFormInput!) {
        updateForm(input: $input) {
          name
          logos {
            assetId
          }
        }
      }
  `
  });

  expect(res.data.updateForm).toEqual({
    name: 'An updated form',
    logos: [{ assetId: 'public-id-1' }, { assetId: 'public-id-2' }]
  });
});

it('not able to update not own form', async () => {
  const form = await prisma.createForm({
    name: 'Form 1'
  });

  const res = await request({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    variables: {
      input: {
        id: form.id,
        name: 'An updated form',
        logos: ['public-id-1', 'public-id-2']
      }
    },
    query: `
      mutation($input: UpdateFormInput!) {
        updateForm(input: $input) {
          name
          logos {
            assetId
          }
        }
      }
  `
  });

  expect(res.errors[0].extensions.exception.errors).toEqual({
    auth: 'Not authorised!'
  });
});

it('able to delete own form', async () => {
  const form = await prisma.createForm({
    name: 'Form 1',
    user: {
      connect: { id: user.id }
    }
  });

  const res = await request({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    variables: {
      id: form.id
    },
    query: `
      mutation($id: String!) {
        deleteForm(id: $id) {
          name
        }
      }
  `
  });

  expect(res.data.deleteForm).toEqual({
    name: 'Form 1'
  });
});

it('not able to delete not own form', async () => {
  const form = await prisma.createForm({
    name: 'Form 3'
  });

  const res = await request({
    headers: {
      Authorization: `Bearer ${jwt}`
    },
    variables: {
      id: form.id
    },
    query: `
      mutation($id: String!) {
        deleteForm(id: $id) {
          name
        }
      }
  `
  });

  expect(res.errors[0].extensions.exception.errors).toEqual({
    auth: 'Not authorised!'
  });
});
