
import './../App.css'



function App() {

  // const navigate = useNavigate();


  return (
    <>
      <main className='flex flex-col items-center justify-center w-full '>

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

        <main className='w-100 flex flex-col items-start justify-center  gap-3'>
          <nav className='w-full flex items-center justify-between'>
            <p className='text-black text-base text-left font-bold flex items-start justify-start'>Your Riders</p>
            <div className="inline-flex justify-start items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8H12" stroke="green" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8 12V4" stroke="green" stroke-opacity="0.6" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <div className="justify-start text-green-600 text-xs font-semibold ">Add Driver</div>
            </div>
          </nav>


          <main className='w-full flex flex-col gap-3 p-4 bg-neutral-50 rounded-2xl'>
            <div className='w-full items-start justify-between flex'>
              <figure className='w-14 h-14 bg-neutral-100 rounded-full flex flex-col items-center justify-center gap-2'>

              </figure>

              <div className="w-9 h-9 p-2.5 bg-neutral-50 rounded-3xl inline-flex justify-center items-center gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M14.0471 3.48668C12.9738 3.38001 11.9004 3.30001 10.8204 3.24001V3.23334L10.6738 2.36668C10.5738 1.75334 10.4271 0.833344 8.8671 0.833344H7.12043C5.5671 0.833344 5.42043 1.71334 5.31376 2.36001L5.17376 3.21334C4.55376 3.25334 3.93376 3.29334 3.31376 3.35334L1.95376 3.48668C1.67376 3.51334 1.47376 3.76001 1.50043 4.03334C1.5271 4.30668 1.7671 4.50668 2.0471 4.48001L3.4071 4.34668C6.90043 4.00001 10.4204 4.13334 13.9538 4.48668C13.9738 4.48668 13.9871 4.48668 14.0071 4.48668C14.2604 4.48668 14.4804 4.29334 14.5071 4.03334C14.5271 3.76001 14.3271 3.51334 14.0471 3.48668Z" fill="black" fill-opacity="0.5" />
                  <path d="M12.8202 5.42666C12.6602 5.25999 12.4402 5.16666 12.2135 5.16666H3.78683C3.56016 5.16666 3.33349 5.25999 3.18016 5.42666C3.02683 5.59332 2.94016 5.81999 2.95349 6.05332L3.36683 12.8933C3.44016 13.9067 3.53349 15.1733 5.86016 15.1733H10.1402C12.4668 15.1733 12.5602 13.9133 12.6335 12.8933L13.0468 6.05999C13.0602 5.81999 12.9735 5.59332 12.8202 5.42666ZM9.10683 11.8333H6.88683C6.61349 11.8333 6.38683 11.6067 6.38683 11.3333C6.38683 11.06 6.61349 10.8333 6.88683 10.8333H9.10683C9.38016 10.8333 9.60683 11.06 9.60683 11.3333C9.60683 11.6067 9.38016 11.8333 9.10683 11.8333ZM9.66683 9.16666H6.33349C6.06016 9.16666 5.83349 8.93999 5.83349 8.66666C5.83349 8.39332 6.06016 8.16666 6.33349 8.16666H9.66683C9.94016 8.16666 10.1668 8.39332 10.1668 8.66666C10.1668 8.93999 9.94016 9.16666 9.66683 9.16666Z" fill="black" fill-opacity="0.5" />
                </svg>
              </div>

            </div>

            <section className='w-full flex gap-2 items-center justify-start'>
              <p className='text-black text-base font-semibold'>John Doe</p>
              <div className='w-1 h-1 rounded-full bg-neutral-200' />
              <p className='text-black/50 text-sm '>08123456789</p>
            </section>

            <section className='w-full flex gap-2 items-center justify-start'>
              <p className='text-black text-xs font-semibold'>24 <span className='text-black/50 font-normal'>Total Rides</span> </p>
              <div className='w-1 h-1 rounded-full bg-neutral-200' />
              <p className='text-black text-xs font-semibold'>26/12/25<span className='text-black/50 font-normal'> Date Added</span> </p>
              <div className='w-1 h-1 rounded-full bg-neutral-200' />
              <p className='text-black text-xs font-semibold'>4.6<span className='text-black/50 font-normal'> Rating</span> </p>
            </section>
          </main>

          <main className='w-full flex flex-col gap-3 p-4 bg-neutral-50 rounded-2xl'>
            <div className='w-full items-start justify-between flex'>
              <figure className='w-14 h-14 bg-neutral-100 rounded-full flex flex-col items-center justify-center gap-2'>

              </figure>


              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M14.0471 3.48668C12.9738 3.38001 11.9004 3.30001 10.8204 3.24001V3.23334L10.6738 2.36668C10.5738 1.75334 10.4271 0.833344 8.8671 0.833344H7.12043C5.5671 0.833344 5.42043 1.71334 5.31376 2.36001L5.17376 3.21334C4.55376 3.25334 3.93376 3.29334 3.31376 3.35334L1.95376 3.48668C1.67376 3.51334 1.47376 3.76001 1.50043 4.03334C1.5271 4.30668 1.7671 4.50668 2.0471 4.48001L3.4071 4.34668C6.90043 4.00001 10.4204 4.13334 13.9538 4.48668C13.9738 4.48668 13.9871 4.48668 14.0071 4.48668C14.2604 4.48668 14.4804 4.29334 14.5071 4.03334C14.5271 3.76001 14.3271 3.51334 14.0471 3.48668Z" fill="black" fill-opacity="0.5" />
                <path d="M12.8202 5.42666C12.6602 5.25999 12.4402 5.16666 12.2135 5.16666H3.78683C3.56016 5.16666 3.33349 5.25999 3.18016 5.42666C3.02683 5.59332 2.94016 5.81999 2.95349 6.05332L3.36683 12.8933C3.44016 13.9067 3.53349 15.1733 5.86016 15.1733H10.1402C12.4668 15.1733 12.5602 13.9133 12.6335 12.8933L13.0468 6.05999C13.0602 5.81999 12.9735 5.59332 12.8202 5.42666ZM9.10683 11.8333H6.88683C6.61349 11.8333 6.38683 11.6067 6.38683 11.3333C6.38683 11.06 6.61349 10.8333 6.88683 10.8333H9.10683C9.38016 10.8333 9.60683 11.06 9.60683 11.3333C9.60683 11.6067 9.38016 11.8333 9.10683 11.8333ZM9.66683 9.16666H6.33349C6.06016 9.16666 5.83349 8.93999 5.83349 8.66666C5.83349 8.39332 6.06016 8.16666 6.33349 8.16666H9.66683C9.94016 8.16666 10.1668 8.39332 10.1668 8.66666C10.1668 8.93999 9.94016 9.16666 9.66683 9.16666Z" fill="black" fill-opacity="0.5" />
              </svg>


            </div>

            <section className='w-full flex gap-2 items-center justify-start'>
              <p className='text-black text-base font-semibold'>John Doe</p>
              <div className='w-1 h-1 rounded-full bg-neutral-200' />
              <p className='text-black/50 text-sm '>08123456789</p>
            </section>

            <section className='w-full flex gap-2 items-center justify-start'>
              <p className='text-black text-xs font-semibold'>24 <span className='text-black/50 font-normal'>Total Rides</span> </p>
              <div className='w-1 h-1 rounded-full bg-neutral-200' />
              <p className='text-black text-xs font-semibold'>26/12/25<span className='text-black/50 font-normal'> Date Added</span> </p>
              <div className='w-1 h-1 rounded-full bg-neutral-200' />
              <p className='text-black text-xs font-semibold'>4.6<span className='text-black/50 font-normal'> Rating</span> </p>
            </section>
          </main>

        </main>

      </main>
    </>
  )
}

export default App
