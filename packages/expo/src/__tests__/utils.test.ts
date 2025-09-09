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

import { isValidUrl, extractDomain, createDeepLink, validateExpoConfig } from '../utils';

describe('Utility Functions', () => {
  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('myapp://auth')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });

  describe('extractDomain', () => {
    it('should extract domain from URL', () => {
      expect(extractDomain('https://example.com/path')).toBe('example.com');
      expect(extractDomain('http://localhost:3000')).toBe('localhost');
    });

    it('should return empty string for invalid URLs', () => {
      expect(extractDomain('not-a-url')).toBe('');
    });
  });

  describe('createDeepLink', () => {
    it('should create deep link with path', () => {
      expect(createDeepLink('myapp', 'auth')).toBe('myapp://auth');
    });

    it('should create deep link without path', () => {
      expect(createDeepLink('myapp')).toBe('myapp://');
    });
  });

  describe('validateExpoConfig', () => {
    it('should return no errors for valid config', () => {
      const config = {
        clientID: 'test-client',
        serverOrigin: 'https://api.asgardeo.io/t/test',
        redirectURI: 'myapp://auth',
      };
      expect(validateExpoConfig(config)).toEqual([]);
    });

    it('should return errors for missing required fields', () => {
      const config = {};
      const errors = validateExpoConfig(config);
      expect(errors).toContain('clientID is required');
      expect(errors).toContain('serverOrigin is required');
      expect(errors).toContain('redirectURI is required');
    });

    it('should return errors for invalid URLs', () => {
      const config = {
        clientID: 'test-client',
        serverOrigin: 'invalid-url',
        redirectURI: 'invalid-url',
      };
      const errors = validateExpoConfig(config);
      expect(errors).toContain('serverOrigin must be a valid URL');
      expect(errors).toContain('redirectURI must be a valid URL');
    });
  });
});
