import { useState } from 'react';

function PrimaryButton({ title, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="px-6 py-3 bg-orange-400 text-white rounded-full font-semibold hover:bg-orange-500 transition-colors"
    >
      🍴 {title}
    </button>
  );
}

function App({ goToOrderImages = () => {}, goToAddOrders = () => {}, goToCopyAndPaste = () => {} }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <main className='flex w-full flex-col gap-34'>

      <div className='flex items-center justify-between w-[1132px] mt-8 '>
            <div 
             onClick={goToAddOrders}
            className="justify-center items-center flex-row hidden sm:flex cursor-pointer">
              <img src="/logo.png" alt="Logo" className="h-5 w-3" />
              <span className="text-red-600 text-lg font-bold p-0">B</span>
              <span className="text-black/50 text-lg font-bold ">ites.</span>
            </div>

            <div className="h-6 px-1 py-2.5 bg-orange-400 rounded-[50px] inline-flex flex-col justify-center items-center gap-2.5">
                <div className="text-center justify-start text-white text-xs">R 👩🏽‍🍳</div>
            </div>
      </div>

        <section className='flex flex-col items-center justify-center gap-12'>
            <main>
                <figure className="relative left-44 z-50 px-4 py-6 bg-gray-100 rounded-2xl  outline-[3px] outline-offset-[-3px] outline-white inline-flex flex-col justify-start items-center gap-3.5">
                    <div className="w-16 h-16 relative bg-green-500 rounded-[100px] overflow-hidden">
                        <div className="w-24 left-[-17.12px] top-[10.20px] absolute text-center justify-start text-black text-5xl font-bold">🧕🏽</div>
                    </div>

                    <p className="self-stretch text-center justify-start text-black text-sm font-bold">Suad M.🧕🏽</p>

                    <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                        <div className="flex justify-start items-center gap-0.5">
                            <p className="justify-start text-Grey-Scale-Grey-Scale-600 text-xs ">Shawarma</p>
                            <img src="/logo.png" alt="Logo" className="w-1.5 h-2.5" />
                        </div>
                        <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                        <p className="justify-start text-Grey-Scale-Grey-Scale-600 text-xs font-normal">GHC 65</p>
                    </div>

                    <div className="flex justify-center items-center gap-2" >
                        <p className="justify-start text-black text-xs font-normal ">055 414 4611</p>
                        <div className="w-0 h-3 origin-top-left outline-1 outline-offset-[-0.50px] outline-gray-400"></div>
                        <p className="justify-start text-black/50 text-xs font-normal ">Hall 7</p>
                    </div>

                </figure>
                 <figure className="relative left-17 z-10 bottom-7 rotate-[12.75deg]  px-4 py-6 bg-gray-100 rounded-2xl  outline-[3px] outline-offset-[-3px] outline-white inline-flex flex-col justify-start items-center gap-3.5">
                    <div className="w-16 h-16 relative bg-[#D2AA19] rounded-[100px] overflow-hidden">
                        <div className="w-24 left-[-17.12px] top-[10.20px] absolute text-center justify-start text-black text-5xl font-bold"></div>
                    </div>

                    <p className="self-stretch text-center justify-start text-black text-sm font-bold">Suad M.🧕🏽</p>

                    <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                        <div className="flex justify-start items-center gap-0.5">
                            <p className="justify-start text-Grey-Scale-Grey-Scale-600 text-xs ">Shawarma</p>
                            <img src="/logo.png" alt="Logo" className="w-1.5 h-2.5" />
                        </div>
                        <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                        <p className="justify-start text-Grey-Scale-Grey-Scale-600 text-xs font-normal">GHC 65</p>
                    </div>

                    <div className="flex justify-center items-center gap-2" >
                        <p className="justify-start text-black text-xs font-normal ">055 414 4611</p>
                        <div className="w-0 h-3 origin-top-left outline-1 outline-offset-[-0.50px] outline-gray-400"></div>
                        <p className="justify-start text-black/50 text-xs font-normal ">Hall 7</p>
                    </div>

                </figure>
                  <figure className="relative right-56 bottom-17 rotate-[-15.79deg] px-4 py-6 bg-gray-100 rounded-2xl  outline-[3px] outline-offset-[-3px] outline-white inline-flex flex-col justify-start items-center gap-3.5">
                    <div className="w-16 h-16 relative bg-[#F6CCCC] rounded-[100px] overflow-hidden">
                        <div className="w-24 left-[-17.12px] top-[10.20px] absolute text-center justify-start text-black text-5xl font-bold"></div>
                    </div>

                    <p className="self-stretch text-center justify-start text-black text-sm font-bold">Suad M.🧕🏽</p>

                    <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                        <div className="flex justify-start items-center gap-0.5">
                            <p className="justify-start text-Grey-Scale-Grey-Scale-600 text-xs ">Shawarma</p>
                            <img src="/logo.png" alt="Logo" className="w-1.5 h-2.5" />
                        </div>
                        <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                        <p className="justify-start text-Grey-Scale-Grey-Scale-600 text-xs font-normal">GHC 65</p>
                    </div>

                    <div className="flex justify-center items-center gap-2" >
                        <p className="justify-start text-black text-xs font-normal ">055 414 4611</p>
                        <div className="w-0 h-3 origin-top-left outline-1 outline-offset-[-0.50px] outline-gray-400"></div>
                        <p className="justify-start text-black/50 text-xs font-normal ">Hall 7</p>
                    </div>

                </figure>
            </main>

            <section className='flex flex-col items-center justify-center gap-6'>
                <div className="w-60 inline-flex flex-col justify-start items-center gap-1.5">
                    <p className="self-stretch text-center justify-start text-black text-3xl font-medium ">Hiii Rashida ✨👩🏽‍🍳</p>
                    <p className="self-stretch text-center justify-start text-black/50 text-xs font-medium">You have not uploaded any order for this week yet 💁🏽‍♀️</p>
                </div>

                <PrimaryButton title='Add Orders' onClick={openModal}/>
            </section>

        </section>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50 pb-24" onClick={closeModal}>
            <div className="bg-white rounded-3xl p-4 w-[550px] max-w-[90vw] flex flex-col gap-4 mb-4" onClick={(e) => e.stopPropagation()}>
              
              <section 
                onClick={() => {
                  closeModal();
                  goToOrderImages();
                }}
                className='w-full bg-white p-4 rounded-2xl flex justify-start items-start gap-2.5 border border-black/10 hover:border-orange-400 transition-colors cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
                    <path d="M14.4534 11.3067L12.3668 6.43334C11.6601 4.78 10.3601 4.71334 9.48678 6.28667L8.22678 8.56C7.58678 9.71334 6.39345 9.81334 5.56678 8.78L5.42011 8.59334C4.56011 7.51334 3.34678 7.64667 2.72678 8.88L1.58011 11.18C0.773447 12.78 1.94011 14.6667 3.72678 14.6667H12.2334C13.9668 14.6667 15.1334 12.9 14.4534 11.3067Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4.64648 5.33337C5.75105 5.33337 6.64648 4.43794 6.64648 3.33337C6.64648 2.2288 5.75105 1.33337 4.64648 1.33337C3.54191 1.33337 2.64648 2.2288 2.64648 3.33337C2.64648 4.43794 3.54191 5.33337 4.64648 5.33337Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <div className="self-stretch inline-flex flex-col justify-start items-start gap-2">
                    <p className="self-stretch justify-start text-black text-base font-semibold text-left">Upload Screenshots</p>
                    <p className="self-stretch justify-start text-black/50 text-sm font-normal text-left">Snap or upload your order screenshots — we'll automatically extract and organize the details for you.</p>
                </div>
              </section>

              <section 
                onClick={() => {
                  closeModal();
                  goToCopyAndPaste();
                }}
                className='w-full bg-white p-4 rounded-2xl flex justify-start items-start gap-2.5 border border-black/10 hover:border-orange-400 transition-colors cursor-pointer'>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
                <path d="M10.6668 8.60004V11.4C10.6668 13.7334 9.7335 14.6667 7.40016 14.6667H4.60016C2.26683 14.6667 1.3335 13.7334 1.3335 11.4V8.60004C1.3335 6.26671 2.26683 5.33337 4.60016 5.33337H7.40016C9.7335 5.33337 10.6668 6.26671 10.6668 8.60004Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14.6668 4.60004V7.40004C14.6668 9.73337 13.7335 10.6667 11.4002 10.6667H10.6668V8.60004C10.6668 6.26671 9.7335 5.33337 7.40016 5.33337H5.3335V4.60004C5.3335 2.26671 6.26683 1.33337 8.60016 1.33337H11.4002C13.7335 1.33337 14.6668 2.26671 14.6668 4.60004Z" stroke="black" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>

                <div className="self-stretch inline-flex flex-col justify-start items-start gap-2">
                    <p className="self-stretch justify-start text-black text-base font-semibold text-left">Copy And Paste Orders</p>
                    <p className="self-stretch justify-start text-black/50 text-sm font-normal text-left">Simply paste your order text, and we'll sort everything neatly in seconds.</p>
                </div>
              </section>

              <section 
                onClick={() => {
                  closeModal();
                  goToAddOrders();
                }}
                className='w-full bg-white p-4 rounded-2xl flex justify-start items-start gap-2.5 border border-black/10 hover:border-orange-400 transition-colors cursor-pointer'>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="none">
                    <path d="M8.84006 2.39994L3.36673 8.19327C3.16006 8.41327 2.96006 8.84661 2.92006 9.14661L2.6734 11.3066C2.58673 12.0866 3.14673 12.6199 3.92006 12.4866L6.06673 12.1199C6.36673 12.0666 6.78673 11.8466 6.9934 11.6199L12.4667 5.82661C13.4134 4.82661 13.8401 3.68661 12.3667 2.29327C10.9001 0.913274 9.78673 1.39994 8.84006 2.39994Z" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.92676 3.3667C8.21342 5.2067 9.70676 6.61337 11.5601 6.80003" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 14.6666H14" stroke="black" strokeOpacity="0.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>

                <div className="self-stretch inline-flex flex-col justify-start items-start gap-2">
                    <p className="self-stretch justify-start text-black text-base font-semibold text-left">Type your orders</p>
                    <p className="self-stretch justify-start text-black/50 text-sm font-normal text-left">Prefer manual entry? Add your order details one step at a time, quickly and accurately.</p>
                </div>
              </section>
              
            </div>
          </div>
        )}

      </main>
    </>
  )
}

export default App