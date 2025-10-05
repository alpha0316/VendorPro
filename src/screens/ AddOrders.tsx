
import './../App.css'
import { useState, useEffect, useRef, useMemo } from 'react';
import PrimaryButton from '../Components/PrimaryButton';
import { useNavigate } from 'react-router-dom'


function App({ goToOrderImages, goToAddOrders }: { 
  goToOrderImages: () => void; 
  goToAddOrders: () => void; 
}) {


  return (
    <>
      <main className='flex w-full flex-col gap-34'>

      <div className='flex items-center justify-between w-[1132px] mt-8 '>
            <div 

             onClick={goToAddOrders} // 👈 this makes the logo clickable
            className="justify-center items-center flex-row hidden sm:flex">
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

                <PrimaryButton title='Add Orders' onClick={goToOrderImages}/>
            </section>

        </section>

      </main>
    </>
  )
}

export default App
