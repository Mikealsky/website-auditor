export function deriveChecks(seo) {
  const t = seo.has_title || {}
  return [
    t.present
      ? { state: 'pass', label: 'Page title', detail: `"${(t.value || '').slice(0, 42)}${(t.value || '').length > 42 ? '…' : ''}"` }
      : { state: 'fail', label: 'Page title missing', detail: 'search engines show your link with no name' },
    seo.has_meta_description?.present
      ? { state: 'pass', label: 'Page description set', detail: 'your Google snippet reads well' }
      : { state: 'fail', label: 'Meta description missing', detail: 'your Google snippet shows up blank' },
    seo.has_h1
      ? (seo.h1_count > 1
          ? { state: 'warn', label: `${seo.h1_count} main headings`, detail: 'ideally just one per page' }
          : { state: 'pass', label: 'Main heading (H1) present', detail: 'Google understands the page' })
      : { state: 'fail', label: 'No main heading (H1)', detail: "Google can't tell what this page is about" },
    seo.images_missing_alt === 0
      ? { state: 'pass', label: `All ${seo.total_images} photos described`, detail: 'great for SEO & accessibility' }
      : { state: 'warn', label: `${seo.images_missing_alt} of ${seo.total_images} photos`, detail: 'missing descriptions (alt text)' },
    seo.has_https
      ? { state: 'pass', label: 'Secure (HTTPS)', detail: 'visitors see the padlock' }
      : { state: 'fail', label: 'Not secure (no HTTPS)', detail: 'browsers warn visitors away' },
    seo.has_viewport_meta
      ? { state: 'pass', label: 'Mobile-friendly', detail: 'fits phone screens' }
      : { state: 'fail', label: 'No mobile viewport', detail: 'site looks broken on phones' },
    seo.has_phone_number
      ? { state: 'pass', label: 'Phone number found', detail: 'customers can call in one tap' }
      : { state: 'fail', label: 'No phone number', detail: 'found on the page' },
    seo.has_cta_above_fold
      ? { state: 'pass', label: 'Clear call-to-action', detail: 'visitors know what to do next' }
      : { state: 'fail', label: 'No clear call-to-action', detail: "visitors don't know what to do next" },
  ]
}

export function deriveFixes(data) {
  const { seo, performance: perf } = data
  const fixes = []
  if (perf.performance_score < 60)
    fixes.push({ priority: 'High', title: 'Speed up your homepage', body: `It takes ${perf.load_time_seconds} to load — most people leave after 3 seconds. Compressing your photos will make it feel instant.` })
  if (!seo.has_https)
    fixes.push({ priority: 'High', title: 'Switch to a secure (HTTPS) site', body: 'Browsers show a "Not secure" warning to every visitor. A free SSL certificate fixes this and builds trust.' })
  if (!seo.has_viewport_meta)
    fixes.push({ priority: 'High', title: 'Fix the layout on phones', body: 'Your site has no mobile setting, so phones show a tiny, squished page — where most local customers search.' })
  if (!seo.has_cta_above_fold)
    fixes.push({ priority: 'High', title: 'Add a clear action button', body: 'There\'s no obvious next step up top. One bold "Book now" or "Call us" button turns browsers into customers.' })
  if (!seo.has_phone_number)
    fixes.push({ priority: 'Medium', title: 'Show your phone number', body: "We couldn't find a number on the page. Put it in the header so customers can call in one tap." })
  if (!seo.has_meta_description?.present)
    fixes.push({ priority: 'Medium', title: 'Write a description for Google', body: 'Your meta description is missing, so your Google result looks blank and gets fewer clicks.' })
  if (!seo.has_h1)
    fixes.push({ priority: 'Medium', title: 'Add a main heading', body: "There's no H1 heading, so Google struggles to understand what your page is about." })
  if (seo.images_missing_alt > 0)
    fixes.push({ priority: 'Low', title: `Describe ${seo.images_missing_alt} of your photos`, body: `${seo.images_missing_alt} image${seo.images_missing_alt > 1 ? 's have' : ' has'} no alt text. Adding it helps Google understand your page and boosts ranking.` })

  const order = { High: 0, Medium: 1, Low: 2 }
  fixes.sort((a, b) => order[a.priority] - order[b.priority])
  return fixes.map((f, i) => ({ ...f, n: i + 1 }))
}

export function scoreBand(s) {
  if (s >= 90) return { word: 'Great', c: 'var(--green)', chip: 'wa-chip-green' }
  if (s >= 70) return { word: 'Good', c: 'var(--green)', chip: 'wa-chip-green' }
  if (s >= 50) return { word: 'Okay', c: 'var(--amber)', chip: 'wa-chip-amber' }
  return { word: 'Poor', c: 'var(--coral)', chip: 'wa-chip-red' }
}
