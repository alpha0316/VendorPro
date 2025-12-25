import './../App.css';
import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import PrimaryButton from '../components/PrimaryButton';

interface ExtractedOrder {
  image: File;
  rawText: string;
  name: string;
  phone: string;
  product: string;
  amount: string;
  location: string;
}

interface OrderImagesProps {
  goToPreparedList: (orders: ExtractedOrder[]) => void;
  goBackToAddOrders: () => void;
}

const OrderImages: React.FC<OrderImagesProps> = ({ goToPreparedList }) => {
  const [images, setImages] = useState<File[]>([]);
  const [orders, setOrders] = useState<ExtractedOrder[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- IMAGE UPLOAD ---------------- */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setOrders(prev => prev.filter((_, i) => i !== index));
  };

  /* ---------------- OCR + PARSE ---------------- */
  const extractFromImage = async (file: File): Promise<ExtractedOrder> => {
    const result = await Tesseract.recognize(file, 'eng');
    const rawText = result.data.text;

    const lines = rawText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    const phone = lines.find(l => /0\d{9}/.test(l)) || '';

    const amountMatch =
      rawText.match(/(₵|GHC|GH¢)\s?\d+/i) ||
      rawText.match(/\b\d{2,4}\b/);

    const amount = amountMatch ? amountMatch[0].replace(/\D/g, '') : '';

    const name =
      lines.find(l => /^[A-Z][a-z]+(\s[A-Z][a-z]+)?$/.test(l)) || '';

    const location =
      lines.find(l =>
        l.toLowerCase().includes('hall') ||
        l.toLowerCase().includes('hostel') ||
        l.toLowerCase().includes('brunei') ||
        l.toLowerCase().includes('campus')
      ) || '';

    const productLine =
      lines.find(l => l.includes(amount)) ||
      lines.find(l =>
        l !== name &&
        l !== phone &&
        l !== location
      );

    const product = productLine
      ? productLine.replace(amount, '').trim()
      : '';

    return {
      image: file,
      rawText,
      name,
      phone,
      product,
      amount,
      location
    };
  };

  /* ---------------- AUTO PROCESS IMAGES ---------------- */
  useEffect(() => {
    if (images.length === 0) return;

    const process = async () => {
      setLoading(true);
      const extracted: ExtractedOrder[] = [];

      for (const img of images) {
        const data = await extractFromImage(img);
        extracted.push(data);
      }

      setOrders(extracted);
      setLoading(false);

      console.log('Extracted Orders:', extracted);
    };

    process();
  }, [images]);

  /* ---------------- NAVIGATE WITH DATA ---------------- */
  const handlePrepareOrderList = () => {
    goToPreparedList(orders);
    
  };

  return (
    <main className="flex w-[1132px] flex-col gap-10 mx-auto mt-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">
          Upload Orders
          <span className="text-black/50 font-normal"> ({images.length})</span>
        </p>

        <div className="w-48">
          <PrimaryButton
            title="Prepare Order List"
            onClick={handlePrepareOrderList}
            disabled={orders.length === 0 || loading}
          />
        </div>
      </div>

      {/* IMAGE GRID */}
      <section className="grid grid-cols-6 gap-2">
        {/* UPLOAD */}
        <label className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed rounded-xl cursor-pointer">
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <span className="text-xs text-gray-500">Upload Image</span>
        </label>

        {/* PREVIEWS */}
        {images.map((file, index) => (
          <div key={index} className="relative w-40 h-40">
            <img
              src={URL.createObjectURL(file)}
              className="w-full h-full object-cover rounded-xl border"
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6"
            >
              ×
            </button>
          </div>
        ))}
      </section>

      {loading && (
        <p className="text-sm text-gray-500">Extracting data from images…</p>
      )}
    </main>
  );
};

export default OrderImages;