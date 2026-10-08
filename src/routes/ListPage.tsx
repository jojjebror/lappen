import { useEffect, useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { useParams } from 'react-router'
import { LABELS, LIST_PARAM, SMALL_ICON_SIZE, UNDO_MS } from '../../shared/constants'
import { AddField } from '../components/AddField'
import { AppHeader } from '../components/AppHeader'
import { HapticButton } from '../components/HapticButton'
import { sortItems, suggest, type Item } from '../data/items'
import { addItem, clearChecked, joinList, rememberList, setChecked, useHistory, useItems, useLists, useUid } from '../data/store'

export function ListPage() {
  const id = useParams()[LIST_PARAM]!
  const uid = useUid()
  const lists = useLists()
  const list = lists.docs.find((l) => l.id === id)
  const items = useItems(list?.id)
  const history = useHistory(list?.id)
  const [input, setInput] = useState('')
  const [undo, setUndo] = useState<Item>()

  useEffect(() => {
    if (!lists.loading && !list) joinList(id, uid)
  }, [lists.loading, list, id, uid])

  useEffect(() => rememberList(id), [id])

  useEffect(() => {
    if (!undo) return
    const timer = setTimeout(() => setUndo(undefined), UNDO_MS)
    return () => clearTimeout(timer)
  }, [undo])

  const add = (name: string) => {
    if (name.trim()) addItem(id, name.trim(), items.docs)
    setInput('')
  }

  const toggle = (item: Item) => {
    setChecked(id, item.id, !item.checked)
    setUndo(item.checked ? undefined : item)
  }

  const share = () => {
    const url = location.href
    if (navigator.share) navigator.share({ title: list?.name, url }).catch(() => undefined)
    else navigator.clipboard.writeText(url).catch(() => undefined)
  }

  return (
    <>
      <AppHeader back onShare={share} />
      <main className="body stack-tight">
        <h1 className="page-title">{list?.name}</h1>
        <AddField value={input} onChange={setInput} onSubmit={() => add(input)} placeholder={LABELS.addItem} />
        <div className="chips">
          {suggest(history.docs, input, items.docs).map((s) => (
            <button key={s.name} className="chip" onPointerDown={(e) => e.preventDefault()} onClick={() => add(s.name)}>
              <Plus size={SMALL_ICON_SIZE - 2} strokeWidth={3} aria-hidden="true" />
              {s.name}
            </button>
          ))}
        </div>
        {items.docs.length > 0 && (
          <div className="rows">
            {sortItems(items.docs).map((item) => (
              <HapticButton key={item.id} className="row item" aria-pressed={item.checked} onClick={() => toggle(item)}>
                <span className="check-box">{item.checked && <Check size={SMALL_ICON_SIZE - 1} strokeWidth={3.5} aria-hidden="true" />}</span>
                <span className="row-name">{item.name}</span>
              </HapticButton>
            ))}
          </div>
        )}
        {items.docs.some((i) => i.checked) && (
          <button className="text-button" onClick={() => clearChecked(id, items.docs)}>
            {LABELS.clearChecked}
          </button>
        )}
      </main>
      {undo && (
        <div className="toast reveal" key={undo.id} role="status">
          <span>{LABELS.checked(undo.name)}</span>
          <button
            className="text-button"
            onClick={() => {
              setChecked(id, undo.id, false)
              setUndo(undefined)
            }}
          >
            {LABELS.undo}
          </button>
        </div>
      )}
    </>
  )
}
