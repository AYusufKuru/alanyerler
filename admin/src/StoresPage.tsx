import { useEffect, useState, type FormEvent } from 'react'
import { request, type Store } from './api'

const dayChoices = [
  'Pazartesi - Cuma',
  'Pazartesi - Cumartesi',
  'Cumartesi',
  'Pazar',
  'Cumartesi - Pazar',
  'Her gün',
]

const timeChoices = [
  'Kapalı',
  ...Array.from({ length: 29 }, (_, index) => {
    const total = 8 * 60 + index * 30
    const hour = Math.floor(total / 60)
    const minute = total % 60
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
  }),
]

type HourRow = { days: string; open: string; close: string }

function blankHour(): HourRow {
  return { days: '', open: '', close: '' }
}

function encodeHour(row: HourRow) {
  if (!row.days || !row.open) return ''
  if (row.open === 'Kapalı') return `${row.days}|Kapalı`
  if (!row.close) return ''
  return `${row.days}|${row.open}-${row.close}`
}

function decodeHour(line: string): HourRow {
  const [days, span] = line.split('|')
  if (span) {
    if (span === 'Kapalı') return { days, open: 'Kapalı', close: '' }
    const [open, close] = span.split('-')
    return { days, open: open?.trim() ?? '', close: close?.trim() ?? '' }
  }
  const match = line.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/)
  if (!match || match.index === undefined) return { days: line, open: '', close: '' }
  return {
    days: line.slice(0, match.index).trim().replace(/[-–:]\s*$/, '').trim(),
    open: match[1],
    close: match[2],
  }
}

const emptyForm = {
  name: '',
  city: '',
  address: '',
  about: '',
  hours: [blankHour()] as HourRow[],
  badges: '',
  rating: '',
  reviewCount: '',
}

