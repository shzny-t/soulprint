export async function generateClaudeDescription(tracks, personalityType, stats) {
  const res = await fetch('/api/describe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tracks, personalityType, stats }),
  })

  if (!res.ok) throw new Error('Claude API failed')
  return res.json()
}
