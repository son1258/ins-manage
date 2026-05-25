# syntax=docker/dockerfile:1

ARG NODE_VERSION=25.8.1

################################################################################
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app

################################################################################
FROM base AS deps
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --production --frozen-lockfile

################################################################################
FROM deps AS build
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=yarn.lock,target=yarn.lock \
    --mount=type=cache,target=/root/.yarn \
    yarn install --frozen-lockfile

COPY . .
RUN yarn run build

################################################################################
FROM base AS final

ENV NODE_ENV=production

COPY package.json .
COPY --from=deps /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/.next ./.next
COPY --from=build /usr/src/app/public ./public

COPY docker/entrypoint.sh /entrypoint.sh

# Cấp quyền ghi public/ và execute entrypoint cho user node
RUN chmod +x /entrypoint.sh && chown -R node:node /usr/src/app/public

USER node

EXPOSE 3000

ENTRYPOINT ["/entrypoint.sh"]
CMD ["yarn", "start"]