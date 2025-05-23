# Development Notes

## What is Vite?

Vite (French for "quick", pronounced like "veet") is a modern build tool and development server that was created to address the limitations of older tools like Create React App. It's specifically designed for modern web development.

### Why Use Vite?
1. **Development Speed**
   - Traditional bundlers (like webpack) bundle all your code before serving
   - Vite only bundles what's needed, when it's needed
   - This means your development server starts instantly

2. **Modern Browser Features**
   - Uses native ES modules (import/export)
   - Takes advantage of modern browser capabilities
   - No need to bundle everything during development

3. **Optimized for React + TypeScript**
   - Built-in TypeScript support
   - Fast refresh for React components
   - Better error messages and debugging

### How Vite Works
1. **Development Mode**
   - Serves your code as native ES modules
   - Only transforms and serves code when requested
   - No bundling during development

2. **Production Build**
   - Bundles your code for optimal performance
   - Minifies and optimizes for production
   - Creates static files ready for deployment

## File Serving in Vite

### Development Server File Structure
```
video-notes/
├── src/                  # Source files (processed by Vite)
│   ├── App.tsx          # Gets transformed and served
│   ├── App.css          # Gets processed and served
│   └── ...
├── public/              # Static files (served as-is)
│   ├── favicon.ico      # Served at /favicon.ico
│   └── images/          # Served at /images/
└── index.html           # Entry point
```

### How Files are Served
1. **Files in `src/`**
   - Processed by Vite's dev server
   - Transformed on-the-fly (TypeScript → JavaScript, CSS modules, etc.)
   - Served with hot module replacement (HMR)
   - Example: `src/App.tsx` → processed and served as a module

2. **Files in `public/`**
   - Served as static assets
   - Not processed by Vite
   - Available at the root URL path
   - Example: `public/logo.png` → available at `http://localhost:5173/logo.png`

3. **`index.html`**
   - Served as the entry point
   - Vite injects necessary scripts and styles
   - Located at the root of your project

### When to Use `public/`
Use the `public/` folder for:
- Files that need to keep their exact names
- Files that don't need processing
- Files referenced by absolute URLs
- Files that need to be available at a specific path

Example:
```html
<!-- In your HTML -->
<img src="/logo.png" />  <!-- This will look in public/logo.png -->
```

### Build Output
When you run `npm run build`, Vite creates a `dist` folder (not public) with your production files:

```
video-notes/
├── src/                  # Your source code
├── public/              # Static assets
├── dist/                # Production build output
│   ├── assets/         # Processed and bundled files
│   │   ├── index.js    # Bundled JavaScript
│   │   └── index.css   # Bundled CSS
│   ├── index.html      # Processed HTML
│   └── ...             # Other assets
└── ...
```

Key points about the build:
1. **Development vs Production**
   - Development: Files in `src/` are processed on-the-fly
   - Production: Files are bundled and optimized in `dist/`

2. **Bundle Location**
   - Bundles go to `dist/assets/`, not `public/`
   - `public/` files are copied to `dist/` as-is
   - Vite handles all the bundling and optimization

3. **Why Not in Public?**
   - `public/` is for static assets that don't need processing
   - Bundles need processing (minification, optimization)
   - Bundles are generated during build, not stored in source

Example of what happens during build:
```
src/App.tsx + src/components/* → dist/assets/index.js (bundled)
src/App.css + src/styles/* → dist/assets/index.css (bundled)
public/logo.png → dist/logo.png (copied as-is)
```

## NPM Scripts

### Development Server
```bash
npm run dev
# or
npm start
```
Both commands start the Vite development server. They do the same thing because we added `"start": "vite"` to package.json.

What happens when you run these commands:
1. Vite starts a development server
2. Your app becomes available at http://localhost:5173
3. Any changes you make to the code will automatically update in the browser
4. You'll see compilation errors in both the terminal and browser

### Other Available Scripts
```bash
npm run build    # Creates production-ready files
npm run lint     # Checks code for errors
npm run preview  # Previews the production build locally
```

## Vite vs Create React App (CRA)

### Why Vite is Better
1. **Faster Startup**
   - Vite starts instantly
   - CRA can take several seconds to start

2. **Better Development Experience**
   - Instant Hot Module Replacement (HMR)
   - Changes appear in browser immediately
   - No full page reloads needed

3. **Modern Features**
   - Uses native ES modules
   - Better TypeScript support
   - More efficient build process

## Project Structure
```
video-notes/
├── src/                  # Your source code
│   ├── App.tsx          # Main React component
│   ├── App.css          # Styles for App component
│   ├── types/           # TypeScript type definitions
│   │   └── Note.ts      # Note interface
│   └── ...
├── public/              # Static files
├── package.json         # Project configuration
└── vite.config.ts       # Vite configuration
```

## Common Development Tasks

### Adding New Dependencies
```bash
npm install package-name        # Regular dependency
npm install -D package-name     # Development dependency
```

### Running the App
1. Make sure you're in the video-notes directory
2. Run `npm install` if you haven't already
3. Run `npm run dev` or `npm start`
4. Open http://localhost:5173 in your browser

### Making Changes
1. Edit files in the `src` directory
2. Changes will automatically appear in the browser
3. If you see errors, check the terminal and browser console

## Troubleshooting

### Common Issues
1. **"Command not found"**
   - Make sure you're in the video-notes directory
   - Run `npm install` if you haven't

2. **Port 5173 already in use**
   - Another Vite project might be running
   - Close other terminal windows
   - Or use a different port: `npm run dev -- --port 3000`

3. **Module not found errors**
   - Run `npm install` to ensure all dependencies are installed
   - Check if the import path is correct

## Development Changes Log

### Component Structure Changes (2025-05-23)
1. **Created Components Directory**
   - Added `src/components/` directory
   - Moved video and notes functionality to separate component

2. **New VideoNotes Component**
   - Created `src/components/VideoNotes.tsx`
   - Contains all video player and notes functionality
   - Manages its own state for notes
   - Handles note operations (add, edit, delete)

3. **Simplified App Component**
   - `App.tsx` now only contains:
     - App title
     - VideoNotes component
   - Removed state management from App
   - Cleaner, more focused component structure

4. **CSS Updates**
   - Added `.video-notes` wrapper class
   - Maintained existing styles for notes functionality
   - Improved component isolation

