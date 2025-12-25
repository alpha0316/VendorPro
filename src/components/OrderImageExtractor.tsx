import './../App.css'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Tesseract from 'tesseract.js'
import PrimaryButton from '../components/PrimaryButton'

interface ExtractedOrder {
  image: File
  name: string
  phone: string
  location: string
  product: string
  amount: string
  rawText: string
}

function UploadOrders() {
  const navigate = useNavigate()

  const [images, setImages] = useState<File[]>([])
  const [orders, setOrders] = useState<ExtractedOrder[]>([])
  const [loading, setLoading] = useState(false)

  /* -------------------- OCR PARSER -------------------- */
  const extractOrderFromText = (text: string, image: File): ExtractedOrder => {
    const phoneMatch = text.match(/0\d{9}/)
    const amountMatch = text.match(/(GHC|GH¢|₵)\s?\d+/i)

    const lines = text
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean)

    const name =
      lines.find(l =>
        /^[A-Z][a-z]+(\s[A-Z][a-z]+)+$/.test(l)
      ) || ''

    const location =
      lines.find(l =>
        /(hall|hostel|room|block|campus)/i.test(l)
      ) || ''

    const product =
      lines.find(
        l =>
          l !== name &&
          !l.includes(phoneMatch?.[0] || '') &&
          !l.includes(amountMatch?.[0] || '') &&
          l.length > 3
      ) || ''

    return {
      image,
      name,
      phone: phoneMatch?.[0] || '',
      location,
      product,
      amount: amountMatch?.[0] || '',
      rawText: text
    }
  }

  /* -------------------- IMAGE UPLOAD -------------------- */
  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (!files.length) return

    setImages(prev => [...prev, ...files])
    setLoading(true)

    for (const file of files) {
      const { data } = await Tesseract.recognize(file, 'eng')

      const extracted = extractOrderFromText(data.text, file)
      setOrders(prev => [...prev, extracted])
    }

    setLoading(false)
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    setOrders(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <main className="flex w-[1132px] flex-col gap-12 mx-auto mt-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <img src="/logo.png" alt="Logo" className="h-5 w-3" />
          <span className="text-red-600 font-bold">B</span>
          <span className="text-black/50 font-bold">ites.</span>
        </div>

        <div className="h-6 px-3 bg-orange-400 rounded-full flex items-center text-white text-xs">
          R 👩🏽‍🍳
        </div>
      </div>

      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">
          Upload Orders{' '}
          <span className="text-black/50 font-normal">
            ({orders.length})
          </span>
        </h1>

        <div className="w-44">
          <PrimaryButton
            title="Prepare Order List"
            onClick={() => console.log(orders)}
          />
        </div>
      </div>

      {/* UPLOAD GRID */}
      <section className="grid grid-cols-6 gap-3">
        {/* Upload box */}
        <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-gray-50">
          <span className="text-3xl text-gray-400">+</span>
          <p className="text-xs text-gray-500 mt-2">Upload Image</p>
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImageUpload}
          />
        </label>

        {/* Image previews */}
        {images.map((file, index) => (
          <div key={index} className="relative w-40 h-40">
            <img
              src={URL.createObjectURL(file)}
              alt="Order"
              className="w-full h-full object-cover rounded-2xl border"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </section>

      {/* LOADING */}
      {loading && (
        <p className="text-sm text-gray-500">
          Reading order details from images…
        </p>
      )}

      {/* EXTRACTED DATA */}
      {orders.length > 0 && (
        <section className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            Extracted Orders
          </h2>

          {orders.map((order, index) => (
            <div
              key={index}
              className="border rounded-xl p-4 grid grid-cols-5 gap-4 text-sm"
            >
              <div>
                <p className="text-black/40">Name</p>
                <p>{order.name || '-'}</p>
              </div>

              <div>
                <p className="text-black/40">Phone</p>
                <p>{order.phone || '-'}</p>
              </div>

              <div>
                <p className="text-black/40">Location</p>
                <p>{order.location || '-'}</p>
              </div>

              <div>
                <p className="text-black/40">Product</p>
                <p>{order.product || '-'}</p>
              </div>

              <div>
                <p className="text-black/40">Amount</p>
                <p>{order.amount || '-'}</p>
              </div>
            </div>
          ))}
        </section>
      )}
    </main>
  )
}

export default UploadOrders
