export async function shareLink(url: string, title: string, text: string) {
  if (navigator.share) {
    await navigator.share({ title, text, url }).catch(() => undefined)
    return false
  }
  await navigator.clipboard.writeText(url)
  return true
}