### Current Component Structure
```
src/
├── components/
│   └── VideoNotes.tsx    # Video and notes functionality
├── types/
│   └── Note.ts          # Type definitions
├── App.tsx              # Main app component
└── App.css              # Styles
```

### Benefits of This Change
1. **Better Organization**
   - Each component has a single responsibility
   - Easier to find and modify code
   - Clear separation of concerns

2. **Improved Maintainability**
   - Components are more focused
   - Easier to test individual components
   - Simpler to add new features

3. **Code Reusability**
   - VideoNotes component can be reused
   - State management is encapsulated
   - Easier to share components

### Next Steps
1. Consider breaking down VideoNotes into smaller components:
   - VideoPlayer component
   - NotesList component
   - NoteItem component
2. Add proper form handling for note editing
3. Implement timestamp synchronization with video

### Build Process Notes (2025-05-23)
1. **React Import Changes**
   - Removed unused `import React from 'react'` from components
   - Modern React (17+) doesn't require React import for JSX
   - TypeScript warns about unused imports during build

2. **Build Process (`npm run build`)**
   - **Step 1:** TypeScript compilation (`tsc -b`)
   - **Step 2:** Vite build process
     - Bundles all source files
     - Minifies code
     - Optimizes assets
     - Creates `dist` folder

3. **What Gets Bundled**
   - Only used code from your source files
   - Only used dependencies from `node_modules`
   - Tree-shaking removes unused code
   - Results in optimized files in `dist/assets/`

4. **Output Structure**
   ```
   dist/
   ├── assets/           # Bundled and optimized files
   │   ├── index.js     # Main JavaScript bundle
   │   └── index.css    # CSS bundle
   ├── index.html       # Processed HTML
   └── ...              # Other assets
   ```

5. **Key Points**
   - Not all `node_modules` are included
   - Only used dependencies are bundled
   - Multiple optimized files, not one giant file
   - Static files from `public/` are copied as-is

