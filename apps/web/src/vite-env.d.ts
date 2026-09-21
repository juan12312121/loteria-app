/// <reference types="vite/client" />

declare module '*.module.css' {
  const clases: Record<string, string>;
  export default clases;
}
