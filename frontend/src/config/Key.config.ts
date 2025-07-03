export const KEY_CONFIG = {
    SECRET_KEY: import.meta.env.VITE_SECRET_KEY,
    FIXED_IV: import.meta.env.VITE_FIXED_IV,
    SALT: import.meta.env.VITE_CRYPT_SALT,
    FUSIONCHARTS_LICENSE_KEY: import.meta.env.VITE_FUSIONCHARTS_LICENSE_KEY

} as const;