interface ImportMeta {
  readonly env: {
    [key: string]: string | undefined;
    NODE_ENV: 'development' | 'production' | 'test';
    VITE_API_URL: string;
    // Add other environment variables here
  };
}
