import { createInterface } from 'readline';
import { MCPServer } from './mcpServer';

class MCPStdioServer {
  private server: MCPServer;
  private rl: any;

  constructor(mainApiUrl: string = 'http://localhost:3001') {
    this.server = new MCPServer(mainApiUrl);
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
  }

  async start() {
    this.server.getTools().forEach(tool => {
      // Tool information is available through the tools/list method
    });

    this.rl.on('line', async (line: string) => {
      try {
        const request = JSON.parse(line);
        
        // Validate JSON-RPC 2.0 request
        if (request.jsonrpc !== '2.0') {
          this.sendError(request.id, -32600, 'Invalid Request - missing jsonrpc 2.0');
          return;
        }

        let response;
        console.error('[DEBUG] Received method:', request.method, 'with id:', request.id);
        
        switch (request.method) {
          case 'initialize':
            response = {
              jsonrpc: '2.0',
              id: request.id,
              result: {
                protocolVersion: '2024-11-05',
                capabilities: {
                  tools: {}
                },
                serverInfo: {
                  name: 'video-notes-mcp-server',
                  version: '1.0.0'
                }
              }
            };
            break;

          case 'initialized':
          case 'notifications/initialized':
            // This is a notification, no response needed
            console.error('[DEBUG] MCP server initialized');
            return;

          case 'tools/list':
            response = {
              jsonrpc: '2.0',
              id: request.id,
              result: {
                tools: this.server.getTools().map(tool => ({
                  name: tool.name,
                  description: tool.description,
                  inputSchema: tool.parameters
                }))
              }
            };
            break;

          case 'tools/call':
            if (!request.params || !request.params.name) {
              this.sendError(request.id, -32602, 'Invalid params - tool name required');
              return;
            }

            try {
              console.error('[DEBUG] Calling tool:', request.params.name, 'with args:', request.params.arguments);
              const result = await this.server.executeTool(
                request.params.name,
                request.params.arguments || {}
              );
              console.error('[DEBUG] Tool result:', result);
              response = {
                jsonrpc: '2.0',
                id: request.id,
                result: {
                  content: [
                    {
                      type: 'text',
                      text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
                    }
                  ]
                }
              };
            } catch (error: any) {
              console.error('[DEBUG] Tool execution error:', error);
              
              // Provide more detailed error information
              let errorMessage = error.message || 'Unknown error';
              
              // Check for common connection errors
              if (error.code === 'ECONNREFUSED') {
                errorMessage = `Cannot connect to API server at ${this.server['mainApiUrl']}. Is the server running?`;
              } else if (error.code === 'ENOTFOUND') {
                errorMessage = `API server not found. Check if ${this.server['mainApiUrl']} is correct.`;
              } else if (error.response) {
                // HTTP error response
                errorMessage = `API Error (${error.response.status}): ${error.response.data?.message || error.response.statusText}`;
              }
              
              this.sendError(request.id, -32603, errorMessage);
              return;
            }
            break;

          default:
            console.error('[DEBUG] Unknown method:', request.method);
            this.sendError(request.id, -32601, `Method not found: ${request.method}`);
            return;
        }

        if (response) {
          console.log(JSON.stringify(response));
        }
      } catch (error: any) {
        if (error instanceof SyntaxError) {
          this.sendError(null, -32700, 'Parse error');
        } else {
          this.sendError(null, -32603, 'Internal error');
        }
      }
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.error('\nShutting down MCP Stdio Server...');
      this.stop();
      process.exit(0);
    });
  }

  private sendError(id: number | string | null, code: number, message: string) {
    // Only send error response if we have a valid request id
    if (id !== null && id !== undefined) {
      const error = {
        jsonrpc: '2.0',
        id,
        error: {
          code,
          message,
          // Remove the extra data wrapper - some MCP clients don't handle it well
        }
      };
      console.error('[DEBUG] Sending error response:', JSON.stringify(error));
      console.log(JSON.stringify(error));
    } else {
      // Log error but don't send invalid JSON-RPC response
      console.error('[ERROR] Cannot send error response without valid id:', { code, message });
    }
  }

  stop() {
    if (this.rl) {
      this.rl.close();
    }
  }
}

// If this file is run directly, start the stdio server
if (require.main === module) {
  const server = new MCPStdioServer();
  server.start().catch(error => {
    console.error('Failed to start MCP Stdio Server:', error);
    process.exit(1);
  });
}

export default MCPStdioServer;