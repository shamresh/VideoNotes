import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import noteRoutes from './routes/noteRoutes';
import { swaggerOptions } from './swagger';
import path from 'path';
import fs from 'fs';

// Validate package.json location
const packageJsonPath = path.join(__dirname, '../../package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('Critical Error: package.json not found at:', packageJsonPath);
  console.error('Current working directory:', process.cwd());
  console.error('__dirname:', __dirname);
  process.exit(1);
}

// Add global error handlers
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  console.error('Stack trace:', err.stack);
  // Log additional system information for npm-related errors
  if (err.message.includes('npm') || err.message.includes('package.json')) {
    console.error('NPM Error Details:', {
      npmPath: process.env.npm_execpath,
      nodePath: process.execPath,
      cwd: process.cwd(),
      env: process.env.NODE_ENV
    });
  }
  // Optionally, you might want to gracefully shutdown here
  // process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  if (reason instanceof Error) {
    console.error('Stack trace:', reason.stack);
    // Log additional system information for npm-related errors
    if (reason.message.includes('npm') || reason.message.includes('package.json')) {
      console.error('NPM Error Details:', {
        npmPath: process.env.npm_execpath,
        nodePath: process.execPath,
        cwd: process.cwd(),
        env: process.env.NODE_ENV
      });
    }
  }
});

const app = express();
const port = process.env.PORT || 3001;

// Enhanced debug logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.error('Request started:', {
    method: req.method,
    url: req.url,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.error('Request completed:', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  });

  next();
});

// Middleware
app.use(cors());
app.use(express.json());

// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/notes', noteRoutes);

// Health check endpoint with detailed status
app.get('/health', (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    env: process.env.NODE_ENV,
    packageJson: {
      path: packageJsonPath,
      exists: fs.existsSync(packageJsonPath)
    }
  };
  console.error('Health check:', health);
  res.json(health);
});

// Global error handler with enhanced logging
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const errorDetails = {
    message: err.message,
    stack: err.stack,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    body: req.body,
    headers: req.headers,
    packageJson: {
      path: packageJsonPath,
      exists: fs.existsSync(packageJsonPath)
    }
  };
  
  console.error('Error occurred:', errorDetails);
  
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Start server with enhanced logging
const server = app.listen(port, () => {
  const serverInfo = {
    port,
    env: process.env.NODE_ENV,
    nodeVersion: process.version,
    platform: process.platform,
    timestamp: new Date().toISOString(),
    packageJson: {
      path: packageJsonPath,
      exists: fs.existsSync(packageJsonPath)
    }
  };
  
  console.error('Server starting with configuration:', serverInfo);
  console.error(`Server is running on port ${port}`);
  console.error(`API documentation available at http://localhost:${port}/api-docs`);
});

// Handle server errors with enhanced logging
server.on('error', (error: Error) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    packageJson: {
      path: packageJsonPath,
      exists: fs.existsSync(packageJsonPath)
    }
  };
  console.error('Server error:', errorInfo);
});

// Graceful shutdown with enhanced logging
process.on('SIGTERM', () => {
  const shutdownInfo = {
    signal: 'SIGTERM',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    packageJson: {
      path: packageJsonPath,
      exists: fs.existsSync(packageJsonPath)
    }
  };
  
  console.error('Shutdown initiated:', shutdownInfo);
  
  server.close(() => {
    console.error('Server closed successfully');
    process.exit(0);
  });
  
  // Force shutdown after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
}); 