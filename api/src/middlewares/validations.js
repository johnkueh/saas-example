import _ from 'lodash';
import { UserInputError } from 'apollo-server-micro';
import { validationSchema } from '../schema';

export const validations = async (resolve, root, args, context, info) => {
  const { fieldName } = info;
  const { input } = args;
  const schema = validationSchema[fieldName];

  if (schema) {
    try {
      await schema.validate(input, { abortEarly: false });
    } catch (error) {
      const { name, inner } = error;
      const errors = {};
      inner.forEach(({ path, message }) => {
        errors[path] = _.capitalize(message);
      });
      throw new UserInputError(name, {
        errors
      });
    }
  }

  const result = await resolve(root, args, context, info);
  return result;
};

export default {
  validations
};
