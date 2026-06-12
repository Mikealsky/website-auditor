import { useState, useEffect } from 'react'
import MarketingHome from './pages/MarketingHome'
import AuditPage from './pages/AuditPage'
import ResultsPage from './pages/ResultsPage'
import ImprovementPlan from './pages/ImprovementPlan'
import LoadingScreen from './components/LoadingScreen'
import AccountModal from './components/AccountModal'
import { useAuth } from './hooks/useAuth'

export default function App() {
  const [view, setView] = useState('home')
  const [auditData, setAuditData] = useState(null)
  const [businessName, setBusinessName] = useState('')
  const [currentUrl, setCurrentUrl] = useState('')
  const [error, setError] = useState(null)
  const [accountModalOpen, setAccountModalOpen] = useState(false)
  const { user, signIn, signOut, getToken } = useAuth()

  // Once user signs in, close the account modal
  useEffect(() => {
    if (user && accountModalOpen) {
      setAccountModalOpen(false)
    }
  }, [user, accountModalOpen])

  const unlocked = !!user

  const handleSubmit = async ({ url, businessName: name }) => {
    setView('loading')
    setCurrentUrl(url)
    setError(null)
    setBusinessName(name || url)

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
      setView('audit')
    }
  }

  const handleViewExample = (host, name) => {
    handleSubmit({ url: 'https://' + host, businessName: name || host })
  }

  const handleHome = () => {
    setView('home')
    setAuditData(null)
    setError(null)
  }

  const handleReset = () => {
    setView('audit')
    setAuditData(null)
    setError(null)
  }

  const handleViewAudit = (savedAuditData) => {
    setAuditData(savedAuditData)
    setBusinessName(savedAuditData.business_name || savedAuditData.url || '')
    setView('results')
  }

  const handleUnlock = () => setAccountModalOpen(true)

  if (view === 'loading') return <LoadingScreen url={currentUrl} />

  if (view === 'plan') return (
    <ImprovementPlan
      data={auditData}
      businessName={businessName}
      onBack={() => setView('results')}
    />
  )

  if (view === 'results') return (
    <>
      <ResultsPage
        data={auditData}
        businessName={businessName}
        onReset={handleReset}
        onHome={handleHome}
        onViewPlan={() => setView('plan')}
        onUnlock={handleUnlock}
        unlocked={unlocked}
      />
      <AccountModal
        open={accountModalOpen}
        onClose={() => setAccountModalOpen(false)}
        onSignIn={signIn}
        business={businessName}
        fixCount={auditData
          ? ((auditData.ai_report?.recommendations?.length > 0)
              ? auditData.ai_report.recommendations.length
              : 6)
          : 0}
      />
    </>
  )

  if (view === 'audit') return (
    <AuditPage
      onSubmit={handleSubmit}
      onHome={handleHome}
      error={error}
      initialUrl={currentUrl}
    />
  )

  return (
    <MarketingHome
      onStart={() => setView('audit')}
      onViewExample={handleViewExample}
      user={user}
      onSignIn={signIn}
      onSignOut={signOut}
    />
  )
}
