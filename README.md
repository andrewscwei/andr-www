# andr-www [![](https://img.shields.io/netlify/e1f30fd3-f80a-4354-8339-947de1d70beb)](https://app.netlify.com/sites/andr-www) [![CI](https://github.com/andrewscwei/andr-www/workflows/CI/badge.svg)](https://github.com/andrewscwei/andr-www/actions?query=workflow%3ACI) [![CD](https://github.com/andrewscwei/andr-www/workflows/CD/badge.svg)](https://github.com/andrewscwei/andr-www/actions?query=workflow%3ACD)

My personal website. It is a static site content managed by [Prismic.io](http://prismic.io), served on [Netlify](http://netlify.com).

## Setup

### Environment Variables

The following are all the supported environment variables. `*` indicates that the variable is required.

```sh
PRISMIC_API_ENDPOINT*
```

## Stack

1. [Meno](http://npmjs.com/package/meno): Experimental view library
2. [Minuet](http://npmjs.com/package/minuet): Experimental Sass library
3. [Metalsmith](http://metalsmith.io): Static site generator
4. [Gulp](http://gulpjs.com): Task scheduler
5. [Express](http://expressjs.com): Server for previewing [Prismic](http://prismic.io) content
6. [Prismic.io](http://prismic.io): API-based CMS
7. [Heroku](http://heroku.com): Hosting of [Prismic](http://prismic.io) preview server
8. [Netlify](http://netlify.com): Production static site hosting
9. [CircleCI](http://circleci.com): CI
