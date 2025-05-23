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