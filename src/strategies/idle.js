export default function whenIdle(callback) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(callback)
  } else {
    setTimeout(callback, 250)
  }

  console.log('Loading when idle')
}
