/**
 * Copyright (c) 2025, WSO2 LLC. (https://www.wso2.com).
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
 * Utility functions for the Asgardeo Expo SDK
 */

/**
 * Validates if a URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Extracts domain from URL
 */
export const extractDomain = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return '';
  }
};

/**
 * Creates a deep link URL for Expo apps
 */
export const createDeepLink = (scheme: string, path?: string): string => {
  return path ? `${scheme}://${path}` : `${scheme}://`;
};

/**
 * Validates Expo configuration
 */
export const validateExpoConfig = (config: any): string[] => {
  const errors: string[] = [];

  if (!config.clientID) {
    errors.push('clientID is required');
  }

  if (!config.serverOrigin) {
    errors.push('serverOrigin is required');
  } else if (!isValidUrl(config.serverOrigin)) {
    errors.push('serverOrigin must be a valid URL');
  }

  if (!config.redirectURI) {
    errors.push('redirectURI is required');
  } else if (!isValidUrl(config.redirectURI)) {
    errors.push('redirectURI must be a valid URL');
  }

  return errors;
};

// Export QR Scanner utility
export { default as scanQRCode } from './qr-scanner';
