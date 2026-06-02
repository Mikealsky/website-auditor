export default function AiReportCard({ report }) {
  const isMock = report.model === 'mock'
  const hasError = report.error === true

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">AI-Generated Report</h2>
        {isMock ? (
          <span className="text-xs bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded-full font-medium">
            Demo Mode
          </span>
        ) : hasError ? (
          <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">
            Unavailable
          </span>
        ) : (
          <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full font-medium">
            {report.model}
          </span>
        )}
      </div>

      {isMock || hasError ? (
        <div className={`rounded-lg p-4 text-sm ${isMock ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' : 'bg-red-50 border border-red-200 text-red-800'}`}>
          {report.summary}
        </div>
      ) : (
        <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
          {report.summary}
        </div>
      )}
    </div>
  )
}
