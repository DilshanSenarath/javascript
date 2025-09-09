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
 * QR Code Scanner Result interface.
 */
export interface QRScanResult {
  /**
   * The scanned QR code data as a string.
   */
  data: string;
  /**
   * The type of barcode/QR code scanned.
   */
  type: string;
  /**
   * Timestamp when the QR code was scanned.
   */
  timestamp: number;
}

/**
 * QR Scanner Configuration options.
 */
export interface QRScannerConfig {
  /**
   * Whether to enable torch/flashlight.
   * @default false
   */
  enableTorch?: boolean;
  /**
   * Timeout for scanning in milliseconds.
   * @default 30000 (30 seconds)
   */
  timeout?: number;
  /**
   * Custom prompt message to show to the user.
   * @default "Scan a QR code"
   */
  promptMessage?: string;
}

/**
 * Error types that can occur during QR scanning.
 */
export enum QRScanError {
  PERMISSION_DENIED = "PERMISSION_DENIED",
  CAMERA_UNAVAILABLE = "CAMERA_UNAVAILABLE",
  SCAN_TIMEOUT = "SCAN_TIMEOUT",
  USER_CANCELLED = "USER_CANCELLED",
  UNKNOWN_ERROR = "UNKNOWN_ERROR"
}

/**
 * Custom error class for QR scanning errors.
 */
export class QRScannerError extends Error {
  public readonly code: QRScanError;

  constructor(code: QRScanError, message: string) {
    super(message);
    this.code = code;
    this.name = "QRScannerError";
  }
}
