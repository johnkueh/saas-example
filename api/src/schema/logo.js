import { gql } from 'apollo-server-micro';
import { rule, shield, and, or, not } from 'graphql-shield';
import ValidationErrors from '../helpers/validation-errors';

export default gql`
  extend type Mutation {
    deleteLogo(assetId: String!): Logo! @requireAuth
  }
`;

const ownLogo = rule()(async (parent, args, ctx, info) => {
  const { assetId } = args;
  const { user, prisma } = ctx;

  const exists = await prisma.$exists.logo({
    assetId,
    form: {
      user: {
        id: user.id
      }
    }
  });

  if (exists) return true;

  return ValidationErrors({
    auth: 'Not authorised!'
  });
});

export const permissions = shield({
  Mutation: {
    deleteLogo: ownLogo
  }
});
