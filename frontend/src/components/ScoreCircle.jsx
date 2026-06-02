function scoreColors(score) {
  if (score >= 90) return 'ring-green-500 bg-green-50 text-green-700'
  if (score >= 50) return 'ring-orange-400 bg-orange-50 text-orange-700'
  return 'ring-red-500 bg-red-50 text-red-700'
}

export default function ScoreCircle({ score, label }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`w-20 h-20 rounded-full ring-4 flex items-center justify-center ${scoreColors(score)}`}>
        <span className="text-2xl font-bold">{score}</span>
      </div>
      <span className="text-sm text-gray-600 text-center font-medium leading-tight">{label}</span>
    </div>
  )
}