### Production Deployment Notes (2025-05-23)
1. **Running Production Build**
   - Use `npm run preview` to test production build locally
   - Runs on port 4173 by default (different from dev server's 5173)
   - Command: `npm run preview -- --port 3000` to use a specific port

2. **Bundle Files**
   - Vite generates unique filenames with hashes (e.g., `index-a1b2c3.js`)
   - Hash changes when content changes (for cache busting)
   - `index.html` automatically references the correct bundle
   - Example structure:
     ```
     dist/
     ├── assets/
     │   ├── index-a1b2c3.js    # Main bundle
     │   ├── vendor-x7y8z9.js   # Third-party dependencies
     │   └── index-d4e5f6.css   # Styles
     └── index.html             # References correct bundles
     ```

3. **How Bundle Loading Works**
   - `index.html` contains the correct paths to bundles
   - Vite updates these paths during build
   - No manual configuration needed
   - Example from index.html:
     ```html
     <script type="module" src="/assets/index-a1b2c3.js"></script>
     ```

4. **Multiple Bundles**
   - Main app code → `index-xxx.js`
   - Third-party dependencies → `vendor-xxx.js`
   - CSS → `index-xxx.css`
   - Assets (images, etc.) → `asset-xxx.ext`

5. **Deployment**
   - Copy entire `dist` folder to web server
   - No need to run a Node.js server
   - Can be hosted on any static file server
   - Example: GitHub Pages, Netlify, Vercel, etc.

6. **Cache Busting**
   - **What it is:** A technique to force browsers to load new versions of files
   - **How it works:** 
     - Each build generates unique hashes for files
     - When you update your code, the hash changes
     - Browser sees new filename and loads fresh copy
   - **Why it's needed:**
     - Browsers cache files to load faster
     - Without cache busting, users might see old versions
     - Hash changes = new file to browser = fresh content

7. **Bundle Creation with Many Components**
   - **Single Bundle Approach (Default)**
     - All components → one `index-xxx.js`
     - Pros: Fewer HTTP requests, faster initial load
     - Cons: Larger initial download
   
   - **Code Splitting (Optional)**
     - Components can be split into separate bundles
     - Example structure:
       ```
       dist/assets/
       ├── index-xxx.js          # Main app code
       ├── vendor-xxx.js         # Third-party code
       ├── component1-xxx.js     # Split component
       ├── component2-xxx.js     # Split component
       └── index-xxx.css         # Styles
       ```
     - How to split: Use dynamic imports
       ```typescript
       // Instead of: import BigComponent from './BigComponent'
       const BigComponent = React.lazy(() => import('./BigComponent'))
       ```
     - Benefits:
       - Load components only when needed
       - Smaller initial bundle
       - Better performance for large apps

### Component Analysis: VideoNotes.tsx

1. **TypeScript and React Imports**
   ```typescript
   import { useState } from 'react'
   import type { Note } from '../types/Note'
   ```
   - `useState`: React Hook for state management
   - `type { Note }`: TypeScript type import (only used for type checking)
   - The `type` keyword means this import is removed during compilation

2. **Component Definition**
   ```typescript
   export function VideoNotes() {
     // Component code
   }
   ```
   - `export`: Makes component available to other files
   - Function component (modern React approach)
   - No props needed (empty parentheses)

3. **State Management**
   ```typescript
   const [notes, setNotes] = useState<Note[]>([
     {
       id: '1',
       content: 'Introduction to React',
       startTime: 0,
       endTime: 120
     },
     // ...
   ]);
   ```
   - `useState<Note[]>`: TypeScript generic type
   - `Note[]`: Array of Note objects
   - Initial state with sample data
   - `setNotes`: Function to update state

4. **Event Handlers**
   ```typescript
   const handleAddNote = (index: number) => {
     const newNote: Note = {
       id: Date.now().toString(),
       content: 'New Note',
       startTime: 0,
       endTime: 0
     };
     const newNotes = [...notes];
     newNotes.splice(index + 1, 0, newNote);
     setNotes(newNotes);
   };
   ```
   - TypeScript parameter typing (`index: number`)
   - Type annotation for new object (`newNote: Note`)
   - Array spread operator (`[...notes]`)
   - Immutable state update pattern

5. **JSX Structure**
   ```typescript
   return (
     <div className="video-notes">
       <div className="video-container">
         <iframe /* ... */ />
       </div>
       <div className="notes-container">
         <h2>Notes</h2>
         {notes.map((note, index) => (
           // Note items
         ))}
       </div>
     </div>
   )
   ```
   - JSX syntax (HTML-like in JavaScript)
   - Component composition
   - Array mapping for dynamic content
   - Conditional rendering with `map`

6. **TypeScript Features Used**
   - Type annotations
   - Interface imports
   - Generic types
   - Type inference
   - Type safety for props and state

7. **React Patterns**
   - Functional component
   - Hooks (useState)
   - Event handling
   - List rendering
   - State management
   - Component composition

8. **Component Structure**
   ```
   VideoNotes
   ├── State
   │   └── notes (Note[])
   ├── Event Handlers
   │   ├── handleAddNote
   │   ├── handleDeleteNote
   │   └── handleEditNote
   └── JSX
       ├── Video Container
       │   └── iframe
       └── Notes Container
           ├── Title
           └── Note List
               └── Note Items
   ```

9. **Key Learning Points**
   - TypeScript provides type safety
   - React components are functions
   - State management with hooks
   - JSX for UI structure
   - Event handling in React
   - Component composition
   - Immutable state updates

### React State Management and Data Binding

1. **State Update Pattern**
   ```typescript
   const handleEditNote = (id: string, content: string) => {
     setNotes(notes.map(note => 
       note.id === id ? { ...note, content } : note
     ));
   };
   ```
   - **State Setter**: `setNotes` is the function to update state
   - **Why we need setters**: React requires state updates through setters to:
     - Trigger re-renders
     - Maintain state immutability
     - Enable React's change detection
   - **Syntax Breakdown**:
     - `notes.map()`: Creates new array (immutable update)
     - `note.id === id`: Finds note to update
     - `{ ...note, content }`: Spreads old note properties, updates content
     - `: note`: Returns unchanged note if not the one being edited

2. **useState Hook**
   ```typescript
   const [notes, setNotes] = useState<Note[]>([]);
   ```
   - **Array Destructuring**: `[state, setState]`
   - **First value**: Current state (`notes`)
   - **Second value**: Function to update state (`setNotes`)
   - **Initial value**: Passed to useState (`[]`)

3. **Data Binding in React**
   - **One-way Data Flow**:
     ```
     State (notes) → Component → UI
     ```
   - **How it works**:
     ```typescript
     // State declaration
     const [notes, setNotes] = useState<Note[]>([]);
     
     // Data binding in JSX
     {notes.map((note, index) => (
       <div key={note.id}>
         <p>{note.content}</p>
       </div>
     ))}
     ```
   - **Automatic Updates**:
     - When `setNotes` is called
     - React re-renders component
     - New data flows to UI
     - No manual DOM updates needed

4. **State Update Rules**
   - **Always use setter functions**
     ```typescript
     // ❌ Wrong
     notes[0].content = "New content";
     
     // ✅ Correct
     setNotes(notes.map(note => 
       note.id === id ? { ...note, content: "New content" } : note
     ));
     ```
   - **State updates are asynchronous**
   - **State updates are batched**
   - **State should be immutable**

5. **Common State Patterns**
   ```typescript
   // Adding to state
   setNotes([...notes, newNote]);
   
   // Removing from state
   setNotes(notes.filter(note => note.id !== idToRemove));
   
   // Updating single item
   setNotes(notes.map(note => 
     note.id === id ? { ...note, content: newContent } : note
   ));
   ```

6. **Why This Approach?**
   - **Predictability**: State changes are explicit
   - **Performance**: React can optimize updates
   - **Debugging**: Easier to track changes
   - **Maintainability**: Clear data flow

7. **Real-world Example**
   ```typescript
   // State declaration
   const [notes, setNotes] = useState<Note[]>([]);
   
   // Event handler
   const handleEditNote = (id: string, content: string) => {
     setNotes(notes.map(note => 
       note.id === id ? { ...note, content } : note
     ));
   };
   
   // UI binding
   return (
     <div>
       {notes.map(note => (
         <div key={note.id}>
           <p>{note.content}</p>
           <button onClick={() => handleEditNote(note.id, "New content")}>
             Edit
           </button>
         </div>
       ))}
     </div>
   );
   ```

### Understanding JSX

1. **What is JSX?**
   - JavaScript XML - syntax extension for JavaScript
   - Allows writing HTML-like code in JavaScript
   - Gets transformed into regular JavaScript during build
   - Example:
     ```jsx
     // JSX
     const element = <h1>Hello, {name}</h1>;
     
     // Transformed to JavaScript
     const element = React.createElement('h1', null, 'Hello, ', name);
     ```

2. **JSX Syntax Rules**
   - **Must return a single root element**
     ```jsx
     // ❌ Wrong
     return (
       <h1>Title</h1>
       <p>Content</p>
     );
     
     // ✅ Correct
     return (
       <div>
         <h1>Title</h1>
         <p>Content</p>
       </div>
     );
     ```
   
   - **JavaScript expressions in curly braces**
     ```jsx
     const name = "John";
     const element = <h1>Hello, {name}</h1>;
     const sum = <p>Sum: {1 + 2 + 3}</p>;
     ```

   - **Attributes use camelCase**
     ```jsx
     // HTML: class="container"
     // JSX: className="container"
     <div className="container">
     ```

3. **JSX in VideoNotes Component**
   ```jsx
   return (
     <div className="video-notes">
       <div className="video-container">
         <iframe
           width="560"
           height="315"
           src="https://www.youtube.com/embed/dQw4w9WgXcQ"
           title="YouTube video player"
           frameBorder="0"
           allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
           allowFullScreen
         ></iframe>
       </div>
       <div className="notes-container">
         <h2>Notes</h2>
         {notes.map((note, index) => (
           <div key={note.id} className="note-item">
             <div className="note-content">
               <p>{note.content}</p>
               <p className="timestamp">
                 {Math.floor(note.startTime / 60)}:{(note.startTime % 60).toString().padStart(2, '0')} - 
                 {Math.floor(note.endTime / 60)}:{(note.endTime % 60).toString().padStart(2, '0')}
               </p>
             </div>
             <div className="note-actions">
               <button onClick={() => handleAddNote(index)}>Add</button>
               <button onClick={() => handleEditNote(note.id, prompt('Edit note:', note.content) || note.content)}>
                 Edit
               </button>
               <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
             </div>
           </div>
         ))}
       </div>
     </div>
   );
   ```

4. **Key JSX Features Used**
   - **Component Structure**
     - Nested elements
     - Semantic HTML structure
     - Proper indentation for readability
   
   - **Dynamic Content**
     - Array mapping (`notes.map()`)
     - JavaScript expressions in curly braces
     - Template literals for timestamps
   
   - **Event Handling**
     - `onClick` handlers
     - Arrow functions for callbacks
     - Event parameter passing
   
   - **Conditional Rendering**
     - Ternary operators
     - Logical AND (&&)
     - Optional chaining

5. **JSX Best Practices**
   - **Keep components focused**
     ```jsx
     // ❌ Too much in one component
     <div>
       <VideoPlayer />
       <NotesList />
       <UserProfile />
       <Settings />
     </div>
     
     // ✅ Split into components
     <div>
       <VideoNotes />
       <UserSection />
     </div>
     ```
   
   - **Use meaningful variable names**
     ```jsx
     // ❌ Unclear
     <div>{n.map(i => <p>{i.c}</p>)}</div>
     
     // ✅ Clear
     <div>{notes.map(note => <p>{note.content}</p>)}</div>
     ```
   
   - **Extract complex logic**
     ```jsx
     // ❌ Complex JSX
     <p>{Math.floor(note.startTime / 60)}:{(note.startTime % 60).toString().padStart(2, '0')}</p>
     
     // ✅ Extracted function
     const formatTime = (seconds: number) => {
       const minutes = Math.floor(seconds / 60);
       const remainingSeconds = seconds % 60;
       return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
     };
     
     <p>{formatTime(note.startTime)}</p>
     ```

6. **Common JSX Patterns**
   - **List Rendering**
     ```jsx
     {items.map(item => (
       <li key={item.id}>{item.name}</li>
     ))}
     ```
   
   - **Conditional Rendering**
     ```jsx
     {isLoading ? <Spinner /> : <Content />}
     {error && <ErrorMessage message={error} />}
     ```
   
   - **Event Handling**
     ```jsx
     <button onClick={() => handleClick(id)}>Click me</button>
     <input onChange={(e) => handleChange(e.target.value)} />
     ```

     The `{ ...note, content }` syntax is a very common and powerful pattern in modern JavaScript, especially when working with state in React or other frameworks. It uses two key JavaScript features:

1.  **Object Destructuring** (on the left side, implicitly): `...note`
2.  **Object Property Shorthand** (on the right side, `content`)

Let's break it down:

## Understanding `{ ...note, content }`

Imagine you have a `note` object that looks something like this:

```javascript
const note = {
  id: "123",
  content: "This is the original content",
  timestamp: "2025-05-23T09:30:00Z",
  tags: ["todo", "urgent"],
};
```

When you use `{ ...note, content }` inside `handleEditNote`, here's what happens step-by-step:

### 1. `...note` (Spread Syntax for Objects)

* The **spread syntax (`...`)** when applied to an object (`...note`) creates a **shallow copy** of all the enumerable properties from the `note` object into a *new* object.
* **Result of `...note`**: A new object that looks like this:
    ```javascript
    {
      id: "123",
      content: "This is the original content",
      timestamp: "2025-05-23T09:30:00Z",
      tags: ["todo", "urgent"],
    }
    ```
    Crucially, this is a *new* object, not a reference to the original `note`. This is vital for immutability in React state management.

### 2. `content` (Object Property Shorthand / Overwriting)

* After spreading the `note` object, you then add or overwrite properties in the new object.
* In this case, `content` is a **property shorthand**. It's equivalent to `content: content`.
* The `content` variable in `handleEditNote` is the *new content* that you're passing in (`const handleEditNote = (id: string, **content: string**) => { ... }`).
* So, by writing `content`, you are telling JavaScript: "Take the value of the `content` variable (which is the new content) and assign it to a property named `content` in this new object."
* Since `...note` already copied an `content` property, this new `content` property will **overwrite** the old one.

### Putting it Together:

Original `note`:

```javascript
{
  id: "123",
  content: "This is the original content", // Old content
  timestamp: "2025-05-23T09:30:00Z",
  tags: ["todo", "urgent"],
}
```

Let's say the `content` argument passed to `handleEditNote` is `"This is the updated content"`.

The expression `{ ...note, content }` evaluates to:

1.  Start with a new empty object: `{}`
2.  Spread all properties from `note` into it:
    ```javascript
    {
      id: "123",
      content: "This is the original content",
      timestamp: "2025-05-23T09:30:00Z",
      tags: ["todo", "urgent"],
    }
    ```
3.  Add/overwrite the `content` property with the value of the `content` variable (`"This is the updated content"`):
    ```javascript
    {
      id: "123",
      content: "This is the updated content", // This overwrites the old content
      timestamp: "2025-05-23T09:30:00Z",
      tags: ["todo", "urgent"],
    }
    ```

## Why is this important for `setNotes`?

React (and other state management patterns) relies heavily on **immutability**. You should never directly modify existing state objects or arrays. Instead, you should always create *new* objects or arrays with the desired changes.

* `notes.map(...)`: The `map` method itself creates a new array.
* `note.id === id ? { ...note, content } : note`:
    * If the `note.id` matches the `id` you want to edit, you return a **brand new note object** with the `content` updated, while keeping all other properties from the original `note`.
    * If the `note.id` does *not* match, you return the `note` object *as is* (without modification).

By doing this, `setNotes` receives a brand new array where only the specific note object you wanted to change has been replaced by a new, updated version of itself. This allows React to efficiently detect changes and re-render components.

### TypeScript vs C# Interfaces

1. **Key Differences**
   ```typescript
   // TypeScript Interface
   interface Note {
     id: string;
     content: string;
   }
   
   // Can be used directly as a type
   const note: Note = {
     id: "1",
     content: "Hello"
   };
   ```
   ```csharp
   // C# Interface
   interface INote {
     string Id { get; set; }
     string Content { get; set; }
   }
   
   // Must be implemented by a class
   class Note : INote {
     public string Id { get; set; }
     public string Content { get; set; }
   }
   ```

2. **TypeScript's Structural Typing**
   - TypeScript uses "duck typing"
   - Objects don't need to explicitly implement interfaces
   - If an object has the required properties, it's compatible
   ```typescript
   interface Note {
     id: string;
     content: string;
   }
   
   // This works! No explicit implementation needed
   const note = {
     id: "1",
     content: "Hello",
     extra: "This is fine too"
   };
   
   function processNote(note: Note) {
     console.log(note.id);
   }
   
   // This is valid TypeScript
   processNote(note);
   ```

3. **C#'s Nominal Typing**
   - C# requires explicit interface implementation
   - Classes must declare they implement an interface
   - More strict type checking
   ```csharp
   interface INote {
     string Id { get; set; }
     string Content { get; set; }
   }
   
   // Must explicitly implement INote
   class Note : INote {
     public string Id { get; set; }
     public string Content { get; set; }
   }
   ```

4. **When to Use Each Approach**

   **TypeScript (Structural):**
   ```typescript
   // Good for:
   interface User {
     id: string;
     name: string;
   }
   
   // Any object with these properties works
   const user = {
     id: "1",
     name: "John",
     email: "john@example.com"  // Extra properties are fine
   };
   
   function displayUser(user: User) {
     console.log(user.name);
   }
   
   displayUser(user);  // Works!
   ```

   **C# (Nominal):**
   ```csharp
   // Good for:
   interface IUser {
     string Id { get; set; }
     string Name { get; set; }
   }
   
   // Must explicitly implement
   class User : IUser {
     public string Id { get; set; }
     public string Name { get; set; }
   }
   ```

5. **Benefits of Each**

   **TypeScript's Approach:**
   - More flexible
   - Less boilerplate
   - Better for React props/state
   - Easier to work with external data
   - Great for API responses

   **C#'s Approach:**
   - More strict
   - Clearer contracts
   - Better for large systems
   - Enforces implementation
   - Better for team development

6. **Real-world Example**
   ```typescript
   // TypeScript: Flexible and direct
   interface ApiResponse {
     data: any;
     status: number;
   }
   
   // Can use any object matching the structure
   const response = {
     data: { id: 1 },
     status: 200,
     timestamp: new Date()  // Extra property is fine
   };
   
   function handleResponse(response: ApiResponse) {
     console.log(response.status);
   }
   
   handleResponse(response);  // Works!
   ```

   ```csharp
   // C#: Strict and explicit
   interface IApiResponse {
     object Data { get; set; }
     int Status { get; set; }
   }
   
   class ApiResponse : IApiResponse {
     public object Data { get; set; }
     public int Status { get; set; }
   }
   
   // Must use the exact class
   var response = new ApiResponse {
     Data = new { id = 1 },
     Status = 200
   };
   ```

7. **Best Practices**

   **TypeScript:**
   - Use interfaces for type definitions
   - Don't worry about implementation
   - Focus on structure
   - Great for React development

   **C#:**
   - Use interfaces for contracts
   - Explicitly implement interfaces
   - Focus on behavior
   - Great for enterprise applications

### TypeScript in React Development

1. **Props and State Typing**
   ```typescript
   // Interface for component props
   interface VideoPlayerProps {
     url: string;
     autoplay?: boolean;
     onTimeUpdate?: (time: number) => void;
   }
   
   // Using props in component
   function VideoPlayer({ url, autoplay, onTimeUpdate }: VideoPlayerProps) {
     // TypeScript knows all prop types
     const [currentTime, setCurrentTime] = useState<number>(0);
     
     return (
       <div>
         <video 
           src={url} 
           autoPlay={autoplay}
           onTimeUpdate={(e) => onTimeUpdate?.(e.currentTarget.currentTime)}
         />
       </div>
     );
   }
   ```

2. **API Response Handling**
   ```typescript
   // Define API response type
   interface ApiResponse<T> {
     data: T;
     status: number;
     message?: string;
   }
   
   // Use in component
   function UserProfile() {
     const [user, setUser] = useState<ApiResponse<User> | null>(null);
     
     useEffect(() => {
       fetch('/api/user')
         .then(res => res.json())
         .then((data: ApiResponse<User>) => setUser(data));
     }, []);
     
     return user?.data ? <div>{user.data.name}</div> : null;
   }
   ```

3. **Event Handling**
   ```typescript
   interface FormData {
     username: string;
     email: string;
   }
   
   function UserForm() {
     const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
       e.preventDefault();
       const formData = new FormData(e.currentTarget);
       const data: FormData = {
         username: formData.get('username') as string,
         email: formData.get('email') as string
       };
       // Process data
     };
     
     return (
       <form onSubmit={handleSubmit}>
         <input name="username" type="text" />
         <input name="email" type="email" />
         <button type="submit">Submit</button>
       </form>
     );
   }
   ```

### Effective Structural Typing Patterns

1. **Type Guards**
   ```typescript
   interface User {
     id: string;
     name: string;
   }
   
   interface Admin extends User {
     permissions: string[];
   }
   
   // Type guard function
   function isAdmin(user: User): user is Admin {
     return 'permissions' in user;
   }
   
   function processUser(user: User) {
     if (isAdmin(user)) {
       // TypeScript knows user is Admin here
       console.log(user.permissions);
     } else {
       // TypeScript knows user is just User here
       console.log(user.name);
     }
   }
   ```

2. **Partial Types**
   ```typescript
   interface Note {
     id: string;
     content: string;
     timestamp: Date;
   }
   
   // For update operations
   function updateNote(id: string, changes: Partial<Note>) {
     // changes only needs some Note properties
     const note = { id, ...changes };
     // Process update
   }
   
   // Usage
   updateNote("123", { content: "New content" });
   ```

3. **Pick and Omit**
   ```typescript
   interface User {
     id: string;
     name: string;
     email: string;
     password: string;
   }
   
   // Only include these properties
   type UserPublic = Pick<User, 'id' | 'name' | 'email'>;
   
   // Exclude these properties
   type UserSafe = Omit<User, 'password'>;
   ```

### Converting C# Patterns to TypeScript

1. **Interface Implementation**
   ```csharp
   // C#
   interface IUserService {
     User GetUser(int id);
     void SaveUser(User user);
   }
   
   class UserService : IUserService {
     public User GetUser(int id) { /* ... */ }
     public void SaveUser(User user) { /* ... */ }
   }
   ```
   ```typescript
   // TypeScript
   interface UserService {
     getUser(id: number): User;
     saveUser(user: User): void;
   }
   
   // No need for explicit implementation
   const userService: UserService = {
     getUser(id) { /* ... */ },
     saveUser(user) { /* ... */ }
   };
   ```

2. **Dependency Injection**
   ```csharp
   // C#
   interface ILogger {
     void Log(string message);
   }
   
   class UserService {
     private readonly ILogger _logger;
     
     public UserService(ILogger logger) {
       _logger = logger;
     }
   }
   ```
   ```typescript
   // TypeScript
   interface Logger {
     log(message: string): void;
   }
   
   class UserService {
     constructor(private logger: Logger) {}
   }
   
   // Usage
   const logger: Logger = {
     log(message) { console.log(message); }
   };
   
   const userService = new UserService(logger);
   ```

3. **Repository Pattern**
   ```csharp
   // C#
   interface IRepository<T> {
     T GetById(int id);
     IEnumerable<T> GetAll();
     void Add(T entity);
   }
   ```
   ```typescript
   // TypeScript
   interface Repository<T> {
     getById(id: number): T;
     getAll(): T[];
     add(entity: T): void;
   }
   
   // Implementation
   class NoteRepository implements Repository<Note> {
     private notes: Note[] = [];
     
     getById(id: number): Note {
       return this.notes.find(note => note.id === id);
     }
     
     getAll(): Note[] {
       return this.notes;
     }
     
     add(note: Note): void {
       this.notes.push(note);
     }
   }
   ```

4. **Factory Pattern**
   ```csharp
   // C#
   interface IUserFactory {
     User CreateUser(string name, string email);
   }
   ```
   ```typescript
   // TypeScript
   interface UserFactory {
     createUser(name: string, email: string): User;
   }
   
   // Implementation
   const userFactory: UserFactory = {
     createUser(name, email) {
       return {
         id: Date.now().toString(),
         name,
         email
       };
     }
   };
   ```

5. **Best Practices for Conversion**
   - Use interfaces for type definitions
   - Use classes when you need inheritance
   - Leverage TypeScript's structural typing
   - Use type guards for runtime checks
   - Consider using type aliases for complex types
   - Use generics for reusable components
   - Take advantage of utility types (Partial, Pick, Omit)

### Understanding Duck Typing in TypeScript

1. **What is Duck Typing?**
   - "If it walks like a duck and quacks like a duck, it's a duck"
   - TypeScript checks the structure of objects, not their names
   - Objects are compatible if they have the required properties
   ```typescript
   interface Duck {
     walk: () => void;
     quack: () => void;
   }
   
   // This is a "duck" even though it's not explicitly a Duck
   const myObject = {
     walk: () => console.log("Walking"),
     quack: () => console.log("Quack!"),
     swim: () => console.log("Swimming")  // Extra property is fine
   };
   
   // TypeScript accepts this because myObject has the required properties
   function makeDuckWalk(duck: Duck) {
     duck.walk();
   }
   
   makeDuckWalk(myObject);  // Works!
   ```

2. **Duck Typing in React**
   ```typescript
   interface ButtonProps {
     text: string;
     onClick: () => void;
   }
   
   // This object matches ButtonProps even though it's not explicitly typed
   const buttonData = {
     text: "Click me",
     onClick: () => console.log("Clicked!"),
     className: "primary"  // Extra property is allowed
   };
   
   function Button({ text, onClick }: ButtonProps) {
     return <button onClick={onClick}>{text}</button>;
   }
   
   // Works because buttonData has the required properties
   <Button {...buttonData} />
   ```

3. **Duck Typing vs Nominal Typing**
   ```typescript
   // Duck Typing (TypeScript)
   interface Animal {
     name: string;
     makeSound: () => void;
   }
   
   // These are all valid "animals"
   const dog = {
     name: "Rex",
     makeSound: () => console.log("Woof!")
   };
   
   const cat = {
     name: "Whiskers",
     makeSound: () => console.log("Meow!")
   };
   
   function makeAnimalSound(animal: Animal) {
     animal.makeSound();
   }
   
   makeAnimalSound(dog);   // Works!
   makeAnimalSound(cat);   // Works!
   ```
   ```csharp
   // Nominal Typing (C#)
   interface IAnimal {
     string Name { get; }
     void MakeSound();
   }
   
   // Must explicitly implement the interface
   class Dog : IAnimal {
     public string Name { get; }
     public void MakeSound() => Console.WriteLine("Woof!");
   }
   
   class Cat : IAnimal {
     public string Name { get; }
     public void MakeSound() => Console.WriteLine("Meow!");
   }
   ```

4. **Benefits of Duck Typing**
   - More flexible code
   - Less boilerplate
   - Easier to work with external data
   - Better for API responses
   - Great for React props

5. **Common Use Cases**
   ```typescript
   // API Responses
   interface User {
     id: string;
     name: string;
   }
   
   // This works even though the API response isn't explicitly typed
   fetch('/api/user')
     .then(res => res.json())
     .then((data: User) => {
       console.log(data.name);  // Works if data has name property
     });
   
   // React Props
   interface CardProps {
     title: string;
     content: string;
   }
   
   // This works even though the data isn't explicitly a CardProps
   const cardData = {
     title: "Hello",
     content: "World",
     extra: "Info"  // Extra properties are fine
   };
   
   function Card({ title, content }: CardProps) {
     return (
       <div>
         <h2>{title}</h2>
         <p>{content}</p>
       </div>
     );
   }
   
   <Card {...cardData} />  // Works!
   ```

6. **Potential Pitfalls**
   ```typescript
   interface User {
     id: string;
     name: string;
   }
   
   // ❌ Might cause runtime errors
   const user = {
     id: "1",
     // Missing name property
   };
   
   function displayUser(user: User) {
     console.log(user.name);  // Runtime error!
   }
   
   // ✅ Better: Use type guards
   function isUser(obj: any): obj is User {
     return 'id' in obj && 'name' in obj;
   }
   
   if (isUser(user)) {
     displayUser(user);  // Safe!
   }
   ```

7. **Best Practices**
   - Use interfaces to define expected shapes
   - Add type guards for runtime safety
   - Be explicit about required properties
   - Use optional properties when appropriate
   - Consider using strict type checking
   - Document expected object shapes
 
 ### Component Analysis: VideoNotes.tsx

1. **TypeScript and React Imports**
   ```typescript
   import { useState } from 'react'
   import type { Note } from '../types/Note'
   ```
   - `useState`: React Hook for state management
   - `type { Note }`: TypeScript type import (only used for type checking)
   - The `type` keyword means this import is removed during compilation

2. **Component Definition**
   ```typescript
   export function VideoNotes() {
     // Component code
   }
   ```
   - `export`: Makes component available to other files
   - Function component (modern React approach)
   - No props needed (empty parentheses)

3. **State Management**
   ```typescript
   const [notes, setNotes] = useState<Note[]>([
     {
       id: '1',
       content: 'Introduction to React',
       startTime: 0,
       endTime: 120
     },
     // ...
   ]);
   ```
   - `useState<Note[]>`: TypeScript generic type
   - `Note[]`: Array of Note objects
   - Initial state with sample data
   - `setNotes`: Function to update state

4. **Event Handlers**
   ```typescript
   const handleAddNote = (index: number) => {
     const newNote: Note = {
       id: Date.now().toString(),
       content: 'New Note',
       startTime: 0,
       endTime: 0
     };
     const newNotes = [...notes];
     newNotes.splice(index + 1, 0, newNote);
     setNotes(newNotes);
   };
   ```
   - TypeScript parameter typing (`index: number`)
   - Type annotation for new object (`newNote: Note`)
   - Array spread operator (`[...notes]`)
   - Immutable state update pattern

5. **JSX Structure**
   ```typescript
   return (
     <div className="video-notes">
       <div className="video-container">
         <iframe /* ... */ />
       </div>
       <div className="notes-container">
         <h2>Notes</h2>
         {notes.map((note, index) => (
           // Note items
         ))}
       </div>
     </div>
   )
   ```
   - JSX syntax (HTML-like in JavaScript)
   - Component composition
   - Array mapping for dynamic content
   - Conditional rendering with `map`

6. **TypeScript Features Used**
   - Type annotations
   - Interface imports
   - Generic types
   - Type inference
   - Type safety for props and state

7. **React Patterns**
   - Functional component
   - Hooks (useState)
   - Event handling
   - List rendering
   - State management
   - Component composition

8. **Component Structure**
   ```
   VideoNotes
   ├── State
   │   └── notes (Note[])
   ├── Event Handlers
   │   ├── handleAddNote
   │   ├── handleDeleteNote
   │   └── handleEditNote
   └── JSX
       ├── Video Container
       │   └── iframe
       └── Notes Container
           ├── Title
           └── Note List
               └── Note Items
   ```

9. **Key Learning Points**
   - TypeScript provides type safety
   - React components are functions
   - State management with hooks
   - JSX for UI structure
   - Event handling in React
   - Component composition
   - Immutable state updates

### Understanding Props, State, and Callbacks in React

1. **What are Props?**
   - Props (short for "properties") are how you pass data from a parent component to a child component in React.
   - They are read-only for the child. The child can use them, but cannot change them directly.

2. **Passing state and callbacks as props:**
   - If you pass a piece of state (like `notes` or `count`) as a prop, the child can only read it, not change it.
   - If you want the child to be able to request a change to the parent's state, you must also pass a callback function (like `onEdit`, `onAdd`, or `onIncrement`) as a prop.
   - The child calls this callback to "ask" the parent to update its state.

3. **Example:**
```tsx
// Parent
function Parent() {
  const [count, setCount] = useState(0);
  return (
    <Child 
      count={count}           // Passing state as prop
      onIncrement={() => setCount(count + 1)}  // Passing callback
    />
  );
}

// Child
function Child({ count, onIncrement }) {
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={onIncrement}>Increment</button>
    </div>
  );
}
```
- The child cannot do `count++` or `count = 5` (that would be an error).
- The only way for the child to change the parent's state is to call the callback (`onIncrement`).

4. **State vs Props**
   ```typescript
   // Parent Component (State Owner)
   function Parent() {
     const [notes, setNotes] = useState<Note[]>([]);
     
     // State can be modified here
     const handleAddNote = (newNote: Note) => {
       setNotes([...notes, newNote]);
     };
     
     return (
       <Child 
         notes={notes}           // Read-only state passed as prop
         onAddNote={handleAddNote}  // Callback to modify state
       />
     );
   }
   
   // Child Component (Props Receiver)
   function Child({ notes, onAddNote }) {
     // Can read notes but cannot modify directly
     return (
       <div>
         {notes.map(note => (
           <div key={note.id}>{note.content}</div>
         ))}
         <button onClick={() => onAddNote({ id: '1', content: 'New Note' })}>
           Add Note
         </button>
       </div>
     );
   }
   ```

5. **Callback Pattern**
   ```typescript
   // Parent: Defines state and callback
   function VideoNotes() {
     const [notes, setNotes] = useState<Note[]>([]);
     
     const handleEditNote = (id: string, content: string) => {
       setNotes(notes.map(note => 
         note.id === id ? { ...note, content } : note
       ));
     };
     
     return (
       <Note 
         note={note}
         onEdit={handleEditNote}  // Passing callback
       />
     );
   }
   
   // Child: Uses callback to request state change
   function Note({ note, onEdit }) {
     return (
       <button onClick={() => onEdit(note.id, 'New Content')}>
         Edit
       </button>
     );
   }
   ```

6. **One-Way Data Flow**
   ```
   Parent Component
   │
   ├── State
   │   └── [notes, setNotes]
   │
   ├── Props to Child
   │   ├── notes (read-only state)
   │   └── onEdit (callback)
   │
   └── Child Component
       └── Calls onEdit to request state change
   ```

7. **Why This Pattern?**
   - **Predictability**: Data flows in one direction
   - **Maintainability**: State changes are centralized
   - **Debugging**: Easier to track state changes
   - **Performance**: React can optimize renders

8. **Real Example from VideoNotes**
   ```typescript
   // VideoNotes (Parent)
   export function VideoNotes() {
     const [notes, setNotes] = useState<Note[]>([]);
     
     const handleEditNote = (id: string, content: string) => {
       setNotes(notes.map(note => 
         note.id === id ? { ...note, content } : note
       ));
     };
     
     return (
       <Note 
         note={note}
         onEdit={handleEditNote}  // Callback to update state
       />
     );
   }
   
   // Note (Child)
   function Note({ note, onEdit }) {
     return (
       <button onClick={() => onEdit(note.id, prompt('Edit note:') || note.content)}>
         Edit
       </button>
     );
   }
   ```

9. **Best Practices**
   - Keep state as high as needed in the component tree
   - Pass callbacks down to children
   - Never modify props directly
   - Use callbacks to request state changes
   - Keep components focused on their responsibilities

### Time Selection Overlay Implementation (2024-03-26)
1. **New TimeSelectionOverlay Component**
   - Created `src/components/TimeSelectionOverlay.tsx`
   - Implements draggable time selection points
   - Shows time tooltips for start and end times
   - Visual selection range between handles
   - Prevents invalid time ranges (start > end)

2. **Component Features**
   - Draggable handles for start and end times
   - Real-time time display in tooltips
   - Visual feedback for selected range
   - Smooth drag interaction
   - Responsive to video duration

3. **Integration with VideoNotes**
   - Added video duration state
   - Positioned overlay above video controls
   - Time change callback for future note integration
   - Relative positioning for proper overlay placement

4. **Technical Details**
   - Uses React refs for DOM measurements
   - Implements mouse event handling
   - Calculates time based on drag position
   - Formats time display (MM:SS)
   - Handles edge cases (min/max times)

5. **Next Steps**
   - Integrate with YouTube Player API for actual duration
   - Connect time selection to note creation
   - Add keyboard controls for precise time selection
   - Implement time range validation
   - Add visual feedback for current playback position

## CSS Positioning Explained

### Relative vs Absolute Positioning

CSS positioning is a way to control where elements are placed on a webpage. Let's understand the two most common types:

1. **Relative Positioning**
- When you set `position: relative` on an element, it positions the element relative to its normal position in the document flow
- Think of it like saying "move this element a bit from where it would normally be"
- The element still takes up space in the normal document flow
- You can use `top`, `right`, `bottom`, and `left` properties to move it from its original position

2. **Absolute Positioning**
- When you set `position: absolute` on an element, it removes the element from the normal document flow
- The element is positioned relative to its nearest positioned ancestor (an ancestor with `position: relative`, `absolute`, `fixed`, or `sticky`)
- If there's no positioned ancestor, it positions relative to the viewport (browser window)
- The element doesn't take up space in the normal document flow (other elements act like it's not there)

