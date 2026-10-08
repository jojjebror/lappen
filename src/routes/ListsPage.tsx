import { useState } from 'react'
import { ChevronRight, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router'
import { DEFAULT_LIST_NAME, LABELS, SMALL_ICON_SIZE, paths } from '../../shared/constants'
import { AddField } from '../components/AddField'
import { AppHeader } from '../components/AppHeader'
import type { List } from '../data/items'
import { createList, useItems, useLists } from '../data/store'
import { useHousehold } from '../household'
import { useFlip } from '../motion'

function ListCard({ list }: { list: List }) {
  const items = useItems(list.id)
  return (
    <Link to={paths.list(list.id)} className="row list-card" data-key={list.id}>
      <span className="list-card-name">{list.name}</span>
      {!items.loading && <span className="row-count">{items.docs.filter((i) => !i.checked).length}</span>}
      <ChevronRight className="row-chevron" size={SMALL_ICON_SIZE + 2} aria-hidden="true" />
    </Link>
  )
}

export function ListsPage() {
  const { household } = useHousehold()
  const lists = useLists(household?.id)
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const cards = useFlip<HTMLDivElement>(lists.docs.map((l) => l.id).join())

  return (
    <>
      <AppHeader />
      <main className="body stack">
        <h1 className="section-title">{LABELS.yourLists}</h1>
        {household && !lists.loading && lists.docs.length === 0 && <p className="hint reveal">{LABELS.noLists}</p>}
        <div className="cards" ref={cards}>
          {lists.docs.map((list) => (
            <ListCard key={list.id} list={list} />
          ))}
        </div>
        {creating && household ? (
          <div className="reveal">
            <AddField
              value={name}
              onChange={setName}
              onSubmit={() => navigate(paths.list(createList(household.id, name.trim() || DEFAULT_LIST_NAME)))}
              placeholder={DEFAULT_LIST_NAME}
              autoFocus
            />
          </div>
        ) : (
          <button className="outline-button" disabled={!household} onClick={() => setCreating(true)}>
            <Plus size={SMALL_ICON_SIZE} strokeWidth={3} aria-hidden="true" />
            {LABELS.newList}
          </button>
        )}
      </main>
    </>
  )
}
