import './../App.css'
import { useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';

interface AppProps {
  goToPreparedList: () => void;
  goToAddOrders: () => void;
}

function App({goToPreparedList, goToAddOrders}: AppProps) {
  const navigate = useNavigate();
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

//    const goToPreparedList = () => {
//     navigate('/PreparedList');
//   };

  return (
    <>
      <main className="flex w-[1132px] flex-col gap-12">
        {/* HEADER */}
        <div className="flex items-center justify-between w-full max-full mx-auto mt-8">
          <div
            onClick={goToAddOrders}
            className="justify-center items-center flex-row hidden sm:flex cursor-pointer"
          >
            <img src="/logo.png" alt="Logo" className="h-5 w-3" />
            <span className="text-red-600 text-lg font-bold p-0">B</span>
            <span className="text-black/50 text-lg font-bold">ites.</span>
          </div>

          <div className="h-6 px-1 py-2.5 bg-orange-400 rounded-[50px] inline-flex flex-col justify-center items-center gap-2.5">
            <div className="text-center justify-start text-white text-xs">R 👩🏽‍🍳</div>
          </div>
        </div>

        {/* NAV */}
        <section className="flex flex-col items-center justify-center gap-4">
          <nav className="flex w-full items-center justify-between max-w-[1132px]">
            <div className="flex gap-2 items-center">
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#F6F6F6',
                  borderRadius: 36,
                  padding: 8,
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(-1)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M10 13L5 8L10 3"
                    stroke="black"
                    strokeOpacity="0.6"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <p className="text-black text-base font-bold">
                Upload Orders<span className="text-black/50 text-base font-normal">(2)</span>
              </p>
            </div>

            <div className="w-44">
              <PrimaryButton
                title="Prepare Order List"
                style={{
                  height: 40,
                  fontSize: 16,
                  fontWeight: '400'
                }}
                 onClick={goToPreparedList}
              />
            </div>
          </nav>

          {/* IMAGE UPLOAD SECTION */}
          <section className="w-full max-w-[1132px] flex flex-col items-center gap-2">
            <div className="grid grid-cols-6 md:grid-cols-6 gap-1 w-full justify-center">
              {/* Upload Placeholder */}
              <label
                htmlFor="imageUpload"
                className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer hover:bg-gray-50"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#999"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <p className="text-xs text-gray-500 mt-2">Upload Image</p>
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>

              {/* Preview Images */}
              {images.map((file, index) => (
                <div key={index} className="relative w-40 h-40">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Uploaded ${index}`}
                    className="w-full h-full object-cover rounded-2xl border border-gray-200"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

         
          </section>
        </section>
      </main>
    </>
  );
}

export default App;
