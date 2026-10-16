import { useEffect, useState, type FormEvent } from 'react'
import { request } from './api'

type Row = {
  id: string
  store: { name: string }
  listing: { title: string; status: string }
  customer: { name: string }
  lastMessage: { body: string; createdAt: string } | null
  unreadCount: number
}

type Thread = {
  id: string
  store: { name: string }
  listing: { title: string; status: string }
  customer: { name: string }
  canSend: boolean
  messages: { id: string; body: string; createdAt: string; mine: boolean; fromStore: boolean }[]
}

export function MessagesPage({ token }: { token: string }) {
  const [rows, setRows] = useState<Row[]>([])
  const [thread, setThread] = useState<Thread | null>(null)
  const [body, setBody] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    setRows(await request<Row[]>('/admin/conversations', token))
  }

  useEffect(() => {
    let active = true
    request<Row[]>('/admin/conversations', token)
      .then((next) => {
        if (active) setRows(next)
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Konuşmalar alınamadı.')
      })
    return () => {
      active = false
    }
  }, [token])

  async function open(id: string) {
    setError('')
    const next = await request<Thread>(`/admin/conversations/${id}`, token)
    setThread(next)
    await load()
  }

  async function send(event: FormEvent) {
    event.preventDefault()
    if (!thread) return
    setBusy(true)
    setError('')
    try {
      const next = await request<Thread>(`/admin/conversations/${thread.id}/messages`, token, {
        body: { body },
      })
      setBody('')
      setThread(next)
      await load()
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Mesaj gönderilemedi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="panel">
      <h1>Mesajlar</h1>
      <p className="hint">Cevap, seçili mağazanın konuşmasına gider. Müşteri ekranında gönderen mağazadır.</p>
      {error ? <p className="error">{error}</p> : null}
      {rows.length === 0 ? <p>Henüz konuşma yok.</p> : null}
      {rows.length > 0 ? (
        <table className="pick">
          <thead>
            <tr>
              <th>Mağaza</th>
              <th>İlan</th>
              <th>Müşteri</th>
              <th>Son mesaj</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} onClick={() => void open(row.id)}>
                <td>{row.store.name}</td>
                <td>{row.listing.title}</td>
                <td>{row.customer.name}</td>
                <td>
                  {row.lastMessage?.body ?? '—'}
                  {row.unreadCount > 0 ? ` · ${row.unreadCount} yeni` : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {thread ? (
        <form className="stack" onSubmit={send}>
          <h2>
            {thread.store.name} · {thread.listing.title}
          </h2>
          <p className="hint">{thread.customer.name}</p>
          {thread.messages.length === 0 ? <p>Henüz mesaj yok.</p> : null}
          {thread.messages.map((message) => (
            <p key={message.id}>
              <strong>{message.fromStore ? thread.store.name : thread.customer.name}: </strong>
              {message.body}
            </p>
          ))}
          {thread.canSend ? (
            <>
              <label>
                Cevap
                <textarea value={body} onChange={(event) => setBody(event.target.value)} rows={3} required />
              </label>
              <button type="submit" disabled={busy}>
                {busy ? 'Gönderiliyor…' : 'Gönder'}
              </button>
            </>
          ) : (
            <p>Kapalı ilana mesaj gönderilmez.</p>
          )}
        </form>
      ) : null}
    </section>
  )
}
