import { invariant } from "./invariant";

/**
 * PUBLIC_INTERFACE
 * getEnv returns environment configuration for server-side usage.
 */
export function getEnv() {
  const apiBaseUrl = process.env.NOTES_API_BASE_URL;
  const siteUrl = process.env.SITE_URL;
  invariant(apiBaseUrl, "Missing NOTES_API_BASE_URL env var.");
  invariant(siteUrl, "Missing SITE_URL env var.");
  return {
    NOTES_API_BASE_URL: apiBaseUrl,
    SITE_URL: siteUrl,
  };
}

/**
 * Expose non-sensitive env to client via window.ENV
 */
export function getPublicEnv() {
  const { NOTES_API_BASE_URL, SITE_URL } = getEnv();
  // You may choose to not expose NOTES_API_BASE_URL if it's same-origin via proxy;
  // keeping it here to allow direct calls for this exercise.
  return {
    NOTES_API_BASE_URL,
    SITE_URL,
  };
}
