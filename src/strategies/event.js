export default function whenEventTriggered(callback, { event }) {
  document.addEventListener(event, () => callback())
}
