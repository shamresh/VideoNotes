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