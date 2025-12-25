import React, { useState, useEffect } from 'react';
import CheckCircleIcon from '../components/CheckBox';

interface ExtractedOrder {
  image?: File;
  rawText?: string;
  name: string;
  phone: string;
  product: string;
  amount: string;
  location: string;
}

interface Order {
  id: string;
  name: string;
  phone: string;
  hall: string;
  item: string;
  price: string;
}

interface Rider {
  id: string;
  name: string;
  phone: string;
  totalRides: number;
  dateAdded: string;
  rating: number;
  avatarColor?: string;
}

type PreparedListProps = {
  orders: ExtractedOrder[];
  goBackToOrderImages: () => void;
  goToAddOrders: () => void;
};

/* ---------------- RIDER MODAL COMPONENT ---------------- */
const RiderModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAssign: (riderId: string) => void;
  riders: Rider[];
  selectedRider: string | null;
  onSelectRider: (riderId: string) => void;
}> = ({ isOpen, onClose, onAssign, riders, selectedRider, onSelectRider }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Modal Header */}
        <div className="p-4 border-b border-neutral-200 flex flex-col items-start">
          <h3 className="text-black text-lg font-semibold">Select Rider</h3>
          <p className="text-black/50 text-sm mt-1">Choose a rider to assign this order to</p>
        </div>

        {/* Modal Body */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <div className="flex flex-col gap-4">
            {riders.map((rider) => (
              <div
                key={rider.id}
                className={`w-full flex flex-col gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                  selectedRider === rider.id
                    ? 'border-orange-400 border-[0.5px] bg-orange-400/5'
                    : 'border border-neutral-200 hover:bg-neutral-50'
                }`}
                onClick={() => onSelectRider(rider.id)}
              >
                <div className='w-full items-start justify-between flex'>
                  <figure className={`w-14 h-14 ${rider.avatarColor || 'bg-blue-100'} rounded-full flex flex-col items-center justify-center gap-2`}>
                    <span className="text-black font-semibold">
                      {rider.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </figure>

                  {/* Radio Button */}
                  <div 
                    className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${
                      selectedRider === rider.id
                        ? 'border-orange-400 bg-orange-400'
                        : 'border-neutral-300 bg-white'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectRider(rider.id);
                    }}
                  >
                    {selectedRider === rider.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                <section className='w-full flex gap-2 items-center justify-start'>
                  <p className='text-black text-base font-semibold'>{rider.name}</p>
                  <div className='w-1 h-1 rounded-full bg-neutral-200' />
                  <p className='text-black/50 text-sm '>{rider.phone}</p>
                </section>

                <section className='w-full flex gap-2 items-center justify-start'>
                  <p className='text-black text-xs font-semibold'>
                    {rider.totalRides} <span className='text-black/50 font-normal'>Total Rides</span>
                  </p>
                  <div className='w-1 h-1 rounded-full bg-neutral-200' />
                  <p className='text-black text-xs font-semibold'>
                    {rider.dateAdded}<span className='text-black/50 font-normal'> Date Added</span>
                  </p>
                  <div className='w-1 h-1 rounded-full bg-neutral-200' />
                  <p className='text-black text-xs font-semibold'>
                    {rider.rating.toFixed(1)}<span className='text-black/50 font-normal'> Rating</span>
                  </p>
                </section>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-200 flex gap-3 justify-between items-center">
          <button
            onClick={onClose}
            className="px-3 py-2 rounded-full border border-neutral-300 text-black font-medium hover:bg-neutral-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedRider) {
                onAssign(selectedRider);
                onClose();
              }
            }}
            disabled={!selectedRider}
            className={`px-3 py-2 rounded-full font-medium transition-colors duration-200 ${
              selectedRider
                ? 'bg-orange-400 text-white hover:bg-orange-500'
                : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            }`}
          >
            Assign
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- SINGLE ORDER ITEM COMPONENT ---------------- */
const OrderItem: React.FC<{
  order: Order;
  checked: boolean;
  onToggle: () => void;
}> = ({ order, checked, onToggle }) => {
  const { id, name, phone, hall, item, price } = order;

  return (
    <div 
      className={`flex items-center justify-between w-full p-3 rounded-lg cursor-pointer transition-colors ${
        checked
          ? 'bg-green-50 border border-green-200'
          : 'bg-white hover:bg-gray-50 border border-transparent'
      }`}
      onClick={onToggle}
    >
      <div className='flex gap-3 items-start justify-start'>
        <CheckCircleIcon checked={checked} onToggle={onToggle} size={18} />
        
        <div className='flex gap-2 items-start justify-start'>
          <p className='text-black/50 text-xs'>{id}</p>
          <div className='flex gap-1 flex-col items-start justify-start'>
            <p className='text-black text-xs font-medium'>{name}</p>
            <div className="flex justify-center items-center gap-2">
              <p className="text-black/60 text-[10px] font-normal">{phone}</p>
              <div className="w-px h-3 bg-gray-400"></div>
              <p className="text-black/50 text-[10px]">{hall}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="inline-flex justify-center items-center gap-2.5">
        <p className="px-1 py-0.5 bg-neutral-50 rounded-xl text-gray-600 text-xs">{item}</p>
        <p className="justify-start text-gray-600 text-xs font-normal">{price}</p>
      </div>
    </div>
  );
};

const PreparedList: React.FC<PreparedListProps> = ({ 
  orders: incomingOrders, 
  goBackToOrderImages, 
  goToAddOrders 
}) => {
  // 🔹 Transform incoming orders to display format
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedOrders, setSavedOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Transform incoming orders
    const transformedOrders = incomingOrders.map((order, index) => ({
      id: `#${String(index + 11).padStart(3, '0')}`,
      name: order.name || 'Unknown',
      phone: order.phone || '',
      hall: order.location || '',
      item: order.product || '',
      price: order.amount ? `GHC ${order.amount}` : ''
    }));
    setOrders(transformedOrders);
  }, [incomingOrders]);

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<string | null>(null);
  
  // Mock riders data
  const [riders] = useState<Rider[]>([
    {
      id: '1',
      name: 'John Doe',
      phone: '08123456789',
      totalRides: 24,
      dateAdded: '26/12/25',
      rating: 4.6,
      avatarColor: 'bg-blue-100',
    },
    {
      id: '2',
      name: 'Jane Smith',
      phone: '08098765432',
      totalRides: 18,
      dateAdded: '15/12/25',
      rating: 4.8,
      avatarColor: 'bg-green-100',
    },
    {
      id: '3',
      name: 'Mike Johnson',
      phone: '07012345678',
      totalRides: 32,
      dateAdded: '10/12/25',
      rating: 4.4,
      avatarColor: 'bg-purple-100',
    },
  ]);

  const hasSavedOrders = savedOrders.length > 0;
  const hasPreparedOrders = orders.length > 0;

  /* ---------------- SELECT LOGIC ---------------- */
  const toggleOrderSelection = (orderId: string) => {
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

  /* ---------------- SAVE ORDERS ---------------- */
  const handleSaveOrders = () => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order to save');
      return;
    }

    // Get selected orders data
    const selectedOrderData = orders.filter(order => selectedOrders.includes(order.id));
    
    // Add to saved orders (avoid duplicates)
    const newSavedOrders = [...savedOrders];
    selectedOrderData.forEach(order => {
      if (!newSavedOrders.some(saved => saved.id === order.id)) {
        newSavedOrders.push(order);
      }
    });
    
    setSavedOrders(newSavedOrders);
    
    // Clear selection after saving
    setSelectedOrders([]);
    
    alert(`${selectedOrders.length} order(s) saved successfully!`);
    
    // Save to localStorage
    localStorage.setItem('savedOrders', JSON.stringify(newSavedOrders));
  };

  /* ---------------- ASSIGN TO RIDERS ---------------- */
  const handleAssignToRiders = () => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order');
      return;
    }

    // Open rider modal
    setSelectedRider(null);
    setIsRiderModalOpen(true);
  };

  const handleAssignOrder = (riderId: string) => {
    const rider = riders.find(r => r.id === riderId);
    const selectedOrderDetails = orders.filter(order => selectedOrders.includes(order.id));
    
    console.log(`Assigning ${selectedOrders.length} order(s) to rider:`, rider?.name);
    console.log('Orders being assigned:', selectedOrderDetails);
    
    // Show success message
    alert(`Successfully assigned ${selectedOrders.length} order(s) to ${rider?.name}`);
    
    // Remove assigned orders from both orders and savedOrders
    const newOrders = orders.filter(order => !selectedOrders.includes(order.id));
    const newSavedOrders = savedOrders.filter(order => !selectedOrders.includes(order.id));
    
    setOrders(newOrders);
    setSavedOrders(newSavedOrders);
    
    // Clear selection
    setSelectedOrders([]);
    
    // Save to localStorage
    localStorage.setItem('savedOrders', JSON.stringify(newSavedOrders));
  };

  // Load saved orders from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedOrders');
    if (saved) {
      try {
        const parsedSavedOrders = JSON.parse(saved);
        setSavedOrders(parsedSavedOrders);
      } catch (error) {
        console.error('Error loading saved orders:', error);
      }
    }
  }, []);

  // Combine orders and savedOrders for display
  const displayOrders = [...orders, ...savedOrders];

  return (
    <>
      <main className="flex flex-col items-center min-h-screen w-[1132px]">
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

        <section className="flex flex-col items-center gap-7 mt-10 w-120">
          {/* NAV with Back Button and Title */}
          <nav className="flex w-full items-center justify-between">
            <div className="flex gap-2 items-center">
              {/* Back Button */}
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

              {/* Title next to back button */}
              <p className="text-black text-base font-bold">
                Prepared Order List
                <span className="text-black/50 font-normal">
                  {' '}({displayOrders.length})
                </span>
              </p>
            </div>

            {/* Action Buttons - Only show when orders are selected */}
            {selectedOrders.length > 0 && (
              <div className='flex items-center gap-2'>
                <button 
                  className='text-sm text-green-600 px-3 py-1.5 rounded-full bg-green-50 hover:bg-green-100 transition-colors'
                  onClick={handleAssignToRiders}
                >
                  Assign Rider
                </button>
                <button 
                  className='text-sm text-orange-400 px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors'
                  onClick={handleSaveOrders}
                >
                  Save
                </button>
              </div>
            )}
          </nav>

          {/* PREPARED ORDERS SECTION */}
          {hasPreparedOrders && (
            <section className='flex flex-col gap-3 items-start w-full'>
        

              {/* Select All Checkbox - Only show if more than 1 order */}
              {orders.length > 1 && (
                <div 
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                  onClick={selectAll}
                >
                  <CheckCircleIcon 
                    checked={selectedOrders.length === orders.length && orders.length > 0} 
                    onToggle={selectAll}
                    size={18}
                  />
                  <span className="text-sm text-black/70">
                    {selectedOrders.length === orders.length ? 'Deselect All' : 'Select All'} ({selectedOrders.length} of {orders.length})
                  </span>
                </div>
              )}

              {/* Orders List */}
              <section className='flex flex-col items-center justify-center gap-3 w-full'>
                {orders.map((order) => (
                  <OrderItem
                    key={order.id}
                    order={order}
                    checked={selectedOrders.includes(order.id)}
                    onToggle={() => toggleOrderSelection(order.id)}
                  />
                ))}
              </section>
            </section>
          )}

          {/* Divider - only show if there are both prepared and saved orders */}
          {hasPreparedOrders && hasSavedOrders && (
            <div className='border border-neutral-200 w-full border-dashed'></div>
          )}

          {/* SAVED ORDERS Section - only show if there are saved orders */}
          {hasSavedOrders && (
            <section className='flex flex-col gap-3 items-start w-full'>
              <nav className='flex w-full items-center justify-between'>
                <p className='text-base font-semibold'>Saved Orders ({savedOrders.length})</p>
              </nav>

              {/* Select All Checkbox for Saved Orders - Only show if more than 1 */}
              {savedOrders.length > 1 && (
                <div 
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                  onClick={() => {
                    // Select all saved orders
                    if (selectedOrders.length === savedOrders.length) {
                      // Deselect all saved orders
                      const newSelected = selectedOrders.filter(id => 
                        !savedOrders.some(order => order.id === id)
                      );
                      setSelectedOrders(newSelected);
                    } else {
                      // Select all saved orders
                      const savedOrderIds = savedOrders.map(order => order.id);
                      const newSelected = Array.from(new Set([...selectedOrders, ...savedOrderIds]));
                      setSelectedOrders(newSelected);
                    }
                  }}
                >
                  <CheckCircleIcon 
                    checked={selectedOrders.length === savedOrders.length && savedOrders.length > 0} 
                    onToggle={() => {}}
                    size={18}
                  />
                  <span className="text-sm text-black/70">
                    {selectedOrders.length === savedOrders.length ? 'Deselect All' : 'Select All'}
                  </span>
                </div>
              )}

              {/* Saved Orders List */}
              <section className='flex flex-col items-center justify-center gap-3 w-full'>
                {savedOrders.map((order) => (
                  <OrderItem
                    key={order.id}
                    order={order}
                    checked={selectedOrders.includes(order.id)}
                    onToggle={() => toggleOrderSelection(order.id)}
                  />
                ))}
              </section>
            </section>
          )}

          {/* Empty State */}
          {!hasPreparedOrders && !hasSavedOrders && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-dashed w-full">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <p className="text-gray-500 text-center text-sm">
                No prepared orders yet.<br />
                Go back to extract orders from images.
              </p>
              <button
                onClick={goBackToOrderImages}
                className="mt-4 text-red-600 text-sm font-medium hover:underline"
              >
                Go to Order Images
              </button>
            </div>
          )}
        </section>
      </main>

      {/* Rider Modal */}
      <RiderModal
        isOpen={isRiderModalOpen}
        onClose={() => {
          setIsRiderModalOpen(false);
          setSelectedRider(null);
        }}
        onAssign={handleAssignOrder}
        riders={riders}
        selectedRider={selectedRider}
        onSelectRider={setSelectedRider}
      />
    </>
  );
};

export default PreparedList;