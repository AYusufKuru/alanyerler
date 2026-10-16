import { useEffect, useState } from 'react'
import { request } from './api'

type LogRow = {
  id: string
  action: string
  entity: string
  createdAt: string
  actor: { name: string; email: string } | null
}

const labels: Record<string, string> = {
  'user.create': 'Kullanıcı oluşturuldu',
  login: 'Giriş',
  'password.change': 'Şifre değişti',
  'password.assign': 'Şifre atandı',
  'user.deactivate': 'Hesap pasife alındı',
  'user.activate': 'Hesap açıldı',
  'store.create': 'Mağaza eklendi',
  'store.update': 'Mağaza güncellendi',
  'store.deactivate': 'Mağaza pasife alındı',
  'offer.create': 'Teklif eklendi',
  'offer.update': 'Teklif güncellendi',
  'offer.delete': 'Teklif silindi',
  'listing.close': 'İlan kapatıldı',
  'message.send': 'Panelden mesaj',
}

export function LogsPage({ token }: { token: string }) {
  const [rows, setRows] = useState<LogRow[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    request<LogRow[]>('/admin/logs', token)
      .then((next) => {
        if (active) setRows(next)
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Kayıtlar alınamadı.')
      })
    return () => {
      active = false
    }
  }, [token])

  return (
    <section className="panel">
      <h1>Kayıtlar</h1>
      {error ? <p className="error">{error}</p> : null}
      {rows.length === 0 ? <p>Henüz kayıt yok.</p> : null}
      {rows.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Zaman</th>
              <th>Kim</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{new Date(row.createdAt).toLocaleString('tr-TR')}</td>
                <td>{row.actor ? `${row.actor.name}` : '—'}</td>
                <td>{labels[row.action] ?? row.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </section>
  )
}
