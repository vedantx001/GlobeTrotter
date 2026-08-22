import crypto from 'crypto';

/**
 * Generates a secure, random token for sharing trips.
 * Uses Node's built-in crypto module.
 * @returns {string} The generated share token.
 */
export const generateShareToken = () => {
  return crypto.randomBytes(16).toString('hex');
};
