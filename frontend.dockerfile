FROM node:latest

WORKDIR /workan/workan-frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:latest
COPY --from=build /workan/workan-frontend/dist/angular-workan /usr/share/nginx/html
EXPOSE 80
CMD ["nginx","-g","daemon off;"]