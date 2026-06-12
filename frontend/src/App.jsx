import { useState } from 'react'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import ImprovementPlan from './pages/ImprovementPlan'
import LoadingScreen from './components/LoadingScreen'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const [view, setView] = useState('home')
  const [auditData, setAuditData] = useState(null)
  const [businessName, setBusinessName] = useState('this business')
  const [currentUrl, setCurrentUrl] = useState('')
  const [error, setError] = useState(null)
  const { user, signIn, signOut, getToken } = useAuth()

  const handleSubmit = async ({ url, businessName: name }) => {
    setView('loading')
    setCurrentUrl(url)
    setError(null)
    setBusinessName(name || 'this business')

    try {
      const token = await getToken()
      const headers = { 'Content-Type': 'application/json' }
      if (token) headers['Authorization'] = `Bearer ${token}`

      const response = await fetch('/api/audit', {
        method: 'POST',
        headers,
        body: JSON.stringify({ url, business_name: name }),
      })

      const json = await response.json()
      if (!response.ok) throw new Error(json.detail || 'Audit failed. Please try again.')

      setAuditData(json.data)
      setView('results')
    } catch (err) {
      setError(err.message)
      setView('home')
    }
  }

  const handleReset = () => {
    setView('home')
    setAuditData(null)
    setError(null)
  }

  const handleViewAudit = (auditData) => {
    setAuditData(auditData)
    setBusinessName(auditData.business_name || 'this business')
    setView('results')
  }

  if (view === 'loading') return <LoadingScreen url={currentUrl} />
  if (view === 'plan') return (
    <ImprovementPlan data={auditData} businessName={businessName} onBack={() => setView('results')} />
  )
  if (view === 'results') return (
    <ResultsPage data={auditData} businessName={businessName} onReset={handleReset} onViewPlan={() => setView('plan')} />
  )
  return (
    <HomePage
      onSubmit={handleSubmit}
      error={error}
      user={user}
      onSignIn={signIn}
      onSignOut={signOut}
      getToken={getToken}
      onViewAudit={handleViewAudit}
    />
  )
}
