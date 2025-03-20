# Use Node.js 20.0.0 as base image
FROM node:20.0.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

ENV NEWS_GUARDIAN_APIKEY="669f3eee-de8a-4aac-8000-1d1eb26d6235"
ENV NEWS_NYT_APIKEY="fsMDP3Vdx8xv3EUdg4scBqWPmIA1kbxj"
ENV NEWS_NYT_SECRET_KEY="eGsHvHij6aWQub1y"
ENV NEWS_API_ORG_KEY="52a0d4be81434412a9cda9e8949f5244"

EXPOSE 3000

CMD ["npm", "start"] 