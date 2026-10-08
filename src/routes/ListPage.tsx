import { useEffect, useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'
import { useParams } from 'react-router'
import { LABELS, LIST_PARAM, MOTION, SMALL_ICON_SIZE, UNDO_MS } from '../../shared/constants'
import { AddField } from '../components/AddField'
import { AppHeader, useBack } from '../components/AppHeader'
import { HapticButton } from '../components/HapticButton'
import { sortItems, suggest, type Item } from '../data/items'
import { addItem, clearChecked, deleteList, rememberList, setChecked, useHistory, useItems, useLists } from '../data/store'
import { useHousehold } from '../household'
import { useFlip, usePresence } from '../motion'

export function ListPage() {
  const id = useParams()[LIST_PARAM]!
  const { household } = useHousehold()
  const lists = useLists(household?.id)
  const list = lists.docs.find((l) => l.id === id)
  const items = useItems(list?.id)
  const history = useHistory(list?.id)
  const [input, setInput] = useState('')
  const [undo, setUndo] = useState<Item>()
  const [clearing, setClearing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const goBack = useBack()
  const toast = usePresence(undo)
  const sorted = sortItems(items.docs)
  const rows = useFlip<HTMLDivElement>(sorted.map((i) => `${i.id}:${i.checked}`).join())

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

  const clear = () => {
    setClearing(true)
    setUndo(undefined)
    setTimeout(() => {
      clearChecked(id, items.docs)
      setClearing(false)
    }, MOTION.exitMs)
  }

  const remove = () => {
    deleteList(id)
    goBack()
  }

  return (
    <>
      <AppHeader back />
      <main className="body stack-tight">
        <h1 className="page-title">{list?.name}</h1>
        {household && !lists.loading && !list && <p className="hint">{LABELS.listMissing}</p>}
        <AddField value={input} onChange={setInput} onSubmit={() => add(input)} placeholder={LABELS.addItem} />
        <div className="chips">
          {suggest(history.docs, input, items.docs).map((s) => (
            <button key={s.name} className="chip reveal" onPointerDown={(e) => e.preventDefault()} onClick={() => add(s.name)}>
              <Plus size={SMALL_ICON_SIZE - 2} strokeWidth={3} aria-hidden="true" />
              {s.name}
            </button>
          ))}
        </div>
        <div className="rows" ref={rows}>
          {sorted.map((item) => (
            <HapticButton
              key={item.id}
              data-key={item.id}
              className={clearing && item.checked ? 'row item leaving' : 'row item'}
              aria-pressed={item.checked}
              onClick={() => toggle(item)}
            >
              <span className="check-box">{item.checked && <Check size={SMALL_ICON_SIZE - 1} strokeWidth={3.5} aria-hidden="true" />}</span>
              <span className="row-name">{item.name}</span>
            </HapticButton>
          ))}
        </div>
        {items.docs.some((i) => i.checked) && (
          <button className="text-button reveal" onClick={clear}>
            {LABELS.clearChecked}
          </button>
        )}
        {list &&
          (confirming ? (
            <div className="confirm stack-tight reveal">
              <p className="hint">{LABELS.deleteListHint(list.name)}</p>
              <div className="confirm-actions">
                <button className="outline-button" onClick={() => setConfirming(false)}>
                  {LABELS.cancel}
                </button>
                <HapticButton className="solid-button danger" onClick={remove}>
                  {LABELS.delete}
                </HapticButton>
              </div>
            </div>
          ) : (
            <button className="text-button danger delete-list" onClick={() => setConfirming(true)}>
              <Trash2 size={SMALL_ICON_SIZE} aria-hidden="true" />
              {LABELS.deleteList}
            </button>
          ))}
      </main>
      {toast.shown && (
        <div className={toast.leaving ? 'toast leaving' : 'toast'} key={toast.shown.id} role="status">
          <span>{LABELS.checked(toast.shown.name)}</span>
          <button
            className="text-button"
            onClick={() => {
              setChecked(id, toast.shown!.id, false)
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
