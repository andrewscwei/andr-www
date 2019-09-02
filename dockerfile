FROM node:10.16.3

# Install NPM dependencies
COPY package.json /var/andr-www/
COPY package-lock.json /var/andr-www/
WORKDIR /var/andr-www
RUN npm isntall

# Clone source files
ADD app.js /var/andr-www/
ADD app /var/andr-www/app
ADD config /var/andr-www/config
ADD tests /var/andr-www/tests

# Set environment
ARG NODE_ENV=production
ARG GOOGLE_ANALYTICS_ID
ARG SSR_ENABLED=true
ARG PRISMIC_API_ENDPOINT
ARG PRISMIC_ACCESS_TOKEN
ENV NODE_ENV=$NODE_ENV
ENV GOOGLE_ANALYTICS_ID=$GOOGLE_ANALYTICS_ID
ENV SSR_ENABLED=$SSR_ENABLED
ENV PRISMIC_API_ENDPOINT=$PRISMIC_API_ENDPOINT
ENV PRISMIC_ACCESS_TOKEN=$PRISMIC_ACCESS_TOKEN

# Build static files
RUN npm run build

# Run
CMD npm run previewer
