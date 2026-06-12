export default function AuthButton({ user, onSignIn, onSignOut }) {
  if (user === undefined) return null // still loading auth state

  if (!user) {
    return (
      <button onClick={onSignIn} className="wa-btn wa-btn-ghost wa-btn-sm">
        Sign in with Google
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={user.displayName || 'User'}
          style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
        />
      )}
      <span style={{ fontSize: 13, color: 'var(--ink-2)', fontWeight: 600 }}>
        {user.displayName || user.email}
      </span>
      <button onClick={onSignOut} className="wa-btn wa-btn-ghost wa-btn-sm">
        Sign out
      </button>
    </div>
  )
}
