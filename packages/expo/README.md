# @asgardeo/expo

![Built With](https://img.shields.io/badge/built%20with-TypeScript-blue)
![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)
![npm](https://img.shields.io/npm/v/@asgardeo/expo)

Asgardeo Expo SDK for React Native applications built with Expo. This SDK provides a simple and secure way to integrate Asgardeo authentication into your Expo applications without requiring any native code.

## Features

- 🔐 **OAuth 2.0 / OIDC Authentication** - Secure authentication using industry standards
- 📱 **Expo Compatible** - No native code required, works with Expo managed workflow
- 🔒 **PKCE Support** - Enhanced security with Proof Key for Code Exchange
- 💾 **Secure Token Storage** - Uses Expo SecureStore for token persistence
- ⚛️ **React Context API** - Easy state management with React hooks
- 🎨 **Pre-built Components** - Sign-in and sign-out buttons ready to use
- 🛡️ **Auth Guards** - Protect routes based on authentication state
- 🔄 **Token Refresh** - Automatic token refresh handling
- 📱 **Deep Linking** - Handle authentication callbacks seamlessly
- 📷 **QR Code Scanner** - Built-in QR code scanning for mobile authentication flows

## Installation

```bash
npm install @asgardeo/expo
```

### Peer Dependencies

Make sure you have the following peer dependencies installed:

```bash
expo install expo-auth-session expo-crypto expo-linking expo-secure-store expo-web-browser
```

## Quick Start

### 1. Configure your Asgardeo Application

1. Sign in to [Asgardeo Console](https://console.asgardeo.io/)
2. Create a new Single Page Application
3. Add your Expo app's redirect URI (e.g., `myapp://auth`)
4. Note down your Client ID and Server Origin

### 2. Setup your Expo app

```tsx
import React from 'react';
import {AsgardeoProvider} from '@asgardeo/expo';
import App from './App';

const config = {
  clientID: 'your-client-id',
  serverOrigin: 'https://api.asgardeo.io/t/yourorg',
  redirectURI: 'myapp://auth',
  postLogoutRedirectURI: 'myapp://logout',
  scope: ['openid', 'profile', 'email'],
};

export default function Root() {
  return (
    <AsgardeoProvider config={config}>
      <App />
    </AsgardeoProvider>
  );
}
```

### 3. Use Authentication in your components

```tsx
import React from 'react';
import {View, Text} from 'react-native';
import {useAsgardeo, SignInButton, SignOutButton, AuthGuard} from '@asgardeo/expo';

function App() {
  const {state} = useAsgardeo();

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <AuthGuard
        loading={<Text>Loading...</Text>}
        fallback={
          <View>
            <Text>Please sign in</Text>
            <SignInButton />
          </View>
        }
      >
        <View>
          <Text>Welcome, {state.user?.email}!</Text>
          <SignOutButton />
        </View>
      </AuthGuard>
    </View>
  );
}

export default App;
```

## API Reference

### Components

#### `AsgardeoProvider`

The main provider component that wraps your app and provides authentication context.

```tsx
<AsgardeoProvider
  config={config}
  fallback={<LoadingComponent />}
>
  {children}
</AsgardeoProvider>
```

#### `SignInButton`

Pre-built sign-in button component.

```tsx
<SignInButton
  title="Sign In"
  style={customStyles}
  onSignInSuccess={() => console.log('Signed in')}
  onSignInError={(error) => console.error(error)}
/>
```

#### `SignOutButton`

Pre-built sign-out button component.

```tsx
<SignOutButton
  title="Sign Out"
  style={customStyles}
  onSignOutSuccess={() => console.log('Signed out')}
/>
```

#### `AuthGuard`

Component to conditionally render content based on authentication state.

```tsx
<AuthGuard
  loading={<LoadingSpinner />}
  fallback={<LoginScreen />}
>
  <ProtectedContent />
</AuthGuard>
```

#### `QRScannerComponent`

Component for scanning QR codes using the device camera. Perfect for authentication flows that involve QR code scanning.

**Usage**:
```tsx
import { scanQRCode, QRScanResult, QRScanError } from '@asgardeo/expo';
import { Camera } from 'expo-camera';

const MyScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    console.log(`Bar code with type ${type} and data ${data} has been scanned!`);
    // Handle the scanned QR code data
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={StyleSheet.absoluteFillObject}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [Camera.Constants.BarCodeType.qr],
        }}
      />
      {scanned && (
        <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};
```

### Utilities

#### `scanQRCode`

A utility function for programmatic QR code scanning with configuration options. This function provides the core scanning logic and should be implemented within a React component using expo-camera.

```tsx
import { scanQRCode, QRScanError } from '@asgardeo/expo';

// Note: This utility provides the scanning logic structure
// but must be implemented within a React component using Camera component
try {
  const result = await scanQRCode({
    promptMessage: "Scan the authentication QR code",
    timeout: 30000,
    enableTorch: false
  });
  
  console.log('Scanned data:', result.data);
} catch (error) {
  if (error.code === QRScanError.PERMISSION_DENIED) {
    console.error('Camera permission denied');
  }
}
```

#### Other QR Utilities

The QR scanning interfaces and error types are available in the models:

```tsx
import { 
  QRScanResult, 
  QRScannerConfig, 
  QRScanError, 
  QRScannerError 
} from '@asgardeo/expo';
```

### Hooks

#### `useAsgardeo`

Main hook to access authentication state and methods.

```tsx
const {
  state,           // Current auth state
  signIn,          // Function to initiate sign in
  signOut,         // Function to sign out
  refreshToken,    // Function to refresh token
  getUserInfo,     // Function to get user info
  httpRequest,     // Function to make authenticated requests
} = useAsgardeo();
```

### Configuration

```typescript
interface AsgardeoExpoConfig {
  clientID: string;                    // Your app's client ID
  serverOrigin: string;                // Asgardeo server URL
  redirectURI: string;                 // Redirect URI for auth callback
  postLogoutRedirectURI?: string;      // Redirect URI after logout
  scope?: string[];                    // OAuth scopes
  additionalParams?: Record<string, string>; // Additional OAuth params
}
```

## Deep Linking Setup

### 1. Configure app.json

```json
{
  "expo": {
    "scheme": "myapp",
    "name": "My App"
  }
}
```

### 2. Handle incoming links

The SDK automatically handles authentication callbacks, but you can also listen for other deep links:

```tsx
import * as Linking from 'expo-linking';

useEffect(() => {
  const handleUrl = (url: string) => {
    // Handle custom deep links
  };

  const subscription = Linking.addEventListener('url', (event) => {
    handleUrl(event.url);
  });

  return () => subscription?.remove();
}, []);
```

## Error Handling

```tsx
const {state, signIn} = useAsgardeo();

const handleSignIn = async () => {
  try {
    await signIn();
  } catch (error) {
    if (error.message.includes('cancelled')) {
      // User cancelled the authentication
    } else {
      // Other authentication errors
      console.error('Authentication failed:', error);
    }
  }
};

// Check for errors in state
if (state.error) {
  console.error('Auth error:', state.error);
}
```

## Advanced Usage

### Making Authenticated API Calls

```tsx
const {httpRequest} = useAsgardeo();

const fetchProtectedData = async () => {
  try {
    const response = await httpRequest({
      url: 'https://api.example.com/protected',
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('API call failed:', error);
  }
};
```

### Custom Loading States

```tsx
function CustomLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" />
      <Text>Authenticating...</Text>
    </View>
  );
}

<AsgardeoProvider config={config} fallback={<CustomLoadingScreen />}>
  <App />
</AsgardeoProvider>
```

## Troubleshooting

### Common Issues

1. **"Network request failed"**
   - Check your internet connection
   - Verify the serverOrigin URL is correct
   - Ensure your app can access external URLs

2. **"Invalid redirect URI"**
   - Make sure the redirectURI in your config matches the one configured in Asgardeo Console
   - Verify your app's scheme is properly configured

3. **"Authentication cancelled"**
   - This happens when users close the browser before completing authentication
   - Handle this gracefully in your error handlers

### Debug Mode

Enable debugging by setting up a development build:

```bash
expo install expo-dev-client
expo run:ios # or expo run:android
```

## Testing

This package uses Jest with React Native Testing Library for testing. The testing setup is optimized for Expo applications.

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Test Structure

Tests are located in the `src/__tests__/` directory and follow the naming convention `*.test.ts` or `*.spec.ts`.

### Available Test Scripts

- `test` - Run all tests once
- `test:watch` - Run tests in watch mode for development
- `test:coverage` - Run tests and generate coverage report

### Testing Components

When testing components that use Asgardeo hooks, wrap them with the `AsgardeoProvider`:

```tsx
import {render} from '@testing-library/react-native';
import {AsgardeoProvider} from '@asgardeo/expo';
import YourComponent from './YourComponent';

const config = {
  clientID: 'test-client-id',
  serverOrigin: 'https://test.asgardeo.io',
  redirectURI: 'testapp://auth',
};

test('renders component correctly', () => {
  render(
    <AsgardeoProvider config={config}>
      <YourComponent />
    </AsgardeoProvider>
  );
});
```

## Examples

Check out our example apps:

- [Basic Authentication Example](examples/basic-auth)
- [Protected Routes Example](examples/protected-routes)
- [Custom UI Example](examples/custom-ui)

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

This project is licensed under the Apache 2.0 License - see the [LICENSE](LICENSE) file for details.

## Support

- 📖 [Documentation](https://wso2.com/asgardeo/docs/)
- 💬 [Discord Community](https://discord.gg/wso2)
- 🐛 [Issue Tracker](https://github.com/asgardeo/javascript/issues)
- 📧 [Contact Support](mailto:asgardeo-help@wso2.com)
