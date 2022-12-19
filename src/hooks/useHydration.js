import { useEffect, useState } from 'react'
import { useStore } from '@store/useStore'

const useHydration = () => {
  const [hydrated, setHydrated] = useState(useStore.persist.hasHydrated)

  useEffect(() => {
    const unsubHydrate = useStore.persist.onHydrate(() => setHydrated(false))
    const unsubFinishHydration = useStore.persist.onFinishHydration(() => setHydrated(true))

    setHydrated(useStore.persist.hasHydrated())

    return () => {
      unsubHydrate()
      unsubFinishHydration()
    }
  }, [])

  return hydrated
}

export default useHydration
