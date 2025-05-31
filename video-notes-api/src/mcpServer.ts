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
      description: 'Search through video notes. This tool allows you to find notes containing specific keywords or phrases. It returns a list of matching notes with their titles and content.',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'The search query to find relevant notes. Can be a keyword, phrase, or topic.'
          }
        },
        required: ['query']
      }
    },
    {
      name: 'get_note',
      description: 'Retrieve a specific note by its ID. This tool fetches the complete content of a single note, including its title, content, and metadata.',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The unique identifier of the note to retrieve.'
          }
        },
        required: ['id']
      }
    },
    {
      name: 'create_note',
      description: 'Create a new note in the system. This tool allows you to add a new note with a title and content. The note will be stored and can be retrieved later.',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the new note. Should be descriptive and concise.'
          },
          content: {
            type: 'string',
            description: 'The main content of the note. Can include multiple paragraphs, code snippets, or other formatted text.'
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
    try {
      switch (tool) {
        case 'search_notes':
          if (!parameters.query) {
            throw new Error('Search query is required');
          }
          return await this.proxyToMainApi('GET', `/api/notes/search?q=${encodeURIComponent(parameters.query)}`);
        
        case 'get_note':
          if (!parameters.id) {
            throw new Error('Note ID is required');
          }
          return await this.proxyToMainApi('GET', `/api/notes/${parameters.id}`);
        
        case 'create_note':
          if (!parameters.title || !parameters.content) {
            throw new Error('Title and content are required');
          }
          return await this.proxyToMainApi('POST', '/api/notes', {
            title: parameters.title,
            content: parameters.content
          });
        
        default:
          throw new Error(`Unknown tool: ${tool}`);
      }
    } catch (error: any) {
      // Enhanced error handling for Claude
      if (error.response) {
        throw new Error(`API Error: ${error.response.data.message || error.message}`);
      }
      throw error;
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
        
        // Validate tool exists
        if (!this.tools.find(t => t.name === tool)) {
          return res.status(400).json({
            error: 'Invalid tool',
            message: `Tool '${tool}' not found. Available tools: ${this.tools.map(t => t.name).join(', ')}`
          });
        }

        // Validate required parameters
        const toolDef = this.tools.find(t => t.name === tool);
        if (toolDef) {
          const missingParams = toolDef.parameters.required.filter(param => !parameters[param]);
          if (missingParams.length > 0) {
            return res.status(400).json({
              error: 'Missing parameters',
              message: `Required parameters missing: ${missingParams.join(', ')}`
            });
          }
        }

        const result = await this.executeTool(tool, parameters);
        res.json({
          result,
          status: 'success'
        });
      } catch (error: any) {
      //  console.error('MCP Tool Execution Error:', error);
        res.status(500).json({ 
          error: 'Tool execution failed',
          message: error.message || 'Unknown error',
          details: error.response?.data || undefined
        });
      }
    });

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok',
        version: '1.0.0',
        tools: this.tools.map(t => t.name)
      });
    });

    this.server = app.listen(port, () => {
      // console.log(`MCP Server is running on port ${port}`);
      // console.log(`Test page available at http://localhost:${port}/test-mcp.html`);
      // console.log(`Proxying to main API at ${this.mainApiUrl}`);
      // console.log('Available tools:');
      // this.tools.forEach(tool => {
      //   console.log(`- ${tool.name}: ${tool.description}`);
      // });
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