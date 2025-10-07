
import './../App.css'
import { useNavigate } from 'react-router-dom'

function App() {

    const navigate = useNavigate();


  return (
    <>
      <main className='flex flex-col items-center w-full'>
          

          <section className='flex flex-col w-full '>
              <div className='flex items-center justify-between w-[1132px] mt-8 '>
                    <div 
                     onClick={() => navigate('/AddOrders')}
                    className="justify-center items-center flex-row hidden sm:flex">
                      <img src="/logo.png" alt="Logo" className="h-5 w-3" />
                      <span className="text-red-600 text-lg font-bold p-0">B</span>
                      <span className="text-black/50 text-lg font-bold ">ites.</span>
                    </div>

                    <div className="h-6 px-1 py-2.5 bg-orange-400 rounded-[50px] inline-flex flex-col justify-center items-center gap-2.5">
                        <div className="text-center justify-start text-white text-xs">R 👩🏽‍🍳</div>
                    </div>
              </div>     
          </section>

          <section className='flex flex-col w-full items-center justify-center gap-4 mt-10'>
              <p className="text-black text-base text-left font-bold flex items-start justify-start w-96">Your Orders This Week <span className="text-black/50 text-base font-normal ">(6)</span></p>

          <div className="w-96 px-4 py-2 rounded-xl  outline-[0.50px] outline-offset-[-0.50px] outline-black/40 inline-flex justify-between items-center">
              <div className='flex items-center gap-2'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3542 13.86C13.6609 14.1667 14.1342 13.6934 13.8276 13.3934L11.3276 10.8867C12.2045 9.91638 12.6893 8.6546 12.6876 7.34671C12.6876 4.42004 10.3076 2.04004 7.38089 2.04004C4.45422 2.04004 2.07422 4.42004 2.07422 7.34671C2.07422 10.2734 4.45422 12.6534 7.38089 12.6534C8.70089 12.6534 9.92089 12.1667 10.8542 11.36L13.3542 13.86ZM2.74022 7.34671C2.74022 4.78671 4.82688 2.70671 7.38022 2.70671C9.94022 2.70671 12.0202 4.78671 12.0202 7.34671C12.0202 9.90671 9.94022 11.9867 7.38022 11.9867C4.82688 11.9867 2.74022 9.90671 2.74022 7.34671Z" fill="black" fill-opacity="0.6"/>
                  </svg>
              </div>
          </div>

          <main className='flex  w-96 flex-col items-center justify-center gap-4'>
              <nav className='flex w-full'>
                  <p className='text-green-600 text-sm pb-1 border-b-2 border-b-green-400 w-full'>Delivery</p>
                  <p className='text-black/50 text-sm pb-1 w-full  border-b-2 border-b-black/10'>Delivery</p>
              </nav>

              <section className='flex flex-col items-center justify-center gap-3 w-full'>
                  <div className='flex items-center justify-between w-full'>
                      <div className='flex gap-2 items-start justify-start'>
                          <p className='text-black/50 text-xs'>#011</p>
                          <div className='flex gap-1 flex-col items-start justify-start'>
                            <p className='text-black text-xs'>Nana Ama Amankwah</p>

                            <div className="flex justify-center items-center gap-2">
                              <p className=" text-black/60 text-[10px] font-normal">055 414 4611</p>
                              <div className="w-0 h-3 flex outline-1 outline-offset-[-0.50px] outline-gray-400"></div>
                              <p className=" text-black/50 text-[10px] ">Hall 7</p>
                          </div>
                         
                          </div>

                    

                      </div>
                      <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                            <p className="px-1 py-0.5 bg-neutral-50 rounded-xl text-Grey-Scale-Grey-Scale-600 text-xs ">Shawarma</p>
                        <p className="justify-start text-Grey-Scale-Grey-Scale-600 text-xs font-normal">GHC 65</p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between w-full'>
                      <div className='flex gap-2 items-start justify-start'>
                          <p className='text-black/50 text-xs'>#011</p>
                          <div className='flex gap-1 flex-col items-start justify-start'>
                            <p className='text-black text-xs'>Nana Ama Amankwah</p>

                            <div className="flex justify-center items-center gap-2">
                              <p className=" text-black/60 text-[10px] font-normal">055 414 4611</p>
                              <div className="w-0 h-3 flex outline-1 outline-offset-[-0.50px] outline-gray-400"></div>
                              <p className=" text-black/50 text-[10px] ">Hall 7</p>
                          </div>
                         
                          </div>

                    

                      </div>
                      <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                            <p className="px-1 py-0.5 bg-neutral-50 rounded-xl text-Grey-Scale-Grey-Scale-600 text-xs ">Shawarma</p>
                        <p className="justify-start text-Grey-Scale-Grey-Scale-600 text-xs font-normal">GHC 65</p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between w-full'>
                      <div className='flex gap-2 items-start justify-start'>
                          <p className='text-black/50 text-xs'>#011</p>
                          <div className='flex gap-1 flex-col items-start justify-start'>
                            <p className='text-black text-xs'>Nana Ama Amankwah</p>

                            <div className="flex justify-center items-center gap-2">
                              <p className=" text-black/60 text-[10px] font-normal">055 414 4611</p>
                              <div className="w-0 h-3 flex outline-1 outline-offset-[-0.50px] outline-gray-400"></div>
                              <p className=" text-black/50 text-[10px] ">Hall 7</p>
                          </div>
                         
                          </div>

                    

                      </div>
                      <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                            <p className="px-1 py-0.5 bg-neutral-50 rounded-xl text-Grey-Scale-Grey-Scale-600 text-xs ">Shawarma</p>
                        <p className="justify-start text-Grey-Scale-Grey-Scale-600 text-xs font-normal">GHC 65</p>
                    </div>
                  </div>

                  <div className='flex items-center justify-between w-full'>
                      <div className='flex gap-2 items-start justify-start'>
                          <p className='text-black/50 text-xs'>#011</p>
                          <div className='flex gap-1 flex-col items-start justify-start'>
                            <p className='text-black text-xs'>Nana Ama Amankwah</p>

                            <div className="flex justify-center items-center gap-2">
                              <p className=" text-black/60 text-[10px] font-normal">055 414 4611</p>
                              <div className="w-0 h-3 flex outline-1 outline-offset-[-0.50px] outline-gray-400"></div>
                              <p className=" text-black/50 text-[10px] ">Hall 7</p>
                          </div>
                         
                          </div>

                    

                      </div>
                      <div className="self-stretch inline-flex justify-center items-center gap-2.5">
                            <p className="px-1 py-0.5 bg-neutral-50 rounded-xl text-Grey-Scale-Grey-Scale-600 text-xs ">Shawarma</p>
                        <p className="justify-start text-Grey-Scale-Grey-Scale-600 text-xs font-normal">GHC 65</p>
                    </div>
                  </div>
              </section>
          </main>

          </section>

      </main>
    </>
  )
}

export default App
