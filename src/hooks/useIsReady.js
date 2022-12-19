import { useEffect, useState } from 'react'

function useIsReady(...params) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    if (!isReady) {
      const result = params.every(Boolean)
      if (result) {
        setIsReady(true)
      }
    }
  }, [params])
  

  return isReady
}

export default useIsReady
