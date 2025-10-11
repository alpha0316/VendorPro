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

    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
    // Sample orders data
    const orders = [
      { id: '011', name: 'Prince', phone: '055 414 4611', hall: 'Suncity', item: 'Jollof', price: 'GHC 60' },
      // { id: '012', name: 'Kwame Mensah', phone: '055 555 1234', hall: 'Hall 3', item: 'Pizza', price: 'GHC 45' },
      // { id: '013', name: 'Ama Serwaa', phone: '055 678 9012', hall: 'Hall 5', item: 'Jollof', price: 'GHC 30' },
      { id: '014', name: 'Kofi Asante', phone: '055 321 7654', hall: 'Hall 2', item: 'Banku', price: 'GHC 40' },
    ];


  const toggleOrderSelection = (orderId) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const selectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  const handleAssignToRiders = () => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order');
      return;
    }
    // Here you would implement the rider assignment logic
    alert(`Assigning ${selectedOrders.length} order(s) to riders`);
  };



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
        <section className="flex flex-col items-center justify-center gap-4 ">
          <nav className="flex w-full items-center justify-between max-w-[580px] ">
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

          <main className='flex flex-col items-start justify-center gap-8'>
              <div className="w-[580px] inline-flex flex-col justify-start items-start gap-3.5">
                  <p className="self-stretch justify-start text-black text-3xl font-bold text-left">Type Your Orders 📝</p>
                  <p className="justify-start text-black/50 text-sm font-normal text-left">Prefer manual entry? Add your order details one step at a time — quickly and accurately</p>
              </div>

              <section className='flex flex-col w-full items-start justify-start gap-1'>

                <main className='flex gap-4 h-40'>
                        <figure className='relative'>
                       <svg xmlns="http://www.w3.org/2000/svg" width="251" height="156" viewBox="0 0 251 156" fill="none">
                        <g filter="url(#filter0_d_17069_2354)">
                          <path d="M245.598 0.591648C224.419 0.818174 77.7369 2.86557 7.04306 3.86096C5.22556 12.6248 6.69906 101.745 7.663 145.21C34.2563 144.746 178.178 142.114 246.815 140.857C245.844 127.561 245.599 41.8067 245.598 0.591648Z" fill="#FDF5A3"/>
                        </g>
                        <defs>
                          <filter id="filter0_d_17069_2354" x="0.18103" y="0.591797" width="250.634" height="154.618" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                            <feOffset dx="-1" dy="5"/>
                            <feGaussianBlur stdDeviation="2.5"/>
                            <feComposite in2="hardAlpha" operator="out"/>
                            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0"/>
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_17069_2354"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_17069_2354" result="shape"/>
                          </filter>
                        </defs>
                      </svg>
 
                      <div className='relative bottom-45 left-55'>
                       <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50" fill="none">
                          <path d="M22.7738 18.9627C25.5514 20.3081 27.6672 22.3011 28.8531 24.4117C30.0399 26.5241 30.2758 28.7081 29.4041 30.5078C28.5324 32.3074 26.6725 33.4762 24.2793 33.8545C21.888 34.2324 19.0125 33.8078 16.2349 32.4624C13.4573 31.117 11.3415 29.124 10.1555 27.0133C8.96878 24.901 8.73284 22.717 9.60453 20.9173C10.4762 19.1177 12.3362 17.9489 14.7294 17.5706C17.1207 17.1927 19.9962 17.6173 22.7738 18.9627Z" fill="#0ACF83" stroke="#04B36F"/>
                          <ellipse cx="16.3545" cy="24.1872" rx="7" ry="6" transform="rotate(25.8444 16.3545 24.1872)" fill="#4BF1B1"/>
                          <mask id="path-3-inside-1_17069_2401" fill="white">
                            <path d="M24.361 28.3029L24.31 28.2782C23.2804 29.5296 20.6903 29.6207 18.1965 28.4128C15.7028 27.2049 14.1685 25.1161 14.5122 23.5324L14.4612 23.5077L18.9137 14.3154L28.8135 19.1106L24.361 28.3029Z"/>
                          </mask>
                          <path d="M24.361 28.3029L24.31 28.2782C23.2804 29.5296 20.6903 29.6207 18.1965 28.4128C15.7028 27.2049 14.1685 25.1161 14.5122 23.5324L14.4612 23.5077L18.9137 14.3154L28.8135 19.1106L24.361 28.3029Z" fill="#0ACF83"/>
                          <path d="M24.361 28.3029L23.925 29.2029L24.825 29.6388L25.261 28.7389L24.361 28.3029ZM24.31 28.2782L24.7459 27.3783L24.0377 27.0352L23.5378 27.6429L24.31 28.2782ZM14.5122 23.5324L15.4894 23.7445L15.6563 22.9755L14.9481 22.6324L14.5122 23.5324ZM14.4612 23.5077L13.5612 23.0718L13.1253 23.9718L14.0253 24.4077L14.4612 23.5077ZM18.9137 14.3154L19.3496 13.4154L18.4496 12.9795L18.0137 13.8795L18.9137 14.3154ZM28.8135 19.1106L29.7135 19.5466L30.1494 18.6466L29.2494 18.2107L28.8135 19.1106ZM24.361 28.3029L24.7969 27.403L24.7459 27.3783L24.31 28.2782L23.8741 29.1782L23.925 29.2029L24.361 28.3029ZM24.31 28.2782L23.5378 27.6429C23.2779 27.9587 22.7083 28.2439 21.7764 28.2681C20.8693 28.2916 19.7559 28.057 18.6325 27.5128L18.1965 28.4128L17.7606 29.3128C19.1309 29.9765 20.5594 30.3003 21.8282 30.2674C23.0722 30.2352 24.3125 29.8491 25.0822 28.9136L24.31 28.2782ZM18.1965 28.4128L18.6325 27.5128C17.509 26.9687 16.6347 26.2405 16.0908 25.5141C15.532 24.7679 15.4027 24.1442 15.4894 23.7445L14.5122 23.5324L13.5349 23.3204C13.278 24.5043 13.744 25.7168 14.4899 26.7129C15.2506 27.7289 16.3903 28.649 17.7606 29.3128L18.1965 28.4128ZM14.5122 23.5324L14.9481 22.6324L14.8971 22.6077L14.4612 23.5077L14.0253 24.4077L14.0762 24.4324L14.5122 23.5324ZM14.4612 23.5077L15.3612 23.9436L19.8137 14.7514L18.9137 14.3154L18.0137 13.8795L13.5612 23.0718L14.4612 23.5077ZM18.9137 14.3154L18.4778 15.2154L28.3776 20.0106L28.8135 19.1106L29.2494 18.2107L19.3496 13.4154L18.9137 14.3154ZM28.8135 19.1106L27.9135 18.6747L23.461 27.867L24.361 28.3029L25.261 28.7389L29.7135 19.5466L28.8135 19.1106Z" fill="#04B36F" mask="url(#path-3-inside-1_17069_2401)"/>
                          <rect x="19.3778" y="15.6514" width="2" height="7" transform="rotate(25.8444 19.3778 15.6514)" fill="#4BF1B1"/>
                          <path d="M29.3127 5.46338C33.8911 7.68103 36.0011 12.3006 34.361 15.6866C32.7209 19.0726 27.7881 20.2808 23.2097 18.0631C18.6313 15.8455 16.5213 11.2259 18.1614 7.83989C19.8015 4.4539 24.7343 3.24574 29.3127 5.46338Z" fill="#0ACF83" stroke="#04B36F"/>
                          <ellipse cx="23.5472" cy="9.3375" rx="4" ry="3.5" transform="rotate(25.8444 23.5472 9.3375)" fill="#4BF1B1"/>
                          <rect x="14.667" y="32.2588" width="2" height="13" transform="rotate(25.8444 14.667 32.2588)" fill="#DDDADA"/>
                        </svg>
                      </div>
                      <p className="absolute -rotate-1 top-6 left-6 text-black text-xs font-normal">Name + Phone Number</p>

                      <div className='flex flex-col gap-2.5 absolute top-14 left-6 -rotate-1'>
                        <input 
                        type="text" 
                        placeholder='eg. “Marvin Abekah”'
                        className='text-sm'
                        />
                        <div className=" border border-neutral-300 border-dashed"></div>
                        <input 
                        type="text" 
                        placeholder='eg. “+233 -”'
                        className='text-sm'
                        />
                      </div>
                    
                </figure>

                <figure>
                <div className="origin-top-left rotate-2 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] inline-flex flex-col justify-start items-start rounded-t-[10px] rounded-b-[10px]">
                    <div className="px-3.5 py-1.5 bg-pink-200 rounded-t-[10px]  inline-flex justify-start items-start gap-2.5">
                        <p className="w-48 justify-start text-gray-600 text-xs font-normal text-left">Order + Amount + Location</p>
                    </div>
                    <div className="p-3.5 bg-pink-200 rounded-br-[10px]  flex flex-col justify-start items-start gap-2.5 w-full">
                      <input 
                        type="text" 
                        placeholder='--eg. “Cupcake"'
                        className='text-black  text-xs'
                        />

                         <input 
                        type="text" 
                        placeholder='-- eg. “GHS 65.00”'
                        className='text-black  text-xs'
                        />

                         <input 
                        type="text" 
                        placeholder='-- eg. “New Brunei”'
                        className=' text-xs'
                        />
            
                    </div>
                </div>

                <div className='relative bottom-36 left-50'>
                       <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50" fill="none">
                          <path d="M22.7738 18.9627C25.5514 20.3081 27.6672 22.3011 28.8531 24.4117C30.0399 26.5241 30.2758 28.7081 29.4041 30.5078C28.5324 32.3074 26.6725 33.4762 24.2793 33.8545C21.888 34.2324 19.0125 33.8078 16.2349 32.4624C13.4573 31.117 11.3415 29.124 10.1555 27.0133C8.96878 24.901 8.73284 22.717 9.60453 20.9173C10.4762 19.1177 12.3362 17.9489 14.7294 17.5706C17.1207 17.1927 19.9962 17.6173 22.7738 18.9627Z" fill="#0ACF83" stroke="#04B36F"/>
                          <ellipse cx="16.3545" cy="24.1872" rx="7" ry="6" transform="rotate(25.8444 16.3545 24.1872)" fill="#4BF1B1"/>
                          <mask id="path-3-inside-1_17069_2401" fill="white">
                            <path d="M24.361 28.3029L24.31 28.2782C23.2804 29.5296 20.6903 29.6207 18.1965 28.4128C15.7028 27.2049 14.1685 25.1161 14.5122 23.5324L14.4612 23.5077L18.9137 14.3154L28.8135 19.1106L24.361 28.3029Z"/>
                          </mask>
                          <path d="M24.361 28.3029L24.31 28.2782C23.2804 29.5296 20.6903 29.6207 18.1965 28.4128C15.7028 27.2049 14.1685 25.1161 14.5122 23.5324L14.4612 23.5077L18.9137 14.3154L28.8135 19.1106L24.361 28.3029Z" fill="#0ACF83"/>
                          <path d="M24.361 28.3029L23.925 29.2029L24.825 29.6388L25.261 28.7389L24.361 28.3029ZM24.31 28.2782L24.7459 27.3783L24.0377 27.0352L23.5378 27.6429L24.31 28.2782ZM14.5122 23.5324L15.4894 23.7445L15.6563 22.9755L14.9481 22.6324L14.5122 23.5324ZM14.4612 23.5077L13.5612 23.0718L13.1253 23.9718L14.0253 24.4077L14.4612 23.5077ZM18.9137 14.3154L19.3496 13.4154L18.4496 12.9795L18.0137 13.8795L18.9137 14.3154ZM28.8135 19.1106L29.7135 19.5466L30.1494 18.6466L29.2494 18.2107L28.8135 19.1106ZM24.361 28.3029L24.7969 27.403L24.7459 27.3783L24.31 28.2782L23.8741 29.1782L23.925 29.2029L24.361 28.3029ZM24.31 28.2782L23.5378 27.6429C23.2779 27.9587 22.7083 28.2439 21.7764 28.2681C20.8693 28.2916 19.7559 28.057 18.6325 27.5128L18.1965 28.4128L17.7606 29.3128C19.1309 29.9765 20.5594 30.3003 21.8282 30.2674C23.0722 30.2352 24.3125 29.8491 25.0822 28.9136L24.31 28.2782ZM18.1965 28.4128L18.6325 27.5128C17.509 26.9687 16.6347 26.2405 16.0908 25.5141C15.532 24.7679 15.4027 24.1442 15.4894 23.7445L14.5122 23.5324L13.5349 23.3204C13.278 24.5043 13.744 25.7168 14.4899 26.7129C15.2506 27.7289 16.3903 28.649 17.7606 29.3128L18.1965 28.4128ZM14.5122 23.5324L14.9481 22.6324L14.8971 22.6077L14.4612 23.5077L14.0253 24.4077L14.0762 24.4324L14.5122 23.5324ZM14.4612 23.5077L15.3612 23.9436L19.8137 14.7514L18.9137 14.3154L18.0137 13.8795L13.5612 23.0718L14.4612 23.5077ZM18.9137 14.3154L18.4778 15.2154L28.3776 20.0106L28.8135 19.1106L29.2494 18.2107L19.3496 13.4154L18.9137 14.3154ZM28.8135 19.1106L27.9135 18.6747L23.461 27.867L24.361 28.3029L25.261 28.7389L29.7135 19.5466L28.8135 19.1106Z" fill="#04B36F" mask="url(#path-3-inside-1_17069_2401)"/>
                          <rect x="19.3778" y="15.6514" width="2" height="7" transform="rotate(25.8444 19.3778 15.6514)" fill="#4BF1B1"/>
                          <path d="M29.3127 5.46338C33.8911 7.68103 36.0011 12.3006 34.361 15.6866C32.7209 19.0726 27.7881 20.2808 23.2097 18.0631C18.6313 15.8455 16.5213 11.2259 18.1614 7.83989C19.8015 4.4539 24.7343 3.24574 29.3127 5.46338Z" fill="#0ACF83" stroke="#04B36F"/>
                          <ellipse cx="23.5472" cy="9.3375" rx="4" ry="3.5" transform="rotate(25.8444 23.5472 9.3375)" fill="#4BF1B1"/>
                          <rect x="14.667" y="32.2588" width="2" height="13" transform="rotate(25.8444 14.667 32.2588)" fill="#DDDADA"/>
                        </svg>
                </div>

                </figure>
                </main>
              
                 <PrimaryButton
                title="Add Order"
                style={{
                  height: 40,
                  fontSize: 16,
                  fontWeight: '400',
                  width : 120
                }}
                 onClick={goToPreparedList}
              />
   
               
              </section>

           
          </main>

          <div className='border border-neutral-200 w-[580px] border-dashed'></div>

          <section className='flex flex-col gap-3 items-start w-[580px]'>
                <p className='text-base font-semibold'>Added Orders</p>


        {/* Orders List */}
        <section className='flex flex-col items-center justify-center gap-3 w-full'>
          {orders.map((order) => (
            <label
              key={order.id}
              className={`flex items-center justify-between w-full p-3 rounded-lg cursor-pointer transition-colors ${
                selectedOrders.includes(order.id) 
                  ? 'bg-red-50 border border-red-200' 
                  : 'bg-white hover:bg-gray-50 border border-transparent'
              }`}
            >
              <div className='flex gap-3 items-start justify-start'>
                <input
                  type="checkbox"
                  checked={selectedOrders.includes(order.id)}
                  onChange={() => toggleOrderSelection(order.id)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                />
                
                <div className='flex gap-2 items-start justify-start'>
                  <p className='text-black/50 text-xs'>#{order.id}</p>
                  <div className='flex gap-1 flex-col items-start justify-start'>
                    <p className='text-black text-xs font-medium'>{order.name}</p>

                    <div className="flex justify-center items-center gap-2">
                      <p className="text-black/60 text-[10px] font-normal">{order.phone}</p>
                      <div className="w-px h-3 bg-gray-400"></div>
                      <p className="text-black/50 text-[10px]">{order.hall}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="inline-flex justify-center items-center gap-2.5">
                <p className="px-1 py-0.5 bg-neutral-50 rounded-xl text-gray-600 text-xs">{order.item}</p>
                <p className="justify-start text-gray-600 text-xs font-normal">{order.price}</p>
              </div>
            </label>
          ))}
        </section>

          </section>

        </section>
      </main>
    </>
  );
}


export default App;
