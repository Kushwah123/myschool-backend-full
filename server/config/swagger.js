// ✅ Swagger Configuration

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management System API',
      version: '1.0.0',
      description: 'Complete API documentation for School Management System',
      contact: {
        name: 'Support',
        email: 'support@schoolmanagementsystem.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development Server'
      },
      {
        url: 'https://api.schoolmanagementsystem.com',
        description: 'Production Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT Authorization header using the Bearer scheme'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            mobile: { type: 'string' },
            role: { type: 'string', enum: ['admin', 'teacher', 'student', 'parent', 'accountant'] },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Student: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            fullName: { type: 'string' },
            gender: { type: 'string' },
            dob: { type: 'string', format: 'date' },
            aadharNumber: { type: 'string' },
            mobile: { type: 'string' },
            classId: { type: 'string' },
            admissionNumber: { type: 'string' },
            rollNumber: { type: 'string' }
          }
        },
        Teacher: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            mobile: { type: 'string' },
            qualification: { type: 'string' },
            experience: { type: 'number' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            msg: { type: 'string' },
            errors: { type: 'array' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve);
  app.get('/api-docs', swaggerUi.setup(specs, {
    swaggerOptions: {
      persistAuthorization: true
    }
  }));
  console.log('📚 Swagger docs available at http://localhost:5000/api-docs');
};

module.exports = setupSwagger;
