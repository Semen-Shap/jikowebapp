/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
        REACT_APP_TOKEN: string;
        REACT_APP_URL_FRONTEND: string;
        REACT_APP_URL_BACKEND: string;
    }
  }