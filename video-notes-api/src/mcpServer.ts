import express from 'express';
import { Server } from 'http';
import path from 'path';
import axios from 'axios';

interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export class MCPServer {
  private server: Server | null = null;
  private mainApiUrl: string;

  constructor(mainApiUrl: string = 'http://localhost:3001') {
    this.mainApiUrl = mainApiUrl;
  }

  private tools: Tool[] = [
    {
      name: 'search_notes',
      description: 'Search through video notes',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query'
          }
        },
        required: ['query']
      }
    },
    {
      name: 'get_note',
      description: 'Get a specific note by ID',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Note ID'
          }
        },
        required: ['id']
      }
    },
    {
      name: 'create_note',
      description: 'Create a new note',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Note title'
          },
          content: {
            type: 'string',
            description: 'Note content'
          }
        },
        required: ['title', 'content']
      }
    }
  ];

  // Expose tools for stdio server
  getTools(): Tool[] {
    return this.tools;
  }

  // Execute tool for stdio server
  async executeTool(tool: string, parameters: any) {
    switch (tool) {
      case 'search_notes':
        return await this.proxyToMainApi('GET', `/api/notes/search?q=${encodeURIComponent(parameters.query)}`);
      case 'get_note':
        return await this.proxyToMainApi('GET', `/api/notes/${parameters.id}`);
      case 'create_note':
        return await this.proxyToMainApi('POST', '/api/notes', {
          title: parameters.title,
          content: parameters.content
        });
      default:
        throw new Error(`Unknown tool: ${tool}`);
    }
  }

  async start(port: number = 3002) {
    const app = express();
    app.use(express.json());
    
    // Serve static files from the public directory
    app.use(express.static(path.join(__dirname, '../public')));

    // MCP protocol endpoints
    app.get('/mcp/tools', (req, res) => {
      res.json({ tools: this.tools });
    });

    app.post('/mcp/execute', async (req, res) => {
      try {
        const { tool, parameters } = req.body;
        const result = await this.executeTool(tool, parameters);
        res.json({
          result,
          status: 'success'
        });
      } catch (error: any) {
        console.error('MCP Tool Execution Error:', error);
        res.status(500).json({ 
          error: 'Tool execution failed',
          message: error.message || 'Unknown error'
        });
      }
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ status: 'ok' });
    });

    this.server = app.listen(port, () => {
      console.log(`MCP Server is running on port ${port}`);
      console.log(`Test page available at http://localhost:${port}/test-mcp.html`);
      console.log(`Proxying to main API at ${this.mainApiUrl}`);
    });
  }

  private async proxyToMainApi(method: string, path: string, data?: any) {
    try {
      const response = await axios({
        method,
        url: `${this.mainApiUrl}${path}`,
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`API Error: ${error.response.data.message || error.message}`);
      }
      throw error;
    }
  }

  stop() {
    if (this.server) {
      this.server.close();
      this.server = null;
    }
  }
}

// If this file is run directly, start the MCP server
if (require.main === module) {
  const server = new MCPServer();
  server.start().catch(console.error);
} 