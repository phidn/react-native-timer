export const calcTotalTime = (session) => {
  if (!session?.logs) return 0
  
  return session.logs.reduce((a, b) => {
    const duration = +b.split('|')[0] || 0
    return a += duration
  }, 0)
}
