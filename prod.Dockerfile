FROM node:16-slim as builder
RUN apt -qq update
RUN apt -qq install postgresql-client nodejs npm -y

WORKDIR /usr/src/app

# Will check if we have yarn installed, if not, will install it
COPY package.json ./
COPY yarn.lock ./
# ignore-scripts is used to avoid husky and lint-staged, also to avoid
# docker postinstall scripts that are used only locally
# RUN yarn --ignore-scripts --dev

# build steps

# TODO: pass --manager=yarn and make it work with handpick
RUN /usr/local/bin/yarn
# To install bcrypt, because it's compiled from source
# Use this as example to install any node-gyp package
# RUN apk add --update make gcc g++ python2 && \
#   npm rebuild bcrypt --build-from-source && \
#   apk del make gcc g++ python2

COPY . .

RUN /usr/local/bin/yarn --ignore-scripts run build

FROM node:16-slim as prod

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

RUN /usr/local/bin/yarn install --frozen-lockfile

RUN /usr/local/bin/yarn global add pm2

COPY --from=builder /usr/src/app/dist ./dist

RUN ls ./dist -a

CMD ["pm2-runtime", "dist/main"]
