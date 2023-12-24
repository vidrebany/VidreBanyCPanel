/// <reference types="vite/client" />
/// <reference types="redux-persist" />

// define env types
interface ImportMetaEnv {
  readonly VITE_API_ENDPOINT: string;

  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
