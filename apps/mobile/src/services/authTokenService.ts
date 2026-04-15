/**
 * authTokenService — stores and retrieves the JWT in SecureStore.
 *
 * The token is a signed JWT returned by the API after successful
 * Apple Sign-In.  It contains the internal user UUID as `sub` and
 * expires in 30 days.
 */

import * as SecureStore from 'expo-secure-store'

const TOKEN_KEY = 'fittrack_auth_token'

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY)
}

export async function setToken(token: string): Promise<void> {
  return SecureStore.setItemAsync(TOKEN_KEY, token)
}

export async function clearToken(): Promise<void> {
  return SecureStore.deleteItemAsync(TOKEN_KEY)
}
