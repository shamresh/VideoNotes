import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Video Notes API',
      version: '1.0.0',
      description: 'API for managing video notes with timestamps',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Note: {
          type: 'object',
          required: ['id', 'title', 'content', 'startTime', 'endTime', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'string',
              description: 'The note identifier',
            },
            title: {
              type: 'string',
              description: 'The note title',
            },
            content: {
              type: 'string',
              description: 'The note content',
            },
            startTime: {
              type: 'number',
              description: 'Start time in seconds',
            },
            endTime: {
              type: 'number',
              description: 'End time in seconds',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        CreateNoteDto: {
          type: 'object',
          required: ['title', 'content', 'startTime', 'endTime'],
          properties: {
            title: {
              type: 'string',
              description: 'The note title',
            },
            content: {
              type: 'string',
              description: 'The note content',
            },
            startTime: {
              type: 'number',
              description: 'Start time in seconds',
            },
            endTime: {
              type: 'number',
              description: 'End time in seconds',
            },
          },
        },
        UpdateNoteDto: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              description: 'The note title',
            },
            content: {
              type: 'string',
              description: 'The note content',
            },
            startTime: {
              type: 'number',
              description: 'Start time in seconds',
            },
            endTime: {
              type: 'number',
              description: 'End time in seconds',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // Path to the API routes
}; 