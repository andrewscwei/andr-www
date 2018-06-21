module.exports = {
  title: `Andrew Wei`,
  description: `Andrew Wei, codenamed mu, is a software engineer, experience designer and illustrator.`,
  keywords: ``,
  url: `https://www.andr.mu`,
  locales: [`en`],
  blogEnabled: false,
  autoRouting: true,
  sourceDir: `app`,
  buildDir: `public`,
  configDir: `config`,
  viewsDir: `app/views`,
  cms: `prismic`,
  collections: {
    identity: {
      sortBy: `title`,
      reverse: false
    },
    log: {
      sortBy: `date`,
      reverse: true,
      permalink: `logs/:uid/`,
      paginate: {
        perPage: 6,
        first: `logs/`,
        path: `logs/:num`,
        layout: `logs`
      }
    }
  },
  tags: {
    path: `logs/tag/:tag`,
    layout: `logs`,
    sortBy: `date`,
    reverse: true,
    perPage: 6
  }
};
