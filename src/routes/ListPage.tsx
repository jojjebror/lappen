import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { LABELS, LIST_PARAM, paths } from '../../shared/constants'
import { sortItems, suggest } from '../data/items'
import { addItem, clearChecked, joinList, setChecked, useHistory, useItems, useLists, useUid } from '../data/store'

export function ListPage() {
  const id = useParams()[LIST_PARAM]!
  const uid = useUid()
  const lists = useLists()
  const list = lists.docs.find((l) => l.id === id)
  const items = useItems(list?.id)
  const history = useHistory(list?.id)
  const [input, setInput] = useState('')

  useEffect(() => {
    if (!lists.loading && !list) joinList(id, uid)
  }, [lists.loading, list, id, uid])

  const add = (name: string) => {
    if (name.trim()) addItem(id, name.trim(), items.docs)
    setInput('')
  }

  const share = () => {
    const url = location.href
    if (navigator.share) navigator.share({ title: list?.name, url }).catch(() => undefined)
    else navigator.clipboard.writeText(url).catch(() => undefined)
  }

  return (
    <main className="page">
      <header className="list-head">
        <Link to={paths.home} className="back">
          {LABELS.back}
        </Link>
        <button className="link" onClick={share}>
          {LABELS.share}
        </button>
      </header>
      <h1 className="title">{list?.name}</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          add(input)
        }}
      >
        <input
          className="field"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={LABELS.addItem}
          enterKeyHint="done"
          autoComplete="off"
        />
      </form>
      <div className="suggestions">
        {suggest(history.docs, input, items.docs).map((s) => (
          <button key={s.name} className="chip" onPointerDown={(e) => e.preventDefault()} onClick={() => add(s.name)}>
            {s.name}
          </button>
        ))}
      </div>
      <ul className="group">
        {sortItems(items.docs).map((item) => (
          <li key={item.id}>
            <button className="row item" aria-pressed={item.checked} onClick={() => setChecked(id, item.id, !item.checked)}>
              {item.name}
            </button>
          </li>
        ))}
      </ul>
      {items.docs.some((i) => i.checked) && (
        <button className="link clear" onClick={() => clearChecked(id, items.docs)}>
          {LABELS.clearChecked}
        </button>
      )}
    </main>
  )
}
