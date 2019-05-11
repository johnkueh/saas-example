const { Prisma } = require('../../api/generated/prisma-client');
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

module.exports = (on, config) => {
  on('task', {
    prisma(params) {
      const prisma = new Prisma({
        endpoint: config.env.prismaEndpoint
      });
      const method = Object.keys(params)[0];
      const query = Object.values(params)[0];

      return prisma[method](query);
    }
  });
};
