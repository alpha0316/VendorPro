import './../App.css'

interface AppProps {
  goToPreparedList: () => void;
  goToAddOrders: () => void;
}

function App({ goToAddOrders }: AppProps) {
  return (
    <main className="flex flex-col items-center w-full min-h-screen px-4 sm:px-6 md:px-8">

      {/* HEADER */}
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto mt-4 sm:mt-6 md:mt-8">
        <div
          onClick={goToAddOrders}
          className="flex items-center cursor-pointer"
        >
          <img src="/logo.png" alt="Logo" className="h-4 sm:h-5 w-2.5 sm:w-3" />
          <span className="text-red-600 text-base sm:text-lg font-bold">B</span>
          <span className="text-black/50 text-base sm:text-lg font-bold">ites.</span>
        </div>

        <div className="h-5 sm:h-6 px-1 sm:px-1.5 py-1.5 sm:py-2.5 bg-orange-400 rounded-[50px] flex items-center justify-center">
          <div className="text-center text-white text-xs">R 👩🏽‍🍳</div>
        </div>
      </div>

      {/* CONTENT — top-aligned on mobile, shifted up on desktop */}
      <section className="
        flex flex-col gap-4 w-full max-w-2xl mx-auto
        mt-8
        sm:min-h-[calc(100vh-80px)] sm:justify-start sm:-mt-24
      ">
        <div className="flex flex-col gap-3.5">
          <p className="text-black text-2xl sm:text-3xl font-bold text-left leading-snug">
            Paste Your Orders —<br className="hidden sm:block" /> We'll Handle the Rest ✨
          </p>
          <p className="text-black/50 text-sm font-normal text-left">
            Simply paste your raw order messages from WhatsApp, Telegram, or anywhere else.
            Our system will automatically extract names, numbers, and order details — ready for review.
          </p>
        </div>

        <div className="w-full h-52 bg-neutral-50 rounded-2xl outline outline-black/5 flex flex-col items-start justify-between p-4">
          <input
            type="text"
            placeholder="What's cooking today?"
            className="w-full bg-transparent rounded-2xl outline-none placeholder:text-black/30 text-black/50 text-sm font-normal"
          />

          <div className="w-full flex items-end justify-end">
            <div className="p-1.5 bg-orange-400 rounded-lg cursor-pointer hover:bg-orange-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M9.62 3.95312L13.6667 7.99979L9.62 12.0465" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2.33337 8H13.5534" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

export default App;