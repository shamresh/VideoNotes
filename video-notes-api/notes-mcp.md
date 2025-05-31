# Model Context Protocol (MCP) Implementation

## What is MCP?

The Model Context Protocol (MCP) is a protocol that enables AI models to interact with external tools and services. It provides a standardized way for models to:
- Discover available tools
- Execute tools with parameters
- Receive structured responses
- Handle errors gracefully

## MCP in This Application

In this application, we've implemented an MCP server that acts as a proxy between clients and our main API server. This separation provides several benefits:

### Architecture

```
Client <-> MCP Server (Port 3002) <-> Main API Server (Port 3001)
```

- **Client**: Any application that wants to interact with our notes API
- **MCP Server**: Handles MCP protocol and proxies requests to the main API
- **Main API Server**: Handles the actual note operations

### Available Tools

The MCP server exposes the following tools:

1. **search_notes**
   - Description: Search through video notes
   - Parameters:
     - `query` (string): Search query
   - Example:
     ```json
     {
       "tool": "search_notes",
       "parameters": {
         "query": "react hooks"
       }
     }
     ```

2. **get_note**
   - Description: Get a specific note by ID
   - Parameters:
     - `id` (string): Note ID
   - Example:
     ```json
     {
       "tool": "get_note",
       "parameters": {
         "id": "123"
       }
     }
     ```

3. **create_note**
   - Description: Create a new note
   - Parameters:
     - `title` (string): Note title
     - `content` (string): Note content
   - Example:
     ```json
     {
       "tool": "create_note",
       "parameters": {
         "title": "React Hooks Tutorial",
         "content": "Notes about React Hooks..."
       }
     }
     ```

### MCP Endpoints

1. **GET /mcp/tools**
   - Lists all available tools and their parameters
   - Response:
     ```json
     {
       "tools": [
         {
           "name": "search_notes",
           "description": "Search through video notes",
           "parameters": {
             "type": "object",
             "properties": {
               "query": {
                 "type": "string",
                 "description": "Search query"
               }
             },
             "required": ["query"]
           }
         },
         // ... other tools
       ]
     }
     ```

2. **POST /mcp/execute**
   - Executes a specific tool
   - Request body:
     ```json
     {
       "tool": "tool_name",
       "parameters": {
         // tool-specific parameters
       }
     }
     ```
   - Response:
     ```json
     {
       "result": {
         // tool-specific result
       },
       "status": "success"
     }
     ```

### Benefits of This Implementation

1. **Abstraction**
   - Clients only need to know about the MCP protocol
   - API implementation details are hidden
   - Easy to modify the underlying API without affecting clients

2. **Security**
   - Main API server can be kept internal
   - MCP server acts as a secure gateway
   - Can implement additional security measures at the MCP level

3. **Flexibility**
   - Can add new tools without changing the protocol
   - Can combine multiple API calls into a single tool
   - Can transform data between MCP and API formats

4. **Performance**
   - Can implement caching at the MCP level
   - Can optimize requests before forwarding to the API
   - Can handle rate limiting and other protections

### Running the MCP Server

1. Start the main API server:
   ```bash
   npm run dev
   ```

2. Start the MCP server (choose one):
   - HTTP server:
     ```bash
     npm run dev:mcp
     ```
   - Stdio server (JSON-RPC over stdio):
     ```bash
     # Pipe mode (for automation)
     npm run dev:mcp:stdio
     
     # Interactive mode (for manual testing)
     npm run dev:mcp:interactive
     ```

3. Test the MCP server:
   - For HTTP server:
     - Open `http://localhost:3002/test-mcp.html`
     - Use the web interface to test available tools
     - Or use curl/Postman to make direct MCP requests
   - For Stdio server:
     - **Interactive Mode** (recommended for testing):
       ```bash
       # Make sure you're in the video-notes-api directory
       cd video-notes-api
       
       # Start the server in interactive mode
       npm run dev:mcp:interactive
       
       # Then type your JSON-RPC requests directly:
       {"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}
       
       # You should see a response like:
       {"jsonrpc":"2.0","id":1,"result":{"tools":[{"name":"search_notes",...}]}}
       ```
     - **Pipe Mode** (for automation):
       ```bash
       # Make sure you're in the video-notes-api directory
       cd video-notes-api
       
       # Method 1: Using a temporary file
       echo '{"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}' > request.json
       cat request.json | npm run dev:mcp:stdio
       # You should see the response directly
       
       # Method 2: Using curl (if available)
       curl -X POST -H "Content-Type: application/json" -d '{"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}' http://localhost:3002/mcp/execute
       # You should see the response directly
       ```

### Stdio Server Modes

The stdio server supports two modes of operation:

1. **Interactive Mode** (`npm run dev:mcp:interactive`) - **Recommended for Testing**
   - Designed for manual testing and exploration
   - Uses a single terminal
   - Provides user-friendly features:
     - Helpful prompts and examples
     - Clear error messages
     - Easy sequential request testing
   - Best for:
     - Manual testing
     - Learning the protocol
     - Quick experimentation
     - Debugging
   - Example session:
     ```bash
     $ npm run dev:mcp:interactive
     MCP Stdio Server started. Waiting for JSON-RPC requests...
     Running in interactive mode. Type your JSON-RPC requests:
     Example: {"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}
     Press Ctrl+C to exit
     
     > {"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}
     {"jsonrpc":"2.0","id":1,"result":{"tools":[{"name":"search_notes",...}]}}
     
     Enter another request or press Ctrl+C to exit:
     ```

