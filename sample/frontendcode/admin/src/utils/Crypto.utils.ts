export const stringToBuffer = (str: string): Uint8Array => {
    return new TextEncoder().encode(str);
  };
  
  export const bufferToString = (buffer: ArrayBuffer): string => {
    return new TextDecoder().decode(buffer);
  };
  
  export const hexToBuffer = (hex: string): Uint8Array => {
    const pairs = hex.match(/[\dA-F]{2}/gi) || [];
    return new Uint8Array(pairs.map(s => parseInt(s, 16)));
  };
  
  export const bufferToHex = (buffer: ArrayBuffer): string => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  };