### Real Example from Our Code
```tsx
<div className="video-container" style={{ position: 'relative' }}>
  <iframe
    ref={videoRef}
    width="560"
    height="315"
  />
  <TimeSelectionOverlay />
</div>
```

In this code:
1. The `video-container` div has `position: relative`
2. This creates a positioning context for any absolutely positioned children
3. The `TimeSelectionOverlay` component can be absolutely positioned relative to this container

### Simple Analogy
- Think of `position: relative` like setting up a coordinate system on a piece of paper
- `position: absolute` is like placing a sticker on that paper - the sticker's position is measured from the edges of the paper (the relative container)

### Common Use Cases
- `position: relative` is often used to:
  - Create a positioning context for absolute elements
  - Make small adjustments to an element's position
  - Keep the element in the normal document flow

- `position: absolute` is often used for:
  - Overlays (like our `TimeSelectionOverlay`)
  - Tooltips
  - Dropdown menus
  - Any element that needs to be positioned precisely without affecting other elements

### Key Points to Remember
1. `position: relative` keeps the element in the normal flow and creates a positioning context
2. `position: absolute` takes the element out of the normal flow and positions it relative to its nearest positioned ancestor
3. Always make sure an absolutely positioned element has a positioned ancestor, or it will position relative to the viewport

### Recent Changes (2024-03-26)

