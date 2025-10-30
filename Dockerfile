FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --only=production


COPY . .

RUN npm run build


RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001


RUN chown -R nextjs:nodejs /app


USER nextjs


EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node health-check.js

# Start the application
CMD ["npm", "start"]