// Code saved so that I don't forget how to do Google OAuth with next-auth - don't think I need this endpoint tbh

'use client'

import { signIn, signOut, useSession } from "next-auth/react"

export default function AuthTest() {
  const { data: session } = useSession()

  return (
    <div>
      {!session ? (
        <button onClick={() => signIn("google")}>Sign in with Google</button>
      ) : (
        <>
          <h2>Welcome, {session.user?.name}</h2>
          <pre>{JSON.stringify(session, null, 2)}</pre>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      )}
    </div>
  )
}