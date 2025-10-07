import React, { useState } from 'react';
import PrimaryButton from '../Components/PrimaryButton';

const PreparedList = ({ goBackToOrderImages, goToAddOrders }) => {
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
    <main className="flex flex-col items-center min-h-screen w-[1132px]">
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

      <section className="flex flex-col items-center justify-center gap-7 mt-10 w-[504px]">
        <nav className="flex w-full items-center justify-between">
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
              onClick={goBackToOrderImages}
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
              Prepared Order List
              <span className="text-black/50 text-base font-normal"> ({orders.length})</span>
            </p>
          </div>

          {/* <div className="w-20">
            <PrimaryButton
              title="Done"
              style={{
                height: 40,
                fontSize: 16,
                fontWeight: '400'
              }}
              onClick={handleAssignToRiders}
            />
          </div> */}
        </nav>

        {/* Select All Option */}
        <div className="flex items-center justify-between w-full pb-2 border-b border-gray-200">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedOrders.length === orders.length}
              onChange={selectAll}
              className="w-4 h-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
            />
            <span className="text-xs text-black/70">
              Select All ({selectedOrders.length} of {orders.length} selected)
            </span>
          </label>
        </div>

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

        {/* Action Button at Bottom */}
        {selectedOrders.length > 0 && (
          <div className="w-full mt-4">
            <PrimaryButton
              title={`Assign ${selectedOrders.length} Order${selectedOrders.length > 1 ? 's' : ''} to Riders`}
              onClick={handleAssignToRiders}
            />
          </div>
        )}
      </section>
    </main>
  );
};

export default PreparedList;