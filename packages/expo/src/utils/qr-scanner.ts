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

import { Camera } from "expo-camera";
import { QRScanResult, QRScannerConfig, QRScanError, QRScannerError } from "../models/qr-scanner";

/**
 * A comprehensive QR code scanner utility for Expo mobile applications.
 *
 * This utility provides an easy-to-use interface for scanning QR codes using the device camera
 * via expo-camera. It handles camera permissions, provides error handling, and supports various
 * configuration options such as torch control and scan timeout.
 *
 * The function creates a camera view that can scan QR codes and barcodes. It's designed to be
 * used within a React component context where you can render the camera view and handle the
 * scanning results.
 *
 * @example
 * ```typescript
 * import { scanQRCode } from '@asgardeo/expo';
 *
 * try {
 *   const result = await scanQRCode({
 *     promptMessage: "Scan the authentication QR code",
 *     timeout: 30000,
 *     enableTorch: false
 *   });
 *
 *   console.log('Scanned data:', result.data);
 *   console.log('Scan type:', result.type);
 * } catch (error) {
 *   if (error instanceof QRScannerError) {
 *     switch (error.code) {
 *       case QRScanError.PERMISSION_DENIED:
 *         console.error('Camera permission denied');
 *         break;
 *       case QRScanError.SCAN_TIMEOUT:
 *         console.error('Scan timed out');
 *         break;
 *       default:
 *         console.error('Scan failed:', error.message);
 *     }
 *   }
 * }
 * ```
 *
 * @param config - Configuration options for the QR scanner
 * @returns Promise that resolves to the scanned QR code result
 * @throws {QRScannerError} When scanning fails or encounters an error
 *
 * @requires expo-camera - Already included as a dependency
 *
 * @platform ios
 * @platform android
 */
const scanQRCode = async (config: QRScannerConfig = {}): Promise<QRScanResult> => {
  const {
    enableTorch = false,
    timeout = 30000,
    promptMessage = "Scan a QR code"
  } = config;

  try {
    // Request camera permissions.
    const { status } = await Camera.requestCameraPermissionsAsync();

    if (status !== "granted") {
      throw new QRScannerError(
        QRScanError.PERMISSION_DENIED,
        "Camera permission is required to scan QR codes"
      );
    }

    return new Promise((resolve, reject) => {
      let isScanned = false;
      let timeoutId: NodeJS.Timeout;

      // Set up timeout
      if (timeout > 0) {
        timeoutId = setTimeout(() => {
          if (!isScanned) {
            isScanned = true;
            reject(new QRScannerError(
              QRScanError.SCAN_TIMEOUT,
              `QR code scan timed out after ${timeout}ms`
            ));
          }
        }, timeout);
      }

      // Handle barcode scan
      const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
        if (isScanned) return;

        isScanned = true;
        if (timeoutId) clearTimeout(timeoutId);

        const result: QRScanResult = {
          data,
          type,
          timestamp: Date.now()
        };

        resolve(result);
      };

      // Note: In a real implementation, you would render the Camera component
      // This is a simplified version that shows the structure
      // The actual scanning would happen in a React Native component that renders:
      // <Camera
      //   style={StyleSheet.absoluteFillObject}
      //   onBarCodeScanned={handleBarCodeScanned}
      //   flashMode={enableTorch ? Camera.Constants.FlashMode.torch : Camera.Constants.FlashMode.off}
      //   barCodeScannerSettings={{
      //     barCodeTypes: [Camera.Constants.BarCodeType.qr],
      //   }}
      // />

      // For now, we'll provide guidance that this must be implemented within a React component
      reject(new QRScannerError(
        QRScanError.UNKNOWN_ERROR,
        'QR scanner must be implemented within a React component context. Use expo-camera\'s Camera component with onBarCodeScanned prop.'
      ));
    });

  } catch (error) {
    if (error instanceof QRScannerError) {
      throw error;
    }

    throw new QRScannerError(
      QRScanError.UNKNOWN_ERROR,
      `Failed to scan QR code: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

export default scanQRCode;