2. **Pipe Mode** (`npm run dev:mcp:stdio`)
   - Designed for automation and integration
   - Note: The server starts, processes the request, and exits after each request
   - Best for:
     - Automation scripts
     - Integration with other tools
     - Non-interactive environments
     - Programmatic processing of output
   - Example usage:
     ```bash
     # Single command to send request and get response
     echo '{"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}' | npm run dev:mcp:stdio
     ```

### JSON-RPC Protocol

The stdio server implements JSON-RPC 2.0 protocol with the following methods:

1. **mcp/list_tools**
   - Lists all available tools and their parameters
   - Request:
     ```json
     {
       "jsonrpc": "2.0",
       "id": 1,
       "method": "mcp/list_tools"
     }
     ```
   - Response:
     ```json
     {
       "jsonrpc": "2.0",
       "id": 1,
       "result": {
         "tools": [
           {
             "name": "search_notes",
             "description": "Search through video notes",
             "parameters": {
               "type": "object",
               "properties": {
                 "query": {
                   "type": "string",
                   "description": "Search query"
                 }
               },
               "required": ["query"]
             }
           }
         ]
       }
     }
     ```

2. **mcp/execute**
   - Executes a specific tool
   - Request:
     ```json
     {
       "jsonrpc": "2.0",
       "id": 2,
       "method": "mcp/execute",
       "params": {
         "tool": "search_notes",
         "parameters": {
           "query": "react hooks"
         }
       }
     }
     ```
   - Response:
     ```json
     {
       "jsonrpc": "2.0",
       "id": 2,
       "result": {
         "result": {
           "results": [
             {
               "id": "1",
               "title": "React Hooks Tutorial",
               "content": "Content about React Hooks..."
             }
           ]
         },
         "status": "success"
       }
     }
     ```

