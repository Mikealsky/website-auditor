import { useState } from 'react'
import HomePage from './pages/HomePage'
import ResultsPage from './pages/ResultsPage'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [view, setView] = useState('home')
  const [auditData, setAuditData] = useState(null)
  const [businessName, setBusinessName] = useState('this business')
  const [error, setError] = useState(null)

  const handleSubmit = async ({ url, businessName: name }) => {
    setView('loading')
    setError(null)
    setBusinessName(name || 'this business')

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, business_name: name }),
      })

      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.detail || 'Audit failed. Please try again.')
      }

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

  if (view === 'loading') return <LoadingScreen />
  if (view === 'results') return <ResultsPage data={auditData} businessName={businessName} onReset={handleReset} />
  return <HomePage onSubmit={handleSubmit} error={error} />
}
