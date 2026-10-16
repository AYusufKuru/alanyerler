import { useEffect, useState, type FormEvent } from 'react'
import { request } from './api'

type Account = {
  id: string
  name: string
  email: string
  role: string
  active: boolean
  createdAt: string
}

export function UsersPage({ token }: { token: string }) {
  const [rows, setRows] = useState<Account[]>([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('customer')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    setRows(await request<Account[]>('/admin/users', token))
  }

  useEffect(() => {
    let active = true
    request<Account[]>('/admin/users', token)
      .then((next) => {
        if (active) setRows(next)
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Kullanıcılar alınamadı.')
      })
    return () => {
      active = false
    }
  }, [token])

  async function create(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await request('/admin/users', token, { body: { name, email, password, role } })
      setName('')
      setEmail('')
      setPassword('')
      setRole('customer')
      await load()
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Kullanıcı oluşturulamadı.')
    } finally {
      setBusy(false)
    }
  }

  async function setActive(account: Account, active: boolean) {
    setError('')
    try {
      await request(`/admin/users/${account.id}`, token, { method: 'PATCH', body: { active } })
      await load()
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Hesap güncellenemedi.')
    }
  }

  async function assignPassword(account: Account) {
    const next = window.prompt(`${account.email} için yeni şifre`, '')
    if (!next) return
    setError('')
    try {
      await request(`/admin/users/${account.id}`, token, { method: 'PATCH', body: { password: next } })
      await load()
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Şifre atanamadı.')
    }
  }

  return (
    <section className="panel">
      <h1>Kullanıcılar</h1>
      {error ? <p className="error">{error}</p> : null}
      <table>
        <thead>
          <tr>
            <th>Ad</th>
            <th>E-posta</th>
            <th>Rol</th>
            <th>Durum</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((account) => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>{account.email}</td>
              <td>{account.role === 'admin' ? 'Yönetici' : 'Müşteri'}</td>
              <td>{account.active ? 'Aktif' : 'Pasif'}</td>
              <td className="actions">
                <button type="button" className="text" onClick={() => void assignPassword(account)}>
                  Şifre ata
                </button>
                <button type="button" className="text" onClick={() => void setActive(account, !account.active)}>
                  {account.active ? 'Pasife al' : 'Aç'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <form className="stack" onSubmit={create}>
        <h2>Yeni hesap</h2>
        <label>
          Ad soyad
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          E-posta
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <label>
          Şifre
          <input type="password" minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} required />
        </label>
        <label>
          Rol
          <select value={role} onChange={(event) => setRole(event.target.value)}>
            <option value="customer">Müşteri</option>
            <option value="admin">Yönetici</option>
          </select>
        </label>
        <button type="submit" disabled={busy}>
          {busy ? 'Kaydediliyor…' : 'Hesap aç'}
        </button>
      </form>
    </section>
  )
}
