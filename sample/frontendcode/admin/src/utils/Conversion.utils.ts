import { KEY_CONFIG } from "../config/Key.config";
import {
  bufferToHex,
  bufferToString,
  hexToBuffer,
  stringToBuffer,
} from "./Crypto.utils";

const secretKey = KEY_CONFIG.SECRET_KEY;
const SALT = KEY_CONFIG.SALT;
const fixedIv = hexToBuffer(KEY_CONFIG.FIXED_IV);

async function getKey(): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    stringToBuffer(secretKey),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: stringToBuffer(SALT),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptAES(value: any): Promise<string> {
  try {
    const key = await getKey();
    const stringValue =
      typeof value === "object" ? JSON.stringify(value) : value.toString();
    const data = stringToBuffer(stringValue);

    const encrypted = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: fixedIv,
      },
      key,
      data
    );

    return bufferToHex(encrypted);
  } catch (error) {
    console.error("Encryption error:", error);
    throw new Error("Encryption failed");
  }
}

async function decryptAES(value: string): Promise<any> {
  try {
    console.log("decrypt value - ", value);
    const key = await getKey();
    const encryptedData = hexToBuffer(value);

    const decrypted = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: fixedIv,
      },
      key,
      encryptedData
    );

    const decryptedText = bufferToString(decrypted);
    try {
      return JSON.parse(decryptedText);
    } catch {
      return decryptedText;
    }
  } catch (error) {
    console.error("Decryption error:", error);
    throw new Error("Decryption failed");
  }
}

function encodeBase64(value: string): string {
  return btoa(value);
}

function decodeBase64(value: string): string {
  return atob(value);
}

export async function convertor(
  format: "aes" | "base64",
  eventType: "encrypt" | "decrypt",
  value: any
): Promise<any> {
  if (format === "aes") {
    return eventType === "encrypt" ? encryptAES(value) : decryptAES(value);
  } else {
    return eventType === "encrypt" ? encodeBase64(value) : decodeBase64(value);
  }
}

export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat("en-US").format(number);
};
