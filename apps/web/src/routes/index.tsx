import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#08090d', color: '#fff', display: 'grid', placeItems: 'center', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <section style={{ textAlign: 'center', padding: 32 }}>
        <p style={{ color: '#f5c542', letterSpacing: '.14em', fontSize: 12, fontWeight: 800 }}>CLIPORA</p>
        <h1 style={{ fontSize: 42, margin: '8px 0' }}>Video creation tools</h1>
        <p style={{ color: '#9298a8' }}>Create animated, editable Nenglish captions for your videos.</p>
        <Link to="/caption-generator" style={{ display: 'inline-flex', marginTop: 20, padding: '12px 18px', borderRadius: 10, background: '#f5c542', color: '#111', fontWeight: 800, textDecoration: 'none' }}>
          Open Caption Generator →
        </Link>
      </section>
    </main>
  )
}
