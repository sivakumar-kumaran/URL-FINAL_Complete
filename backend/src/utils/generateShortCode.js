import { customAlphabet } from 'nanoid';

// Using a custom alphabet to avoid lookalike characters (like l, 1, I, o, 0, O) is optional,
// but standard alphanumeric gives a large space. Let's use 7 characters.
const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const nanoid = customAlphabet(alphabet, 7);

export const generateShortCode = () => {
  return nanoid();
};

export default generateShortCode;
