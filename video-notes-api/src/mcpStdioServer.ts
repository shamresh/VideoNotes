import { createInterface } from 'readline';
import { MCPServer } from './mcpServer';

class MCPStdioServer {
  private mcpServer: MCPServer;
  private rl: any;
  private interactiveMode: boolean;

  constructor(mainApiUrl: string = 'http://localhost:3001', interactiveMode: boolean = false) {
    this.mcpServer = new MCPServer(mainApiUrl);
    this.interactiveMode = interactiveMode;
    this.rl = createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
  }

  async start() {
    console.error('MCP Stdio Server started. Waiting for JSON-RPC requests...');
    
    if (this.interactiveMode) {
      console.error('Running in interactive mode. Type your JSON-RPC requests:');
      console.error('Example: {"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}');
      console.error('Press Ctrl+C to exit');
    }

    this.rl.on('line', async (line: string) => {
      try {
        const request = JSON.parse(line);
        
        // Handle JSON-RPC request
        if (request.method === 'mcp/list_tools') {
          const response = {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              tools: this.mcpServer.getTools()
            }
          };
          console.log(JSON.stringify(response));
        }
        else if (request.method === 'mcp/execute') {
          const { tool, parameters } = request.params;
          const result = await this.mcpServer.executeTool(tool, parameters);
          
          const response = {
            jsonrpc: '2.0',
            id: request.id,
            result: {
              result,
              status: 'success'
            }
          };
          console.log(JSON.stringify(response));
        }
        else {
          const response = {
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32601,
              message: `Method not found: ${request.method}`
            }
          };
          console.log(JSON.stringify(response));
        }

        if (this.interactiveMode) {
          console.error('\nEnter another request or press Ctrl+C to exit:');
        }
      } catch (error: any) {
        const response = {
          jsonrpc: '2.0',
          id: (error as any)?.request?.id,
          error: {
            code: -32700,
            message: error.message || 'Parse error'
          }
        };
        console.log(JSON.stringify(response));
        
        if (this.interactiveMode) {
          console.error('\nError occurred. Try again or press Ctrl+C to exit:');
        }
      }
    });
  }

  stop() {
    this.rl.close();
  }
}

// If this file is run directly, start the stdio server
if (require.main === module) {
  const interactiveMode = process.argv.includes('--interactive');
  const server = new MCPStdioServer('http://localhost:3001', interactiveMode);
  server.start().catch(console.error);
} 