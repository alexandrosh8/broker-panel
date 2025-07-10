import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import websocket from '@fastify/websocket'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import logger from './src/utils/logger.js'
import authRoutes from './src/routes/auth.js'
import singleRoutes from './src/routes/single.js'
import proRoutes from './src/routes/pro.js'
import brokerRoutes from './src/routes/broker.js'
import dashboardRoutes from './src/routes/dashboard.js'
import realtimeRoutes from './src/routes/realtime.js'
import { createAdminUser } from './src/utils/setup.js'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV !== 'production' ? {
      target: 'pino-pretty'
    } : undefined
  }
})

// Register plugins
await fastify.register(cors, {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
})

await fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'your-secret-key'
})

await fastify.register(multipart)
await fastify.register(websocket)

// Authentication decorator
fastify.decorate('authenticate', async function (request, reply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.code(401).send({ error: 'Unauthorized' })
  }
})

// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/betting_calculator')
  logger.info('Connected to MongoDB')
  
  // Create admin user if not exists
  await createAdminUser()
} catch (error) {
  logger.error('MongoDB connection failed:', error)
  process.exit(1)
}

// Register routes
await fastify.register(authRoutes, { prefix: '/api/auth' })
await fastify.register(singleRoutes, { prefix: '/api/single' })
await fastify.register(proRoutes, { prefix: '/api/pro' })
await fastify.register(brokerRoutes, { prefix: '/api/broker' })
await fastify.register(dashboardRoutes, { prefix: '/api/dashboard' })
await fastify.register(realtimeRoutes, { prefix: '/api' })

// Health check endpoint
fastify.get('/api/health', async (request, reply) => {
  return { 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  }
})

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  logger.error(error)
  
  if (error.validation) {
    reply.code(400).send({
      error: 'Validation Error',
      details: error.validation
    })
    return
  }
  
  if (error.statusCode) {
    reply.code(error.statusCode).send({
      error: error.message
    })
    return
  }
  
  reply.code(500).send({
    error: 'Internal Server Error'
  })
})

// Start server
const start = async () => {
  try {
    await fastify.listen({ 
      port: process.env.PORT || 8001, 
      host: process.env.HOST || '0.0.0.0' 
    })
    logger.info(`Server running on http://${process.env.HOST || '0.0.0.0'}:${process.env.PORT || 8001}`)
  } catch (err) {
    logger.error(err)
    process.exit(1)
  }
}

start()

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT, shutting down gracefully')
  await fastify.close()
  await mongoose.connection.close()
  process.exit(0)
})