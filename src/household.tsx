import { createContext, useContext, useEffect, useRef, type ReactNode } from 'react'
import { primaryHousehold, type Household } from './data/items'
import { adoptLegacyLists, createHousehold, useHouseholds, useUid } from './data/store'

const HouseholdContext = createContext<{ household?: Household; loading: boolean }>({ loading: true })

export function HouseholdProvider({ children }: { children: ReactNode }) {
  const uid = useUid()
  const households = useHouseholds()
  const household = primaryHousehold(households.docs)
  const created = useRef(false)

  useEffect(() => {
    if (households.loading || household || created.current) return
    created.current = true
    createHousehold(uid)
  }, [households.loading, household, uid])

  useEffect(() => {
    if (household) adoptLegacyLists(uid, household.id).catch(() => undefined)
  }, [household?.id, uid])

  return <HouseholdContext value={{ household, loading: !household }}>{children}</HouseholdContext>
}

export const useHousehold = () => useContext(HouseholdContext)
