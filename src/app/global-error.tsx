'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'

// global-error.tsx replaces the root layout entirely when an error escapes it
// (e.g. a crash inside layout.tsx itself), so it must render its own <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body>
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            padding: '2rem',
            textAlign: 'center',
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <h1 style={{ fontSize: '2rem', margin: 0 }}>Something went wrong</h1>
          <p style={{ color: '#666' }}>
            A critical error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: '0.5rem 1.5rem',
              borderRadius: '0.375rem',
              border: 'none',
              background: '#000',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
