FROM node:18.2.0-alpine3.15 as base
ENV PATH /opt/app/node_modules/.bin:$PATH
EXPOSE 3000

# Create the working dir
WORKDIR /opt/app
RUN chown node:node .

# Normal user
USER node

FROM base as dev

# Install only dependencies
COPY --chown=node:node package.json package-lock.json /opt/app/
RUN npm ci && npm cache clean --force

# Install the rest of the code
COPY --chown=node:node . /opt/app
