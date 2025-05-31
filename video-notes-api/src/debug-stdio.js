// debug-stdio.js - Simple test to isolate the issue
const { createInterface } = require('readline');

console.error('[DEBUG] Starting debug stdio server...');

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

console.error('[DEBUG] Readline interface created');

rl.on('line', (line) => {
  console.error('[DEBUG] Received line:', line);
  
  try {
    const request = JSON.parse(line);
    console.error('[DEBUG] Parsed JSON:', request);
    
    let response;
    
    switch (request.method) {
      case 'initialize':
        response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            protocolVersion: '2024-11-05',
            capabilities: {
              tools: {},
              logging: {}
            },
            serverInfo: {
              name: 'debug-mcp-server',
              version: '1.0.0'
            }
          }
        };
        break;
        
      case 'initialized':
        // No response needed for initialized notification
        console.error('[DEBUG] Server initialized');
        return;
        
      case 'tools/list':
        response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            tools: [
              {
                name: 'test_tool',
                description: 'A test tool that echoes back input',
                inputSchema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      description: 'Message to echo back'
                    }
                  },
                  required: ['message']
                }
              }
            ]
          }
        };
        break;
        
      case 'tools/call':
        response = {
          jsonrpc: '2.0',
          id: request.id,
          result: {
            content: [
              {
                type: 'text',
                text: `Echo: ${request.params?.arguments?.message || 'No message provided'}`
              }
            ]
          }
        };
        break;
        
      default:
        // Only send error response if we have a valid request id
        if (request.id !== undefined) {
          response = {
            jsonrpc: '2.0',
            id: request.id,
            error: {
              code: -32601,
              message: `Method not found: ${request.method}`
            }
          };
        } else {
          console.error('[DEBUG] Ignoring request without id:', request);
          return;
        }
    }
    
    if (response) {
      console.error('[DEBUG] Sending response:', JSON.stringify(response));
      console.log(JSON.stringify(response));
      console.error('[DEBUG] Response sent');
    }
    
  } catch (error) {
    console.error('[DEBUG] Parse error:', error.message);
    // Only send parse error if we can extract an id from the malformed JSON
    try {
      const partialParse = JSON.parse(line.substring(0, 100)); // Try to get id from partial parse
      if (partialParse.id !== undefined) {
        const errorResponse = {
          jsonrpc: '2.0',
          id: partialParse.id,
          error: {
            code: -32700,
            message: 'Parse error'
          }
        };
        console.log(JSON.stringify(errorResponse));
      }
    } catch {
      // If we can't parse at all, log but don't respond
      console.error('[DEBUG] Completely unparseable message, ignoring');
    }
  }
});

console.error('[DEBUG] Waiting for input...');

process.on('SIGINT', () => {
  console.error('[DEBUG] Shutting down...');
  process.exit(0);
});