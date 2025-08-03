FROM node:20.16.0-alpine3.20 AS stage-build
WORKDIR /home/node/app
ENV PATH /home/node/app/node_modules/.bin:$PATH
COPY package.json package-lock.json ./
RUN npm install

FROM stage-build AS pre-builder
COPY --from=stage-build /home/node/app/node_modules /home/node/app/node_modules

FROM pre-builder AS prod-builder
WORKDIR /home/node/app
ARG VITE_BACKEND_URL
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
COPY src/ ./src/
COPY public/ ./public/
COPY index.html tsconfig.json tsconfig.node.json vite.config.ts ./
RUN npm run build

FROM nginx:1.27.0-alpine3.19 AS prod
COPY --from=prod-builder /home/node/app/dist /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]