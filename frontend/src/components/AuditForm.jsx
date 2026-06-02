import { useState } from 'react'

export default function AuditForm({ onSubmit }) {
  const [url, setUrl] = useState('')
  const [businessName, setBusinessName] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!url.trim()) return
    onSubmit({ url: url.trim(), businessName: businessName.trim() || 'this business' })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Website URL
        </label>
        <input
          type="url"
          required
          placeholder="https://yourbusiness.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Name{' '}
          <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          type="text"
          placeholder="Acme Plumbing Co."
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
      >
        Run Free Audit
      </button>
    </form>
  )
}
