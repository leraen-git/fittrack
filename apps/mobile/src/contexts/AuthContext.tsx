import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as AppleAuthentication from 'expo-apple-authentication'
import { getToken, setToken, clearToken } from '@/services/authTokenService'

const API_URL = process.env['EXPO_PUBLIC_API_URL'] ?? 'http://localhost:3000'

export type AuthStatus = 'loading' | 'unauthenticated' | 'authenticated'

interface AuthContextValue {
  status: AuthStatus
  token: string | null
  /** Triggers the native Apple Sign-In sheet and exchanges the token with the API. */
  signInWithApple: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  status: 'loading',
  token: null,
  signInWithApple: async () => {},
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [token, setTokenState] = useState<string | null>(null)

  // On mount: restore token from SecureStore
  useEffect(() => {
    getToken().then((stored) => {
      if (stored) {
        setTokenState(stored)
        setStatus('authenticated')
      } else {
        setStatus('unauthenticated')
      }
    }).catch(() => {
      setStatus('unauthenticated')
    })
  }, [])

  const signInWithApple = useCallback(async () => {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })

    const fullName = [
      credential.fullName?.givenName,
      credential.fullName?.familyName,
    ].filter(Boolean).join(' ') || null

    // Exchange Apple identity token for our own JWT
    const res = await fetch(`${API_URL}/trpc/auth.signInWithApple`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        json: {
          identityToken: credential.identityToken,
          fullName,
          email: credential.email ?? null,
        },
      }),
    })

    if (!res.ok) throw new Error('Sign-in failed')
    const body = await res.json() as { result: { data: { json: { token: string } } } }
    const jwt = body.result.data.json.token

    await setToken(jwt)
    setTokenState(jwt)
    setStatus('authenticated')
  }, [])

  const signOut = useCallback(async () => {
    await clearToken()
    setTokenState(null)
    setStatus('unauthenticated')
  }, [])

  return (
    <AuthContext.Provider value={{ status, token, signInWithApple, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
