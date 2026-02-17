FROM node:20-alpine AS build

WORKDIR /portal

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /portal/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]



