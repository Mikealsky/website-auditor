import { useState } from 'react'
import PerformanceCard from '../components/PerformanceCard'
import SeoCard from '../components/SeoCard'
import AiReportCard from '../components/AiReportCard'

export default function ResultsPage({ data, businessName, onReset }) {
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)

  const auditDate = new Date().toLocaleDateString('en-AU', { dateStyle: 'long' })

  const handleDownloadPdf = async () => {
    setDownloading(true)
    setDownloadError(null)

    try {
      const response = await fetch('/api/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: data.url,
          business_name: businessName,
          performance: data.performance,
          seo: data.seo,
          ai_report: data.ai_report,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.detail || 'PDF generation failed.')
      }

      const blob = await response.blob()
      const objectUrl = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = objectUrl
      anchor.download = `audit-report.pdf`
      anchor.click()
      URL.revokeObjectURL(objectUrl)
    } catch (err) {
      setDownloadError(err.message)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-900">Website Auditor</h1>
            <p className="text-xs text-gray-500 truncate">{data.url}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleDownloadPdf}
              disabled={downloading}
              className="text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5"
            >
              {downloading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Generating…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17v3a1 1 0 001 1h16a1 1 0 001-1v-3" />
                  </svg>
                  Download Report
                </>
              )}
            </button>
            <button
              onClick={onReset}
              className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              New Audit
            </button>
          </div>
        </div>
        {downloadError && (
          <div className="max-w-3xl mx-auto px-4 pb-3">
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              PDF error: {downloadError}
            </p>
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Audit Results</h2>
          <p className="text-sm text-gray-500 mt-1">Analysed on {auditDate}</p>
        </div>

        <PerformanceCard performance={data.performance} />
        <SeoCard seo={data.seo} />
        <AiReportCard report={data.ai_report} />
      </div>
    </div>
  )
}
