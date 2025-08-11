import { Tool } from './context';

// Bigger, more visible cursor icons with better contrast
const CURSOR_ICONS = {
  select: `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 3L12 12L9 21L12 18L21 9L12 12Z" fill="white" stroke="black" stroke-width="2"/></svg>')}`,

  brush: `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="6" fill="white" stroke="black" stroke-width="2"/><circle cx="12" cy="12" r="3" fill="black"/></svg>')}`,

  rectangle: `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="6" width="16" height="12" fill="none" stroke="white" stroke-width="3"/><rect x="4" y="6" width="16" height="12" fill="none" stroke="black" stroke-width="1"/><circle cx="12" cy="12" r="2" fill="white" stroke="black" stroke-width="1"/></svg>')}`,

  circle: `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="8" fill="none" stroke="white" stroke-width="3"/><circle cx="12" cy="12" r="8" fill="none" stroke="black" stroke-width="1"/><circle cx="12" cy="12" r="2" fill="white" stroke="black" stroke-width="1"/></svg>')}`,

  text: `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M4 6H20M12 6V20M8 20H16" stroke="white" stroke-width="3" fill="none"/><path d="M4 6H20M12 6V20M8 20H16" stroke="black" stroke-width="1" fill="none"/></svg>')}`,

  eraser: `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="12" height="12" fill="pink" stroke="white" stroke-width="2" rx="2"/><rect x="6" y="6" width="12" height="12" fill="none" stroke="black" stroke-width="1" rx="2"/></svg>')}`,

  hand: `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V12M9 6V12M15 6V12M6 9V15C6 18 9 21 12 21C15 21 18 18 18 15V9" stroke="white" stroke-width="3" fill="none"/><path d="M12 4V12M9 6V12M15 6V12M6 9V15C6 18 9 21 12 21C15 21 18 18 18 15V9" stroke="black" stroke-width="1" fill="none"/></svg>')}`,

  image: `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" fill="none" stroke="white" stroke-width="3"/><rect x="3" y="3" width="18" height="18" fill="none" stroke="black" stroke-width="1"/><circle cx="7" cy="7" r="2" fill="white" stroke="black" stroke-width="1"/><path d="M21 15L15 9L3 21" stroke="white" stroke-width="3"/><path d="M21 15L15 9L3 21" stroke="black" stroke-width="1"/></svg>')}`,

  selection: `data:image/svg+xml;charset=utf-8,${encodeURIComponent('<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="6" width="12" height="12" fill="none" stroke="white" stroke-width="3" stroke-dasharray="4 4"/><rect x="6" y="6" width="12" height="12" fill="none" stroke="black" stroke-width="1" stroke-dasharray="4 4"/><circle cx="12" cy="12" r="2" fill="white" stroke="black" stroke-width="1"/></svg>')}`
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

  // Fallback to standard cursors with better differentiation
  switch (tool) {
    case 'hand':
      return 'grab';
    case 'text':
      return 'text';
    case 'brush':
    case 'eraser':
      return 'crosshair';
    case 'rectangle':
    case 'circle':
    case 'selection':
      return 'crosshair';
    case 'image':
      return 'copy';
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
