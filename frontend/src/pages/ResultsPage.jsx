import PerformanceCard from '../components/PerformanceCard'
import SeoCard from '../components/SeoCard'
import AiReportCard from '../components/AiReportCard'

export default function ResultsPage({ data, onReset }) {
  const auditDate = new Date().toLocaleDateString('en-AU', { dateStyle: 'long' })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-base font-bold text-gray-900">Website Auditor</h1>
            <p className="text-xs text-gray-500 truncate">{data.url}</p>
          </div>
          <button
            onClick={onReset}
            className="flex-shrink-0 text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            New Audit
          </button>
        </div>
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
