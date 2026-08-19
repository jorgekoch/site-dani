import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;
    font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #070707;
    color: #f5f5f2;
    font-synthesis: none;
    text-rendering: optimizeLegibility;
  }

  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; background: #070707; }
  body { margin: 0; min-width: 320px; background: #070707; }
  button, a, input, textarea { font: inherit; }
  button, a { -webkit-tap-highlight-color: transparent; }
  a { color: inherit; text-decoration: none; }
  img { display: block; max-width: 100%; }
  ::selection { background: #f5f5f2; color: #070707; }
`
