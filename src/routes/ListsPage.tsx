import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { DEFAULT_LIST_NAME, LABELS, SMALL_ICON_SIZE, paths } from '../../shared/constants'
import { AddField } from '../components/AddField'
import { AppHeader } from '../components/AppHeader'
import type { List } from '../data/items'
import { createList, useItems, useLists, useUid } from '../data/store'

function ListCard({ list }: { list: List }) {
  const items = useItems(list.id)
  return (
    <Link to={paths.list(list.id)} className="row list-card">
      <span className="list-card-name">{list.name}</span>
      {!items.loading && <span className="row-count">{items.docs.filter((i) => !i.checked).length}</span>}
      <ChevronRight className="row-chevron" size={SMALL_ICON_SIZE + 2} aria-hidden="true" />
    </Link>
  )
}

export function ListsPage() {
  const uid = useUid()
  const lists = useLists()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  return (
    <>
      <AppHeader />
      <main className="body stack">
        <h1 className="section-title">{LABELS.yourLists}</h1>
        {!lists.loading && lists.docs.length === 0 && <p className="hint">{LABELS.noLists}</p>}
        {lists.docs.length > 0 && (
          <div className="cards">
            {lists.docs.map((list) => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        )}
        {creating ? (
          <AddField
            value={name}
            onChange={setName}
            onSubmit={() => navigate(paths.list(createList(uid, name.trim() || DEFAULT_LIST_NAME)))}
            placeholder={DEFAULT_LIST_NAME}
            autoFocus
          />
        ) : (
          <button className="outline-button" onClick={() => setCreating(true)}>
            <Plus size={SMALL_ICON_SIZE} strokeWidth={3} aria-hidden="true" />
            {LABELS.newList}
          </button>
        )}
      </main>
    </>
  )
}
