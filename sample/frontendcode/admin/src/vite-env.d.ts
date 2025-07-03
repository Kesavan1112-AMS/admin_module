/// <reference types="vite/client" />


interface ImportMetaEnv {
    readonly VITE_BACKEND_URL: string;
    readonly VITE_USER_KEY: string;
    readonly VITE_SECURITY_KEY: string;
    readonly VITE_SECRET_KEY: string;
    readonly VITE_FIXED_IV: string;
    readonly VITE_CAPTCHA_KEY_LOCAL:string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}