1. **Component Restructuring**
   - Split video player functionality into separate components
   - Created `VideoPlayer` component for YouTube player integration
   - Created `TimeSelectionOverlay` component for time selection UI
   - Improved code organization and separation of concerns

2. **VideoPlayer Component**
   - Implements YouTube Player API integration
   - Handles video loading and initialization
   - Manages player state and events
   - Exposes seekTo functionality to parent
   - Properly positions TimeSelectionOverlay

3. **TimeSelectionOverlay Component**
   - Implements draggable time selection interface
   - Shows time tooltips for start and end times
   - Visual feedback for selected range
   - Prevents invalid time ranges (start > end)
   - Smooth drag interaction with mouse events

4. **VideoNotes Component Updates**
   - Now uses VideoPlayer component instead of iframe
   - Manages video duration state
   - Handles time change callbacks
   - Improved state management with useCallback
   - Better TypeScript type safety

5. **Technical Improvements**
   - Added proper TypeScript types for YouTube API
   - Implemented proper cleanup in useEffect hooks
   - Added error handling for player initialization
   - Improved component communication with callbacks
   - Better state management patterns

6. **UI/UX Enhancements**
   - Time selection overlay positioned above video controls
   - Visual feedback during dragging
   - Time tooltips showing current position
   - Smooth animations for handle movement
   - Clear visual indication of selected range

