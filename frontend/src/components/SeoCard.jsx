function CheckItem({ pass, label }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
          pass ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}
      >
        {pass ? '✓' : '✗'}
      </span>
      <span className="text-sm text-gray-700 leading-snug">{label}</span>
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-gray-100 last:border-0">
      <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold bg-blue-100 text-blue-600">
        i
      </span>
      <span className="text-sm text-gray-700">
        <span className="font-medium">{label}:</span> {value}
      </span>
    </div>
  )
}

export default function SeoCard({ seo }) {
  if (seo.error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-2">SEO &amp; Website Health</h2>
        <p className="text-sm text-red-600">{seo.error}</p>
      </div>
    )
  }

  const altLabel =
    seo.images_missing_alt > 0
      ? `${seo.images_missing_alt} of ${seo.total_images} images missing alt text — hurts SEO and accessibility`
      : `All ${seo.total_images} images have alt text`

  const h1Label = seo.has_h1
    ? seo.h1_count > 1
      ? `${seo.h1_count} H1 headings found — ideally just one per page`
      : 'Main heading (H1) present'
    : 'No main heading (H1) — Google cannot understand what this page is about'

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">SEO &amp; Website Health</h2>

      <CheckItem
        pass={seo.has_title?.present}
        label={
          seo.has_title?.present
            ? `Title tag: "${seo.has_title.value.slice(0, 70)}${seo.has_title.value.length > 70 ? '…' : ''}"`
            : 'Missing title tag — critical for search rankings'
        }
      />
      <CheckItem
        pass={seo.has_meta_description?.present}
        label={
          seo.has_meta_description?.present
            ? 'Meta description present'
            : 'Missing meta description — your search result snippet will appear blank'
        }
      />
      <CheckItem pass={seo.has_h1} label={h1Label} />
      <CheckItem pass={seo.images_missing_alt === 0} label={altLabel} />
      <CheckItem
        pass={seo.has_https}
        label={seo.has_https ? 'Site uses HTTPS (secure)' : 'No HTTPS — browsers warn visitors this site is not secure'}
      />
      <CheckItem
        pass={seo.has_viewport_meta}
        label={
          seo.has_viewport_meta
            ? 'Mobile-friendly viewport configured'
            : 'No mobile viewport tag — site may look broken on phones'
        }
      />
      <CheckItem
        pass={seo.has_phone_number}
        label={
          seo.has_phone_number
            ? 'Phone number found on page'
            : 'No phone number visible — makes it harder for customers to contact you'
        }
      />
      <CheckItem
        pass={seo.has_cta_above_fold}
        label={
          seo.has_cta_above_fold
            ? 'Call-to-action found on page'
            : 'No clear call-to-action — visitors may not know what to do next'
        }
      />
      <InfoItem label="Word count" value={seo.word_count?.toLocaleString()} />
      <InfoItem label="Links" value={`${seo.internal_links} internal, ${seo.external_links} external`} />
    </div>
  )
}
