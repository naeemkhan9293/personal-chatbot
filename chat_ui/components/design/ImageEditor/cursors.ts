import { Tool } from './context';

// SVG cursor icons as data URLs
const CURSOR_ICONS = {
  select: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3L10.5 10.5M10.5 10.5L8 21L10.5 18.5L21 8L10.5 10.5Z" stroke="white" stroke-width="2" fill="black"/>
    </svg>
  `)}`,
  
  brush: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.37 2.63L21.37 5.63C21.76 6.02 21.76 6.65 21.37 7.04L19.04 9.37L14.63 4.96L16.96 2.63C17.35 2.24 17.98 2.24 18.37 2.63Z" fill="white" stroke="black" stroke-width="1"/>
      <path d="M14.63 4.96L19.04 9.37L9.37 19.04C9.18 19.23 8.93 19.34 8.67 19.34H5.34C4.6 19.34 4 18.74 4 18V14.67C4 14.41 4.11 14.16 4.3 13.97L14.63 4.96Z" fill="white" stroke="black" stroke-width="1"/>
    </svg>
  `)}`,
  
  rectangle: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="12" stroke="white" stroke-width="2" fill="none"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  `)}`,
  
  circle: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="9" r="6" stroke="white" stroke-width="2" fill="none"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  `)}`,
  
  text: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 7V4H20V7" stroke="white" stroke-width="2"/>
      <path d="M9 20H15" stroke="white" stroke-width="2"/>
      <path d="M12 4V20" stroke="white" stroke-width="2"/>
    </svg>
  `)}`,
  
  eraser: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 20H8L2.5 14.5C2.11 14.11 2.11 13.48 2.5 13.09L13.09 2.5C13.48 2.11 14.11 2.11 14.5 2.5L21.5 9.5C21.89 9.89 21.89 10.52 21.5 10.91L15 17.41" stroke="white" stroke-width="2" fill="pink" fill-opacity="0.3"/>
    </svg>
  `)}`,
  
  hand: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 11V6C18 4.9 17.1 4 16 4S14 4.9 14 6V11" stroke="white" stroke-width="2" fill="none"/>
      <path d="M14 13V7C14 5.9 13.1 5 12 5S10 5.9 10 7V13" stroke="white" stroke-width="2" fill="none"/>
      <path d="M10 15V9C10 7.9 9.1 7 8 7S6 7.9 6 9V15" stroke="white" stroke-width="2" fill="none"/>
      <path d="M6 15V11C6 9.9 5.1 9 4 9S2 9.9 2 11V15C2 18.31 4.69 21 8 21H16C19.31 21 22 18.31 22 15V13C22 11.9 21.1 11 20 11S18 11.9 18 13V15" stroke="white" stroke-width="2" fill="white" fill-opacity="0.3"/>
    </svg>
  `)}`,
  
  image: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="white" stroke-width="2" fill="none"/>
      <circle cx="8.5" cy="8.5" r="1.5" fill="white"/>
      <path d="M21 15L16 10L5 21" stroke="white" stroke-width="2"/>
    </svg>
  `)}`,
  
  selection: `data:image/svg+xml;base64,${btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 9H15V15H9V9Z" stroke="white" stroke-width="2" stroke-dasharray="3 3" fill="none"/>
      <circle cx="12" cy="12" r="1" fill="white"/>
    </svg>
  `)}`
};

// Generate CSS cursor string with custom icon
export const getToolCursor = (tool: Tool, isPanning: boolean = false): string => {
  if (isPanning) {
    return 'grabbing';
  }

  // For tools with custom icons, use the SVG cursor
  if (CURSOR_ICONS[tool]) {
    return `url("${CURSOR_ICONS[tool]}") 12 12, auto`;
  }

  // Fallback to default cursors
  switch (tool) {
    case 'hand':
      return 'grab';
    case 'text':
      return 'text';
    case 'select':
    default:
      return 'default';
  }
};

// Keyboard shortcuts mapping
export const KEYBOARD_SHORTCUTS: Record<string, Tool> = {
  'KeyA': 'select',      // Ctrl + A
  'KeyB': 'brush',       // Ctrl + B  
  'KeyR': 'rectangle',   // Ctrl + R
  'KeyC': 'circle',      // Ctrl + C
  'KeyT': 'text',        // Ctrl + T
  'KeyE': 'eraser',      // Ctrl + E
  'KeyH': 'hand',        // Ctrl + H
  'KeyI': 'image',       // Ctrl + I
  'KeyS': 'selection',   // Ctrl + S
};

// Get tool name for display in tooltips
export const getToolDisplayName = (tool: Tool): string => {
  const names: Record<Tool, string> = {
    select: 'Select',
    rectangle: 'Rectangle', 
    circle: 'Circle',
    text: 'Text',
    brush: 'Brush',
    eraser: 'Eraser',
    image: 'Image',
    hand: 'Hand',
    selection: 'Selection'
  };
  return names[tool] || tool;
};

// Get keyboard shortcut for tool (for tooltip display)
export const getToolShortcut = (tool: Tool): string => {
  const shortcut = Object.entries(KEYBOARD_SHORTCUTS).find(([_, t]) => t === tool)?.[0];
  if (shortcut) {
    const key = shortcut.replace('Key', '');
    return `Ctrl + ${key}`;
  }
  return '';
};
