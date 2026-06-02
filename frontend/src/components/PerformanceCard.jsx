import ScoreCircle from './ScoreCircle'

function Metric({ label, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-base font-semibold text-gray-800">{value ?? 'N/A'}</p>
    </div>
  )
}

export default function PerformanceCard({ performance }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Performance Scores</h2>

      <div className="flex justify-around mb-6">
        <ScoreCircle score={performance.performance_score} label="Performance" />
        <ScoreCircle score={performance.seo_score} label="SEO" />
        <ScoreCircle score={performance.accessibility_score} label="Accessibility" />
      </div>

      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Core Web Vitals</h3>
      <div className="grid grid-cols-2 gap-3">
        <Metric label="Time to Interactive" value={performance.load_time_seconds} />
        <Metric label="First Contentful Paint" value={performance.first_contentful_paint} />
        <Metric label="Largest Contentful Paint" value={performance.largest_contentful_paint} />
        <Metric label="Total Blocking Time" value={performance.total_blocking_time} />
        <Metric label="Cumulative Layout Shift" value={performance.cumulative_layout_shift} />
      </div>

      {performance._note && (
        <p className="mt-4 text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
          {performance._note}
        </p>
      )}
    </div>
  )
}
