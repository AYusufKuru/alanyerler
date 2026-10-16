import { useEffect, useState, type FormEvent } from 'react'
import { request, type Listing, type Offer, type Store } from './api'

const labels: Record<string, string> = {
  marka: 'Marka',
  seri: 'Seri',
  model: 'Model',
  islemci: 'İşlemci',
  ekranKarti: 'Ekran kartı',
  ram: 'RAM',
  depolama: 'Depolama',
  ekranBoyutu: 'Ekran boyutu',
  renk: 'Renk',
  bellek: 'Bellek',
  baglanti: 'Bağlantı',
  kasaOlcusu: 'Kasa ölçüsü',
  kolAdedi: 'Kol adedi',
  pilSagligi: 'Pil sağlığı',
  depolamaSagligi: 'Depolama sağlığı',
  kutuFatura: 'Kutu / fatura',
  kalanGaranti: 'Kalan garanti',
  kozmetik: 'Kozmetik durum',
  adaptor: 'Adaptör',
  calisma: 'Çalışma durumu',
  ekBilgi: 'Ek bilgi',
}

function statusLabel(status: string) {
  if (status === 'teklif_var') return 'Teklif var'
  if (status === 'kapatildi') return 'Kapatıldı'
  return 'Teklif bekleniyor'
}

function fieldEntries(values: Record<string, string>) {
  return Object.entries(values).filter(([key]) => !key.endsWith('Diger'))
}

const money = new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' })

export function ListingDetail({
  token,
  listing,
  onBack,
  onUpdated,
}: {
  token: string
  listing: Listing
  onBack: () => void
  onUpdated: (listing: Listing) => void
}) {
  const [offers, setOffers] = useState<Offer[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [storeId, setStoreId] = useState('')
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    Promise.all([
      request<Offer[]>(`/admin/offers?listingId=${listing.id}`, token),
      request<Store[]>('/admin/stores', token),
    ])
      .then(([nextOffers, nextStores]) => {
        if (!active) return
        setOffers(nextOffers)
        setStores(nextStores)
      })
      .catch((reason: unknown) => {
        if (active) setError(reason instanceof Error ? reason.message : 'Teklifler alınamadı.')
      })
    return () => {
      active = false
    }
  }, [listing.id, token])

  const choices = stores.filter((store) => store.active)

  async function refresh() {
    const [nextOffers, nextListing] = await Promise.all([
      request<Offer[]>(`/admin/offers?listingId=${listing.id}`, token),
      request<Listing>(`/admin/listings/${listing.id}`, token),
    ])
    setOffers(nextOffers)
    onUpdated(nextListing)
  }

  async function submit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await request<Offer>('/admin/offers', token, {
        body: {
          listingId: listing.id,
          storeId,
          price: Number(price),
          note: note.trim() || undefined,
        },
      })
      setPrice('')
      setNote('')
      setStoreId('')
      await refresh()
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Teklif kaydedilemedi.')
    } finally {
      setBusy(false)
    }
  }

  async function closeListing() {
    setError('')
    try {
      const next = await request<Listing>(`/admin/listings/${listing.id}/close`, token, { method: 'POST' })
      onUpdated(next)
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'İlan kapatılamadı.')
    }
  }

  async function remove(offer: Offer) {
    setError('')
    try {
      await request(`/admin/offers/${offer.id}`, token, { method: 'DELETE' })
      await refresh()
    } catch (reason: unknown) {
      setError(reason instanceof Error ? reason.message : 'Teklif silinemedi.')
    }
  }

  return (
    <section className="panel">
      <button type="button" className="text" onClick={onBack}>
        İlanlara dön
      </button>
      <h1>{listing.title}</h1>
      <p>
        {listing.customer.name} · {listing.customer.email}
      </p>
      <p>
        {listing.category.name} / {listing.deviceType.name} · {statusLabel(listing.status)}
      </p>
      {listing.status === 'kapatildi' ? null : (
        <button type="button" className="text danger" onClick={() => void closeListing()}>
          İlanı kapat
        </button>
      )}
      <div className="photos">
        {listing.photos.map((photo) => (
          <img key={photo.id} src={photo.path} alt="" />
        ))}
      </div>
      <h2>Özellikler</h2>
      <FieldList values={listing.specs} />
      <h2>Durum</h2>
      <FieldList values={listing.condition} />

      <h2>Teklifler</h2>
      <p className="hint">Mağazanın bildirdiği tutarı yazın. Aynı mağaza yeniden seçilirse mevcut teklif güncellenir.</p>
      {error ? <p className="error">{error}</p> : null}
      {offers.length === 0 ? <p>Bu ilana henüz teklif işlenmedi.</p> : null}
      {offers.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Mağaza</th>
              <th>Şehir</th>
              <th>Fiyat</th>
              <th>Not</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer, index) => (
              <OfferRow
                key={offer.id}
                offer={offer}
                highest={index === 0}
                closed={listing.status === 'kapatildi'}
                token={token}
                onChanged={refresh}
                onRemove={() => remove(offer)}
                onError={setError}
              />
            ))}
          </tbody>
        </table>
      ) : null}

      {listing.status === 'kapatildi' ? (
        <p>Kapalı ilana yeni teklif eklenmez.</p>
      ) : (
        <form className="stack" onSubmit={submit}>
          <label>
            Mağaza
            <select value={storeId} onChange={(event) => setStoreId(event.target.value)} required>
              <option value="">Seçin</option>
              {choices.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name} · {store.city}
                </option>
              ))}
            </select>
          </label>
          {choices.length === 0 ? <p>Teklif için önce aktif bir mağaza kaydedin.</p> : null}
          <label>
            Bildirilen fiyat (TL)
            <input
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              inputMode="decimal"
              required
            />
          </label>
          <label>
            Panel notu
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={2}
              placeholder="Yalnız panelde görünür"
            />
          </label>
          <button type="submit" disabled={busy || choices.length === 0}>
            {busy ? 'Kaydediliyor…' : 'Teklifi kaydet'}
          </button>
        </form>
      )}
    </section>
  )
}

