import AuditForm from '../components/AuditForm'

export default function HomePage({ onSubmit, error }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Website Auditor</h1>
          <p className="text-gray-600 text-lg">
            Get a free performance, SEO, and AI-powered health check for your business website in under a minute.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}
          <AuditForm onSubmit={onSubmit} />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          <span className="flex items-center gap-1.5">
            <span>⚡</span> Performance scores
          </span>
          <span className="flex items-center gap-1.5">
            <span>🔍</span> SEO audit
          </span>
          <span className="flex items-center gap-1.5">
            <span>🤖</span> AI recommendations
          </span>
        </div>
      </div>
    </div>
  )
}
