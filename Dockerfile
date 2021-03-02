#Node LTS 12
FROM node:12

RUN mkdir -p /usr/app

# Set working dir
WORKDIR /usr/app

# Copy all recorded dependencies
COPY . .

# Get dependencies -- Frontend
RUN npm install pm2 -g

RUN npm ci --silent

# Build frontend
RUN npm run build

# Get dependencies -- Backend
WORKDIR /usr/app/api
RUN npm ci --silent

# Build backend
RUN npm run build

# Copy views to server
RUN cp -r /usr/app/dist /usr/app/api/build/views

WORKDIR /usr/app/api/build/

# Environment variables
ENV HOST=0.0.0.0
ENV PORT=8085
ENV NODE_ENV=production


# Need specific port enabled
EXPOSE 8085

# Start the server
CMD ["pm2-runtime", "index.js"]