export function StoresPage({ token }: { token: string }) {
  const [stores, setStores] = useState<Store[]>([])
  const [editing, setEditing] = useState<Store | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [logo, setLogo] = useState<File | null>(null)
  const [cover, setCover] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function load() {
    setStores(await request<Store[]>('/admin/stores', token))
  }

  useEffect(() => {
    let active = true
    request<Store[]>('/admin/stores', token)
      .then((rows) => {
        if (active) setStores(rows)
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Mağazalar alınamadı.')
      })
    return () => {
      active = false
    }
  }, [token])

  function edit(store: Store) {
    setEditing(store)
    setLogo(null)
    setCover(null)
    setError('')
    setForm({
      name: store.name,
      city: store.city,
      address: store.address,
      about: store.about,
      hours: store.hours.length > 0 ? store.hours.map(decodeHour) : [blankHour()],
      badges: store.badges.join(', '),
      rating: store.rating === null ? '' : String(store.rating),
      reviewCount: store.reviewCount === null ? '' : String(store.reviewCount),
    })
  }

  function reset() {
    setEditing(null)
    setForm(emptyForm)
    setLogo(null)
    setCover(null)
    setError('')
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    const body = {
      name: form.name.trim(),
      city: form.city.trim(),
      address: form.address.trim(),
      about: form.about.trim(),
      hours: form.hours.map(encodeHour).filter(Boolean),
      badges: form.badges.split(',').map((item) => item.trim()).filter(Boolean),
      rating: form.rating.trim() === '' ? null : Number(form.rating),
      reviewCount: form.reviewCount.trim() === '' ? null : Number(form.reviewCount),
    }
    try {
      const saved = editing
        ? await request<Store>(`/admin/stores/${editing.id}`, token, { method: 'PATCH', body })
        : await request<Store>('/admin/stores', token, { body })
      if (logo || cover) {
        const data = new FormData()
        if (logo) data.append('logo', logo)
        if (cover) data.append('cover', cover)
        await request<Store>(`/admin/stores/${saved.id}/images`, token, { form: data })
      }
      await load()
      reset()
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Mağaza kaydedilemedi.')
    } finally {
      setBusy(false)
    }
  }

  async function setActive(store: Store, active: boolean) {
    setError('')
    try {
      await request<Store>(`/admin/stores/${store.id}`, token, { method: 'PATCH', body: { active } })
      await load()
      if (editing?.id === store.id) setEditing({ ...store, active })
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Mağaza güncellenemedi.')
    }
  }

  return (
    <section className="panel">
      <h1>Mağazalar</h1>
      <p className="hint">İşletmeye bilgi veren gerçek mağazayı kaydedin. Puanı yalnız mağaza bildirdiyse yazın.</p>
      {error ? <p className="error">{error}</p> : null}
      {stores.length === 0 ? <p>Henüz mağaza yok.</p> : null}
      {stores.length > 0 ? (
        <table className="pick">
          <thead>
            <tr>
              <th>Mağaza</th>
              <th>Şehir</th>
              <th>Puan</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.id} onClick={() => edit(store)}>
                <td>{store.name}</td>
                <td>{store.city}</td>
                <td>{store.rating === null ? '—' : store.rating}</td>
                <td>{store.active ? 'Aktif' : 'Pasif'}</td>
                <td>
                  <button
                    type="button"
                    className="text"
                    onClick={(event) => {
                      event.stopPropagation()
                      void setActive(store, !store.active)
                    }}
                  >
                    {store.active ? 'Pasife al' : 'Yeniden aç'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}

      <form className="stack" onSubmit={submit}>
        <h2>{editing ? 'Mağazayı düzenle' : 'Yeni mağaza'}</h2>
        <label>
          Ticari ad
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required />
        </label>
        <div className="split">
          <label>
            Şehir
            <input value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} required />
          </label>
          <label>
            Adres
            <input value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} required />
          </label>
        </div>
        <label>
          Hakkında
          <textarea value={form.about} onChange={(event) => setForm({ ...form, about: event.target.value })} rows={3} />
        </label>
        <div>
          <label>Çalışma saatleri</label>
          {form.hours.map((row, index) => (
            <div className="hours-row" key={index}>
              <label>
                Gün
                <select
                  value={row.days}
                  onChange={(event) => {
                    const hours = form.hours.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, days: event.target.value } : item,
                    )
                    setForm({ ...form, hours })
                  }}
                >
                  <option value="">Seçin</option>
                  {dayChoices.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                  {row.days && !dayChoices.includes(row.days) ? <option value={row.days}>{row.days}</option> : null}
                </select>
              </label>
              <label>
                Açılış
                <select
                  value={row.open}
                  onChange={(event) => {
                    const open = event.target.value
                    const hours = form.hours.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, open, close: open === 'Kapalı' ? '' : item.close } : item,
                    )
                    setForm({ ...form, hours })
                  }}
                >
                  <option value="">Seçin</option>
                  {timeChoices.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                  {row.open && !timeChoices.includes(row.open) ? <option value={row.open}>{row.open}</option> : null}
                </select>
              </label>
              <label>
                Kapanış
                <select
                  value={row.close}
                  disabled={row.open === 'Kapalı'}
                  onChange={(event) => {
                    const hours = form.hours.map((item, itemIndex) =>
                      itemIndex === index ? { ...item, close: event.target.value } : item,
                    )
                    setForm({ ...form, hours })
                  }}
                >
                  <option value="">Seçin</option>
                  {timeChoices
                    .filter((time) => time !== 'Kapalı')
                    .map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  {row.close && !timeChoices.includes(row.close) ? <option value={row.close}>{row.close}</option> : null}
                </select>
              </label>
              <button
                type="button"
                onClick={() => {
                  const hours = form.hours.filter((_, itemIndex) => itemIndex !== index)
                  setForm({ ...form, hours: hours.length > 0 ? hours : [blankHour()] })
                }}
              >
                Sil
              </button>
            </div>
          ))}
          {form.hours.length < 7 ? (
            <button type="button" className="text" onClick={() => setForm({ ...form, hours: [...form.hours, blankHour()] })}>
              Satır ekle
            </button>
          ) : null}
        </div>
        <label>
          Rozetler
          <input
            value={form.badges}
            onChange={(event) => setForm({ ...form, badges: event.target.value })}
            placeholder="Yetkili satıcı, Aynı gün teslim"
          />
        </label>
        <div className="split">
          <label>
            Puan
            <input
              value={form.rating}
              onChange={(event) => setForm({ ...form, rating: event.target.value })}
              inputMode="decimal"
              placeholder="Boş bırakılabilir"
            />
          </label>
          <label>
            Değerlendirme sayısı
            <input
              value={form.reviewCount}
              onChange={(event) => setForm({ ...form, reviewCount: event.target.value })}
              inputMode="numeric"
              placeholder="Boş bırakılabilir"
            />
          </label>
        </div>
        <div className="split">
          <label>
            Logo
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setLogo(event.target.files?.[0] ?? null)} />
          </label>
          <label>
            Kapak
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setCover(event.target.files?.[0] ?? null)} />
          </label>
        </div>
        {editing?.logo || editing?.cover ? (
          <div className="photos">
            {editing.logo ? <img src={editing.logo} alt="" /> : null}
            {editing.cover ? <img src={editing.cover} alt="" /> : null}
          </div>
        ) : null}
        <div className="actions">
          <button type="submit" disabled={busy}>
            {busy ? 'Kaydediliyor…' : 'Kaydet'}
          </button>
          {editing ? (
            <button type="button" className="text" onClick={reset}>
              Yeni mağaza
            </button>
          ) : null}
        </div>
      </form>
    </section>
  )
}
