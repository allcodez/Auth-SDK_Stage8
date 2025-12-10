# ⚠️ Error Codes

SwiftAuth SDK maps raw Firebase errors into user-friendly, consistent error codes. You can access these via the `error.code` property from the `useAuth()` hook.

This abstraction allows you to display clean messages to your users without exposing raw technical details.

## Common Error Codes

| SDK Error Code | Meaning | Default User Message |
| :--- | :--- | :--- |
| `auth/invalid-credentials` | The email or password entered is incorrect. | "Invalid email or password." |
| `auth/user-not-found` | No user account exists for the provided email. | "Invalid email or password." (Obscured for security) |
| `auth/email-already-in-use` | A user tried to sign up with an email that is already registered. | "This email is already registered." |
| `auth/weak-password` | The password provided does not meet Firebase's security requirements (usually < 6 chars). | "Password is too weak." |
| `auth/network-request-failed` | The device has no internet connection or cannot reach Firebase. | "Network error. Please check your connection." |
| `auth/invalid-email` | The email format is invalid (e.g., missing '@'). | "Invalid email address." |
| `auth/configuration-error` | Missing API Keys or configuration in `AuthProvider`. | "Authentication is not configured correctly." |
| `auth/unknown` | Any other unmapped error from Firebase. | (Returns the raw Firebase error message) |

## Handling Errors in Code

You can use the `error` object from the hook to display custom UI logic based on the specific code.

```tsx
const { error } = useAuth();

if (error) {
  if (error.code === 'auth/network-request-failed') {
    return <OfflineBanner />;
  }
  
  return <Text style={{ color: 'red' }}>{error.message}</Text>;
}
```