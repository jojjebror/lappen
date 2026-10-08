import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { APP_NAME, DEFAULT_LIST_NAME, LABELS, paths } from '../../shared/constants'
import { createList, useLists, useUid } from '../data/store'

export function HomePage() {
  const uid = useUid()
  const lists = useLists()
  const navigate = useNavigate()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')

  return (
    <main className="page">
      <h1 className="title">{APP_NAME}</h1>
      {!lists.loading && lists.docs.length === 0 && <p className="hint">{LABELS.noLists}</p>}
      <ul className="group">
        {lists.docs.map((list) => (
          <li key={list.id}>
            <Link to={paths.list(list.id)} className="row row-link">
              {list.name}
            </Link>
          </li>
        ))}
      </ul>
      {creating ? (
        <form
          className="create"
          onSubmit={(e) => {
            e.preventDefault()
            navigate(paths.list(createList(uid, name.trim() || DEFAULT_LIST_NAME)))
          }}
        >
          <input className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder={DEFAULT_LIST_NAME} autoFocus />
          <button className="primary">{LABELS.create}</button>
        </form>
      ) : (
        <button className="primary" onClick={() => setCreating(true)}>
          {LABELS.newList}
        </button>
      )}
    </main>
  )
}
