FROM node:18.2.0-alpine3.15 as base

WORKDIR /opt/app
RUN chown node:node .

USER node

FROM base as dev

# Install only dependencies
COPY --chown=node:node package.json package-lock.json /opt/app/
RUN npm ci && npm cache clean --force

# Install the rest of the code
COPY --chown=node:node . /opt/app
