export default function whenMediaMatches(callback, { query }) {
  const mql = matchMedia(query)
  if (mql.matches) {
    callback()
  } else {
    mql.addEventListener('change', callback, { once: true })
  }

  console.log(`Loading when media matches: ${query}`)
}
