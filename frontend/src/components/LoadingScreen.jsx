export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Auditing your website…</h2>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Running performance tests, checking SEO, and generating your AI report. This usually takes 20–40 seconds.
        </p>
      </div>
    </div>
  )
}
