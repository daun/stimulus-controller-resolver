export default function whenVisible(callback, { element, ...options }) {
  if ('IntersectionObserver' in window === false) {
    callback()
    return
  }

  const rootMargin = options.expand || '0px'

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      callback()
    },
    { rootMargin }
  )

  observer.observe(element)
}
