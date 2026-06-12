import { useState, useEffect } from 'react'
import { auth, signInWithGoogle, signOutUser } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export function useAuth() {
  const [user, setUser] = useState(undefined) // undefined = loading, null = signed out

  useEffect(() => {
    return onAuthStateChanged(auth, setUser)
  }, [])

  const getToken = async () => {
    if (!user) return null
    return user.getIdToken()
  }

  return { user, signIn: signInWithGoogle, signOut: signOutUser, getToken }
}
