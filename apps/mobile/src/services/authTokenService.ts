/**
 * authTokenService — stores and retrieves the JWT in SecureStore.
 *
 * The token is a signed JWT returned by the API after successful
 * Apple Sign-In.  It contains the internal user UUID as `sub` and
 * expires in 30 days.
 */

import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'tanren_auth_token'
const LEGACY_KEY = 'fittrack_auth_token'

// One-time migration: move token from the old key to the new one
async function migrateLegacyToken(): Promise<void> {
  const legacy = await SecureStore.getItemAsync(LEGACY_KEY)
  if (legacy) {
    await SecureStore.setItemAsync(TOKEN_KEY, legacy)
    await SecureStore.deleteItemAsync(LEGACY_KEY)
  }
}

export async function getToken(): Promise<string | null> {
  await migrateLegacyToken()
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function setToken(token: string): Promise<void> {
  return SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function clearToken(): Promise<void> {
  return SecureStore.deleteItemAsync(TOKEN_KEY)
}