7. **Next Steps**
   - Add keyboard controls for precise time selection
   - Implement time range validation
   - Add visual feedback for current playback position
   - Consider adding more player controls
   - Improve error handling and loading states

### Recent Learnings and Best Practices (2024-03-26)

1. **State Management Patterns**
   - Use refs to track previous values when comparing state changes
   - Implement early returns for better code clarity
   - Keep state updates predictable and immutable
   - Use TypeScript for better type safety

2. **Component Communication**
   - Pass callbacks down to child components
   - Use props for data flow
   - Keep state as high as needed in the component tree
   - Implement proper cleanup in useEffect hooks

3. **Performance Considerations**
   - Avoid unnecessary re-renders
   - Use refs for values that shouldn't trigger re-renders
   - Implement proper cleanup for event listeners
   - Consider using useCallback for stable function references

4. **TypeScript Best Practices**
   - Use interfaces for component props
   - Leverage type inference where possible
   - Add proper type guards for runtime safety
   - Use generics for reusable components

5. **Code Organization**
   - Split components by responsibility
   - Keep components focused and small
   - Use proper file structure
   - Implement proper error handling

6. **UI/UX Patterns**
   - Provide visual feedback for user actions
   - Implement smooth animations
   - Handle edge cases gracefully
   - Consider accessibility

7. **Testing Considerations**
   - Write testable components
   - Use proper dependency injection
   - Consider edge cases
   - Implement proper error boundaries

8. **Documentation**
   - Keep code self-documenting
   - Add comments for complex logic
   - Document component props
   - Keep README up to date

9. **Development Workflow**
   - Use proper version control
   - Implement proper error handling
   - Keep dependencies up to date
   - Follow consistent coding style

10. **Future Improvements**
    - Add keyboard controls
    - Implement time range validation
    - Add visual feedback for playback
    - Consider adding more player controls
    - Improve error handling
    - Add loading states
    - Consider adding tests
    - Implement proper accessibility