interface ImportMetaEnv {
  readonly VITE_CLARITY_ENABLE: boolean
  readonly VITE_CLARITY_PROJECT_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}