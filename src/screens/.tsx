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
          <nav className="flex w-full items-center justify-between max-w-[632px]">
            <div className="flex gap-3 items-center">
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

            </div>

          
          </nav>

          <main className='flex flex-col items-start justify-center gap-4'>
              <div className="w-[632px] inline-flex flex-col justify-start items-start gap-3.5">
                  <p className="self-stretch justify-start text-black text-3xl font-bold text-left">Paste Your Orders — We’ll Handle the Rest ✨</p>
                  <p className="justify-start text-black/50 text-sm font-normal text-left">Simply paste your raw order messages from WhatsApp, Telegram, or anywhere else.  Our system will automatically extract names, numbers, and order details — ready for review</p>
              </div>

              <section className='w-full h-52 bg-neutral-50 rounded-2xl outline-1 outline-black/5 flex flex-col items-start justify-between p-4 '>
                  <input 
                    type="text"
                    placeholder='What’s cooking today?'
                    className='rounded-2xl outline-none placeholder:text-black/30 text-black/50 text-sm font-normal flex items-start justify-start'
                    />

                    <div className='w-full items-end justify-end flex'>
                      <div className='p-1.5 bg-orange-400 rounded-lg cursor-pointer'>
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M9.62 3.95312L13.6667 7.99979L9.62 12.0465" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M2.33337 8H13.5534" stroke="white" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                      </div>
                    </div>
              </section>
          </main>

        </section>
      </main>
    </>
  );
}


export default App;