function OfferRow({
  offer,
  highest,
  closed,
  token,
  onChanged,
  onRemove,
  onError,
}: {
  offer: Offer
  highest: boolean
  closed: boolean
  token: string
  onChanged: () => Promise<void>
  onRemove: () => Promise<void>
  onError: (message: string) => void
}) {
  const [price, setPrice] = useState(String(offer.price))
  const [note, setNote] = useState(offer.note ?? '')
  const [busy, setBusy] = useState(false)

  async function save() {
    setBusy(true)
    onError('')
    try {
      await request<Offer>(`/admin/offers/${offer.id}`, token, {
        method: 'PATCH',
        body: { price: Number(price), note },
      })
      await onChanged()
    } catch (reason: unknown) {
      onError(reason instanceof Error ? reason.message : 'Teklif güncellenemedi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <tr>
      <td>
        {offer.store.name}
        {highest ? ' · En yüksek' : ''}
        {offer.store.active ? '' : ' · pasif'}
      </td>
      <td>{offer.store.city}</td>
      <td>
        {closed ? (
          money.format(offer.price)
        ) : (
          <input value={price} onChange={(event) => setPrice(event.target.value)} inputMode="decimal" />
        )}
      </td>
      <td>
        {closed ? (
          (offer.note ?? '—')
        ) : (
          <input value={note} onChange={(event) => setNote(event.target.value)} />
        )}
      </td>
      <td className="actions">
        {closed ? null : (
          <button type="button" className="text" disabled={busy} onClick={() => void save()}>
            Güncelle
          </button>
        )}
        <button type="button" className="text danger" onClick={() => void onRemove()}>
          Sil
        </button>
      </td>
    </tr>
  )
}

function FieldList({ values }: { values: Record<string, string> }) {
  return (
    <dl>
      {fieldEntries(values).map(([key, value]) => (
        <div key={key}>
          <dt>{labels[key] ?? key}</dt>
          <dd>{value === 'Diğer' ? (values[`${key}Diger`] ?? value) : value}</dd>
        </div>
      ))}
    </dl>
  )
}
