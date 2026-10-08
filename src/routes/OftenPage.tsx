import { Check, Plus } from 'lucide-react'
import { LABELS, NAV_LABELS, SMALL_ICON_SIZE } from '../../shared/constants'
import { AppHeader } from '../components/AppHeader'
import { HapticButton } from '../components/HapticButton'
import { normalize, oftenBought, onListNames } from '../data/items'
import { addItem, lastListId, useHistory, useItems, useLists } from '../data/store'

export function OftenPage() {
  const lists = useLists()
  const remembered = lastListId()
  const target = lists.docs.find((l) => l.id === remembered) ?? lists.docs[0]
  const items = useItems(target?.id)
  const history = useHistory(target?.id)
  const onList = onListNames(items.docs)

  return (
    <>
      <AppHeader />
      <main className="body stack">
        <div className="intro">
          <h1 className="section-title">{NAV_LABELS.often}</h1>
          <p className="hint">{target ? LABELS.oftenHint(target.name) : LABELS.oftenEmpty}</p>
        </div>
        {target && history.docs.length > 0 && (
          <div className="rows">
            {oftenBought(history.docs).map((h) => {
              const added = onList.has(normalize(h.name))
              return (
                <div key={h.name} className="row">
                  <span className="row-name">{h.name}</span>
                  <span className="row-count">{h.count}×</span>
                  <HapticButton
                    className="round-add"
                    aria-pressed={added}
                    disabled={added}
                    aria-label={LABELS.oftenAdd(h.name)}
                    onClick={() => addItem(target.id, h.name, items.docs)}
                  >
                    {added ? <Check size={SMALL_ICON_SIZE + 1} strokeWidth={3} aria-hidden="true" /> : <Plus size={SMALL_ICON_SIZE + 1} strokeWidth={3} aria-hidden="true" />}
                  </HapticButton>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
