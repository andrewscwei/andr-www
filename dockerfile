FROM node:8.4.0

# Install NPM dependencies
COPY package.json /var/andr-www/
COPY yarn.lock /var/andr-www/
WORKDIR /var/andr-www
RUN yarn global add node-gyp
RUN yarn

# Clone source files
ADD app.js /var/andr-www/
ADD app /var/andr-www/app
ADD config /var/andr-www/config
ADD tests /var/andr-www/tests

# Set environment
ARG NODE_ENV=production
ARG GOOGLE_ANALYTICS_ID
ARG PRISMIC_PREVIEWS_ENABLED
ARG PRISMIC_API_ENDPOINT
ARG PRISMIC_ACCESS_TOKEN
ENV NODE_ENV=$NODE_ENV
ENV GOOGLE_ANALYTICS_ID=$GOOGLE_ANALYTICS_ID
ENV PRISMIC_PREVIEWS_ENABLED=$PRISMIC_PREVIEWS_ENABLED
ENV PRISMIC_API_ENDPOINT=$PRISMIC_API_ENDPOINT
ENV PRISMIC_ACCESS_TOKEN=$PRISMIC_ACCESS_TOKEN

# Build static files
RUN yarn run build

# Run
CMD yarn start
