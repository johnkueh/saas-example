export const parseError = error => error.graphQLErrors[0].extensions.exception.errors;

export default {
  parseError
};