Error responses follow the JSON-RPC 2.0 error format:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "error": {
    "code": -32601,
    "message": "Method not found: unknown_method"
  }
}
```

Common error codes:
- -32700: Parse error
- -32600: Invalid request
- -32601: Method not found
- -32602: Invalid params
- -32603: Internal error

### Understanding Terminal and Process Communication

When working with the MCP server, it's important to understand how terminals and processes communicate:

1. **Terminals and Processes**:
   - Each terminal runs its own independent process
   - Processes in different terminals cannot directly share memory or data
   - They can only communicate through:
     - Files
     - Network (like HTTP)
     - Pipes (|)
     - Environment variables
     - Inter-process communication (IPC) mechanisms

2. **How Pipes Work**:
   - Pipes (`|`) can work across terminals, but in specific ways:
     - **Direct Pipe**: `command1 | command2` (in same terminal)
     - **Named Pipes**: `mkfifo mypipe; command1 > mypipe & command2 < mypipe` (across terminals)
     - **Process Substitution**: `command1 <(command2)` (in same terminal)
   - In our MCP server case, we use direct pipes in the same terminal because:
     - It's simpler to use
     - The server process needs to be running to receive the pipe
     - The server exits after processing one request

3. **In our MCP server case**:
   - When you run `npm run dev:mcp:stdio`, it:
     - Starts a Node.js process
     - Reads from stdin (standard input)
     - Processes the request
     - Writes to stdout (standard output)
     - Exits
   - The pipe (`|`) operator connects the output of one command to the input of another
   - This is why `echo '...' | npm run dev:mcp:stdio` works - it pipes the JSON directly into the Node.js process

4. **Why Interactive Mode is Different**:
   - Interactive mode keeps the Node.js process running
   - It continuously reads from stdin
   - It's like having a conversation with the process
   - You can send multiple requests without restarting

5. **Cross-Terminal Communication Options**:
   - **Named Pipes** (FIFO):
     ```bash
     # Terminal 1: Create and read from the pipe
     mkfifo mcp_pipe
     npm run dev:mcp:stdio < mcp_pipe
     
     # Terminal 2: Write to the pipe
     echo '{"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}' > mcp_pipe
     ```
     - Named pipes are special files that act as communication channels
     - They block until both reading and writing processes are ready
     - Good for: Continuous communication between terminals
     - Limitations: 
       - Pipe must exist before use
       - Need to clean up the pipe file after use
       - Only works on Unix-like systems (Linux, macOS)

   - **Network** (HTTP):
     ```bash
     # Terminal 1: Start the HTTP server
     npm run dev:mcp  # Starts server on port 3002
     
     # Terminal 2: Send HTTP requests
     # Using curl
     curl -X POST -H "Content-Type: application/json" \
          -d '{"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}' \
          http://localhost:3002/mcp/execute
     
     # Using wget
     wget --post-data='{"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}' \
          --header='Content-Type: application/json' \
          http://localhost:3002/mcp/execute
     ```
     - Uses standard HTTP protocol
     - Good for: 
       - Cross-machine communication
       - Integration with other services
       - Web applications
     - Advantages:
       - Works on all platforms
       - Can be accessed from any machine on the network
       - Supports multiple clients
     - Limitations:
       - Requires network setup
       - Slightly more overhead than pipes

   - **Files**:
     ```bash
     # Terminal 1: Read from file
     npm run dev:mcp:stdio < request.json
     
     # Terminal 2: Write to file
     echo '{"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}' > request.json
     
     # Or using a script to continuously monitor the file
     # Terminal 1: Monitor file for changes
     while true; do
       if [ -f request.json ]; then
         npm run dev:mcp:stdio < request.json
         rm request.json  # Clean up after processing
       fi
       sleep 1
     done
     ```
     - Uses the filesystem as an intermediary
     - Good for:
       - Simple cross-terminal communication
       - Persistent communication (requests remain until processed)
       - Debugging (can inspect the request file)
     - Advantages:
       - Works on all platforms
       - Easy to understand and debug
       - Can store request history
     - Limitations:
       - Need to manage file cleanup
       - Potential race conditions
       - Slower than pipes or network

   - **Environment Variables**:
     ```bash
     # Terminal 1: Read from environment variable
     export MCP_REQUEST='{"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}'
     npm run dev:mcp:stdio <<< "$MCP_REQUEST"
     
     # Terminal 2: Set environment variable
     export MCP_REQUEST='{"jsonrpc": "2.0", "id": 1, "method": "mcp/list_tools"}'
     ```
     - Uses system environment variables
     - Good for:
       - Simple configuration
       - Temporary data storage
     - Limitations:
       - Not persistent across terminal sessions
       - Limited by environment variable size
       - Not suitable for continuous communication

### Choosing the Right Communication Method

1. **For Development and Testing**:
   - Use Interactive Mode (single terminal)
   - Simplest to use and debug
   - Immediate feedback

2. **For Automation**:
   - Use Pipe Mode (single terminal)
   - Clean and efficient
   - Good for scripts

3. **For Cross-Terminal Communication**:
   - Use HTTP Mode (network)
   - Most flexible and reliable
   - Works across machines

4. **For Debugging**:
   - Use File Mode
   - Can inspect requests
   - Easy to modify requests

5. **For Unix-like Systems**:
   - Consider Named Pipes
   - Efficient for local communication
   - Good for continuous operation

### MCP Compliance and Improvements

Our implementation follows the Model Context Protocol guidelines from [modelcontextprotocol.io](https://modelcontextprotocol.io/quickstart/server). Here's an analysis of our compliance and potential improvements:

#### Current Compliance

1. **Core MCP Concepts**
   - ✅ Tools (functions that can be called by the LLM)
   - ✅ JSON-RPC 2.0 protocol compliance
   - ✅ Proper error handling with standard JSON-RPC error codes

2. **Server Structure**
   - ✅ Clear tool definitions with parameters
   - ✅ Proper request/response format
   - ✅ Support for both HTTP and stdio transports

3. **Tool Implementation**
   - ✅ Clear parameter definitions
   - ✅ Proper error handling
   - ✅ Async execution support
   - ✅ Type safety

4. **Transport Layer**
   - ✅ HTTP transport (port 3002)
   - ✅ Stdio transport (for CLI usage)

#### Potential Improvements

1. **Resource Support**
   - Add support for Resources (file-like data)
   - Add support for Prompts (pre-written templates)
   - Implement file streaming capabilities
   - Add support for binary data

2. **Tool Documentation**
   - Add more detailed docstrings
   - Include examples in tool descriptions
   - Add parameter validation messages
   - Add usage examples
   - Document error scenarios

3. **Error Handling**
   - Add more specific error codes
   - Improve error messages
   - Add retry mechanisms
   - Add error recovery strategies
   - Implement circuit breakers

4. **Configuration**
   - Add support for server configuration
   - Add environment variable support
   - Add logging configuration
   - Add rate limiting configuration
   - Add security settings

5. **Testing**
   - Add more comprehensive testing
   - Add integration tests
   - Add performance tests
   - Add load testing
   - Add security testing

6. **Security**
   - Add authentication
   - Add authorization
   - Add rate limiting
   - Add input validation
   - Add output sanitization

7. **Monitoring**
   - Add request logging
   - Add performance metrics
   - Add health checks
   - Add usage statistics
   - Add error tracking

8. **Documentation**
   - Add API documentation
   - Add usage guides
   - Add troubleshooting guides
   - Add security guidelines
   - Add deployment guides

### Future Improvements

1. **Authentication**
   - Add authentication to MCP tools
   - Implement token validation
   - Add user-specific tool access

2. **Caching**
   - Implement response caching
   - Add cache invalidation
   - Configure cache policies per tool

3. **Monitoring**
   - Add request logging
   - Implement performance metrics
   - Track tool usage statistics

4. **Error Handling**
   - Add more detailed error responses
   - Implement retry mechanisms
   - Add error reporting

5. **Documentation**
   - Add OpenAPI/Swagger documentation
   - Create tool usage examples
   - Document error codes and responses 