import { TOKEN_STORAGE_KEY } from "../constants";

export const saveToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (e) {}
};

export const readToken = (): string | null => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    return token;
  } catch (e) {
    return null;
  }
};

export const clearToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (e) {}
};
