import { useEffect, useState, type FormEvent } from 'react'
import { api, clearSession, loadSession, saveSession, type Listing } from './api'
import { ListingDetail } from './ListingDetail'
import { LogsPage } from './LogsPage'
import { MessagesPage } from './MessagesPage'
import { StoresPage } from './StoresPage'
import { UsersPage } from './UsersPage'

function statusLabel(status: string) {
  if (status === 'teklif_var') return 'Teklif var'
  if (status === 'kapatildi') return 'Kapatıldı'
  return 'Teklif bekleniyor'
}

export default function App() {
  const existing = loadSession()
  const [token, setToken] = useState(existing?.token ?? '')
  const [name, setName] = useState(existing?.user.name ?? '')
  const [listings, setListings] = useState<Listing[]>([])
  const [selected, setSelected] = useState<Listing | null>(null)
  const [tab, setTab] = useState<'listings' | 'stores' | 'messages' | 'users' | 'logs'>('listings')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) return
    let active = true
    setLoading(true)
    api<Listing[]>('/admin/listings', token)
      .then((rows) => {
        if (active) setListings(rows)
      })
      .catch((reason: unknown) => {
        if (!active) return
        clearSession()
        setToken('')
        setError(reason instanceof Error ? reason.message : 'İlanlar alınamadı.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [token])

  function logout() {
    clearSession()
    setToken('')
    setSelected(null)
    setListings([])
  }

  if (!token) {
    return (
      <Login
        error={error}
        onSuccess={(nextToken, nextName) => {
          setError('')
          setName(nextName)
          setToken(nextToken)
        }}
      />
    )
  }

  return (
    <div className="app">
      <header className="top">
        <strong>Alan Yerler</strong>
        <nav>
          <button type="button" className={tab === 'listings' ? 'on' : ''} onClick={() => { setTab('listings'); setSelected(null) }}>
            İlanlar
          </button>
          <button type="button" className={tab === 'stores' ? 'on' : ''} onClick={() => setTab('stores')}>
            Mağazalar
          </button>
          <button type="button" className={tab === 'messages' ? 'on' : ''} onClick={() => setTab('messages')}>
            Mesajlar
          </button>
          <button type="button" className={tab === 'users' ? 'on' : ''} onClick={() => setTab('users')}>
            Kullanıcılar
          </button>
          <button type="button" className={tab === 'logs' ? 'on' : ''} onClick={() => setTab('logs')}>
            Kayıtlar
          </button>
        </nav>
        <span>{name}</span>
        <button type="button" onClick={logout}>
          Çıkış
        </button>
      </header>
      {tab === 'stores' ? (
        <StoresPage token={token} />
      ) : tab === 'messages' ? (
        <MessagesPage token={token} />
      ) : tab === 'users' ? (
        <UsersPage token={token} />
      ) : tab === 'logs' ? (
        <LogsPage token={token} />
      ) : selected ? (
        <ListingDetail
          token={token}
          listing={selected}
          onBack={() => setSelected(null)}
          onUpdated={(next) => {
            setSelected(next)
            setListings((rows) => rows.map((row) => (row.id === next.id ? next : row)))
          }}
        />
      ) : (
        <section className="panel">
          <h1>İlanlar</h1>
          {loading ? <p>Yükleniyor…</p> : null}
          {error ? <p className="error">{error}</p> : null}
          {!loading && listings.length === 0 ? <p>Henüz ilan yok.</p> : null}
          {listings.length > 0 ? (
            <table className="pick">
              <thead>
                <tr>
                  <th>Cihaz</th>
                  <th>Müşteri</th>
                  <th>Kategori</th>
                  <th>Durum</th>
                  <th>Tarih</th>
                </tr>
              </thead>
              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id} onClick={() => setSelected(listing)}>
                    <td>{listing.title}</td>
                    <td>{listing.customer.name}</td>
                    <td>{listing.category.name}</td>
                    <td>{statusLabel(listing.status)}</td>
                    <td>{new Date(listing.createdAt).toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </section>
      )}
    </div>
  )
}

function Login({
  error,
  onSuccess,
}: {
  error: string
  onSuccess: (token: string, name: string) => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState(error)
  const [busy, setBusy] = useState(false)

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setLocalError('')
    try {
      const result = await api<{ accessToken: string; user: { name: string; role: string } }>(
        '/auth/login',
        undefined,
        { email, password },
      )
      if (result.user.role !== 'admin') {
        setLocalError('Bu panele yalnızca yönetici girebilir.')
        return
      }
      saveSession(result.accessToken, {
        id: '',
        name: result.user.name,
        email,
        role: result.user.role,
      })
      onSuccess(result.accessToken, result.user.name)
    } catch (reason: unknown) {
      setLocalError(reason instanceof Error ? reason.message : 'Giriş yapılamadı.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="login">
      <form onSubmit={submit}>
        <p className="mark">Alan Yerler</p>
        <h1>Yönetim girişi</h1>
        <label>
          E-posta
          <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
        </label>
        <label>
          Şifre
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            minLength={8}
            required
          />
        </label>
        {localError ? <p className="error">{localError}</p> : null}
        <button type="submit" disabled={busy}>
          {busy ? 'Giriş yapılıyor…' : 'Giriş yap'}
        </button>
      </form>
    </main>
  )
}

