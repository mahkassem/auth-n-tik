# Icons

This directory contains all SVG icons converted to React components for the Auth-N-Tik web application.

## Structure

- Each icon is a separate React component with TypeScript support
- All icons accept standard SVG props via the `IconProps` interface
- Icons use `currentColor` for fill/stroke to inherit text color from parent elements
- Default sizes are provided but can be overridden via className prop

## Usage

```tsx
import { MenuIcon, CheckIcon, LockIcon } from "@/components/icons";

// Basic usage
<MenuIcon />

// With custom styling
<CheckIcon className="h-8 w-8 text-green-600" />

// With additional props
<LockIcon className="h-6 w-6" onClick={handleClick} />
```

## Available Icons

### Navigation Icons

- `MenuIcon` - Hamburger menu icon (3 horizontal lines)
- `CloseIcon` - X close icon

### Status Icons

- `CheckIcon` - Simple checkmark
- `CheckCircleIcon` - Checkmark in circle

### Feature Icons

- `LockIcon` - Lock/security icon
- `BoltIcon` - Lightning bolt/speed icon

### Brand Icons

- `NextIcon` - Next.js logo
- `VercelIcon` - Vercel logo

### File/UI Icons

- `FileIcon` - Document/file icon
- `GlobeIcon` - Globe/world icon
- `WindowIcon` - Window/browser icon

## Adding New Icons

1. Create a new component file in this directory
2. Follow the existing pattern with `IconProps` interface
3. Use `currentColor` for colors when possible
4. Add the export to `index.ts`
5. Update this README

## Migration from Inline SVGs

All inline SVGs have been refactored to use these components for:

- Better maintainability
- Consistent styling
- TypeScript support
- Reusability across the application
