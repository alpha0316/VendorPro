import './../App.css'
import { useState } from 'react';
import PrimaryButton from '../components/PrimaryButton';
import { useNavigate } from 'react-router-dom';

interface AppProps {
  goToPreparedList: () => void;
  goToAddOrders: () => void;
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

const STICKER_COLORS = [
  '#FFF8A7',
  '#FFECC2',
  '#E7F9C7',
  '#DFF4FF',
  '#E8E8FF',
  '#FBE5FF',
  '#FFE8F1',
  '#F6F2D4',
  '#E7F8ED',
];

const MENU_PRODUCTS = [
  { name: 'Chicken Shawarma', price: 35, keywords: ['shawarma', 'sharwama'] },
  { name: 'Chicken Loaded Fries', price: 65, keywords: ['loaded fries', 'chicken loaded'] },
  { name: 'Super Loaded Fries', price: 80, keywords: ['super loaded'] },
  { name: 'Extra Cheese', price: 10, keywords: ['cheese'] },
  { name: 'Honey Glazed Chicken', price: 50, keywords: ['honey glazed', 'honey wings'] },
  { name: 'Spicy Chicken', price: 50, keywords: ['spicy chicken', 'spicy wings'] },
  { name: 'BBQ Glazed Chicken', price: 50, keywords: ['bbq glazed', 'bbq wings'] },
  { name: 'Fries', price: 25, keywords: ['fries', 'chips'] },
  { name: 'Indomie', price: 35, keywords: ['indomie'] },
];

const parseProductLine = (line: string): { name: string; qty: number; price: string } => {
  const qtyMatch = line.match(/^(\d+)\s*x?\s+/i);
  const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : 1;
  const name = qtyMatch ? line.slice(qtyMatch[0].length).trim() : line.trim();
  const matched = MENU_PRODUCTS.find(p =>
    p.keywords.some(k => name.toLowerCase().includes(k.toLowerCase()))
  );
  const price = matched ? `GHC${(matched.price * qty).toFixed(2)}` : '';
  return { name, qty, price };
};

const getStickerColor = (order: Order): string => {
  const seed = `${order.id}-${order.phone}-${order.name}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return STICKER_COLORS[hash % STICKER_COLORS.length];
};

const getProductLines = (item: string): string[] =>
  item.split(',').map(x => x.trim()).filter(Boolean);

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
            {riders.map((rider) => {
              const softColors = [
                'bg-red-50', 'bg-orange-50', 'bg-amber-50', 'bg-yellow-50',
                'bg-lime-50', 'bg-green-50', 'bg-emerald-50', 'bg-teal-50',
                'bg-cyan-50', 'bg-sky-50', 'bg-blue-50', 'bg-indigo-50',
                'bg-violet-50', 'bg-purple-50', 'bg-fuchsia-50', 'bg-pink-50', 'bg-rose-50'
              ];
              const riderColor = rider.avatarColor || softColors[Math.floor(Math.random() * softColors.length)];

              return (
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
                    <figure className={`w-14 h-14 ${riderColor} rounded-full flex flex-col items-center justify-center gap-2`}>
                      <span className="text-black font-semibold">
                        {rider.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </figure>

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
              );
            })}
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

/* ---------------- CHECK ICON COMPONENT ---------------- */
const CheckCircleIcon = ({
  checked = false,
  size = 16,
  onToggle,
}: {
  checked?: boolean;
  size?: number;
  onToggle?: () => void;
}) => {
  return checked ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      onClick={onToggle}
      className="cursor-pointer shrink-0"
    >
      <path
        d="M10 0C4.49 0 0 4.49 0 10C0 15.51 4.49 20 10 20C15.51 20 20 15.51 20 10C20 4.49 15.51 0 10 0ZM14.78 7.7L9.11 13.37C8.97 13.51 8.78 13.59 8.58 13.59C8.38 13.59 8.19 13.51 8.05 13.37L5.22 10.54C4.93 10.25 4.93 9.77 5.22 9.48C5.51 9.19 5.99 9.19 6.28 9.48L8.58 11.78L13.72 6.64C14.01 6.35 14.49 6.35 14.78 6.64C15.07 6.93 15.07 7.4 14.78 7.7Z"
        fill="#4DB448"
      />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      onClick={onToggle}
      className="cursor-pointer shrink-0"
    >
      <circle cx="10" cy="10" r="9" stroke="#C7C7C7" strokeWidth="2" fill="none" />
    </svg>
  );
};

/* ---------------- STICKER NOTE CARD COMPONENT ---------------- */
const StickerCard: React.FC<{
  order: Order;
  checked: boolean;
  onToggle: () => void;
}> = ({ order, checked, onToggle }) => {
  const orderKey = `${order.id}-${order.phone}`;
  const stickerColor = getStickerColor(order);
  const filterId = `sticker-filter-${orderKey.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const productLines = getProductLines(order.item);
  const parsedLines = productLines.map(l => parseProductLine(l));
  const itemCount = productLines.length || 1;

  // Sticker Background SVG
  const StickerBg = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 189 129"
      fill="none"
      preserveAspectRatio="none"
      className="absolute inset-0 h-full w-full pointer-events-none"
    >
      <g filter={`url(#${filterId})`}>
        <path d="M181 112C181 116.418 177.418 120 173 120H31.3137C29.192 120 27.1571 119.157 25.6569 117.657L10.3431 102.343C8.84285 100.843 8 98.808 8 96.6863V15C8 10.5817 11.5817 7 16 7H173C177.418 7 181 10.5817 181 15V112Z" fill={stickerColor} />
        <path d="M8 100H28V120L8 100Z" fill="black" fillOpacity="0.2" />
      </g>
      <defs>
        <filter id={filterId} x="0" y="0" width="189" height="129" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="4" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.11 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_29364_2885" />
          <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
          <feOffset />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.21 0" />
          <feBlend mode="normal" in2="effect1_dropShadow_29364_2885" result="effect2_dropShadow_29364_2885" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect2_dropShadow_29364_2885" result="shape" />
        </filter>
      </defs>
    </svg>
  );

  return (
    <article
      className="relative w-full overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
      style={{ minHeight: `${188 + Math.max(0, parsedLines.length - 1) * 52}px` }}
      onClick={onToggle}
    >
      <StickerBg />
      <div className="relative z-10 px-4 pt-3.5 pb-4">

        {/* Row 1 — name + checkbox */}
        <div className="flex items-center justify-between mx-3 mt-3">
          <p className="text-sm font-bold text-black leading-snug flex-1 text-left truncate max-w-45">{order.name}</p>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="w-4 h-4 rounded accent-orange-400 cursor-pointer shrink-0"
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Row 2 — phone/location + total */}
        <div className="flex items-center justify-between mt-1 mx-3">
          <p className="text-xs text-black/50 truncate max-w-37.5">
            {order.phone} <span className="mx-0.5">|</span> {order.hall}
          </p>
          <span className="text-sm font-bold text-black shrink-0 ml-2">{order.price}</span>
        </div>

        {/* Divider */}
        <div className="border-t border-black/10 mt-3 mb-2.5" />

        {/* Orders label */}
        <div className="flex items-center gap-1.5 mb-2 mx-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M8.37053 1.1665H5.62887C5.0222 1.1665 4.52637 1.6565 4.52637 2.26317V2.8115C4.52637 3.41817 5.01637 3.90817 5.62303 3.90817H8.37053C8.9772 3.90817 9.4672 3.41817 9.4672 2.8115V2.26317C9.47303 1.6565 8.9772 1.1665 8.37053 1.1665Z" fill="black" fillOpacity="0.4" />
            <path d="M10.0564 2.81153C10.0564 3.73903 9.29811 4.49737 8.37061 4.49737H5.62895C4.70145 4.49737 3.94311 3.73903 3.94311 2.81153C3.94311 2.48487 3.59311 2.2807 3.30145 2.43237C2.47895 2.86987 1.91895 3.73903 1.91895 4.73653V10.2257C1.91895 11.6607 3.09145 12.8332 4.52645 12.8332H9.47311C10.9081 12.8332 12.0806 11.6607 12.0806 10.2257V4.73653C12.0806 3.73903 11.5206 2.86987 10.6981 2.43237C10.4064 2.2807 10.0564 2.48487 10.0564 2.81153ZM7.22145 9.88737H4.66645C4.42728 9.88737 4.22895 9.68903 4.22895 9.44987C4.22895 9.2107 4.42728 9.01237 4.66645 9.01237H7.22145C7.46061 9.01237 7.65895 9.2107 7.65895 9.44987C7.65895 9.68903 7.46061 9.88737 7.22145 9.88737ZM8.74978 7.55403H4.66645C4.42728 7.55403 4.22895 7.3557 4.22895 7.11653C4.22895 6.87737 4.42728 6.67903 4.66645 6.67903H8.74978C8.98895 6.67903 9.18728 6.87737 9.18728 7.11653C9.18728 7.3557 8.98895 7.55403 8.74978 7.55403Z" fill="black" fillOpacity="0.4" />
          </svg>
          <span className="text-xs text-black/40 font-medium">Orders</span>
          <span className="text-xs text-black/30 ml-auto">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
        </div>

        {/* Product rows */}
        <div className="flex flex-col mx-3 mb-12">
          {parsedLines.map(({ name, qty, price }, idx) => (
            <div key={idx}>
              {idx > 0 && (
                <div className="border-t border-dashed border-black/15 my-2.5" />
              )}
              <div className="flex items-center w-full">
                <span className="text-sm text-black flex-1 text-left truncate max-w-45">{name}</span>
                <span className="text-sm text-black/50 w-6 text-center shrink-0">{qty}</span>
                <span className="text-sm text-black font-medium w-16 text-right shrink-0">{price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

/* ---------------- ADD ORDER BOTTOM SHEET (MOBILE) ---------------- */
const AddOrderBottomSheet: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddOrder: (order: any) => void;
  newOrder: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ isOpen, onClose, onAddOrder, newOrder, onInputChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 block sm:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl pt-3 pb-8 px-5 shadow-2xl animate-slide-up">
        {/* Drag handle */}
        <div className="w-10 h-1 bg-black/15 rounded-full mx-auto mb-4" />

        {/* Title */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-black">Add New Order</h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-black/50 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-black/50 font-medium">Customer Name</label>
            <input
              type="text"
              name="name"
              placeholder="e.g. Marvin Abekah"
              className="w-full p-3 bg-neutral-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200"
              value={newOrder.name}
              onChange={onInputChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-black/50 font-medium">Phone Number</label>
            <input
              type="text"
              name="phone"
              placeholder="e.g. 055 414 4611"
              className="w-full p-3 bg-neutral-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200"
              value={newOrder.phone}
              onChange={onInputChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-black/50 font-medium">Item</label>
            <input
              type="text"
              name="item"
              placeholder="e.g. Jollof, Banku"
              className="w-full p-3 bg-neutral-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200"
              value={newOrder.item}
              onChange={onInputChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-black/50 font-medium">Price</label>
            <input
              type="text"
              name="price"
              placeholder="e.g. 60.00"
              className="w-full p-3 bg-neutral-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200"
              value={newOrder.price}
              onChange={onInputChange}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs text-black/50 font-medium">Delivery Location</label>
            <input
              type="text"
              name="location"
              placeholder="e.g. Suncity, Hall 2"
              className="w-full p-3 bg-neutral-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-orange-200"
              value={newOrder.location}
              onChange={onInputChange}
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-full border border-neutral-300 text-black font-medium hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onAddOrder(newOrder);
                onClose();
              }}
              className="flex-1 px-4 py-3 rounded-full bg-orange-400 text-white font-medium hover:bg-orange-500 transition-colors"
            >
              Add Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function App({ goToAddOrders }: AppProps) {
  const navigate = useNavigate();

  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([
    { id: '#011', name: 'Prince', phone: '055 414 4611', hall: 'Suncity', item: 'Jollof', price: 'GHC60.00' },
    { id: '#014', name: 'Kofi Asante', phone: '055 321 7654', hall: 'Hall 2', item: 'Banku, 2x Tilapia', price: 'GHC40.00' },
  ]);

  // Modal state
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<string | null>(null);
  const [isAddOrderSheetOpen, setIsAddOrderSheetOpen] = useState(false);
  
  const [riders] = useState<Rider[]>([
    { id: '1', name: 'John Doe', phone: '08123456789', totalRides: 24, dateAdded: '26/12/25', rating: 4.6 },
    { id: '2', name: 'Jane Smith', phone: '08098765432', totalRides: 18, dateAdded: '15/12/25', rating: 4.8 },
    { id: '3', name: 'Mike Johnson', phone: '07012345678', totalRides: 32, dateAdded: '10/12/25', rating: 4.4 },
  ]);

  // Form state
  const [newOrder, setNewOrder] = useState({
    name: '',
    phone: '',
    item: '',
    price: '',
    location: ''
  });

  // Toggle order selection
  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Select all orders
  const selectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add new order
  const addNewOrder = (orderData?: any) => {
    const data = orderData || newOrder;
    
    if (!data.name || !data.phone || !data.item || !data.price || !data.location) {
      alert('Please fill in all fields');
      return false;
    }

    // Generate a new ID
    const newId = `#${String(orders.length + 11).padStart(3, '0')}`;
    
    const orderToAdd: Order = {
      id: newId,
      name: data.name,
      phone: data.phone,
      hall: data.location,
      item: data.item,
      price: `GHC${data.price}`
    };

    setOrders(prev => [...prev, orderToAdd]);
    
    // Clear form
    setNewOrder({
      name: '',
      phone: '',
      item: '',
      price: '',
      location: ''
    });
    
    return true;
  };

  // Handle assign to riders - opens the modal
  const handleAssignToRiders = () => {
    if (selectedOrders.length === 0) {
      alert('Please select at least one order to assign');
      return;
    }
    
    setSelectedRider(null);
    setIsRiderModalOpen(true);
  };

  // Handle actual assignment after selecting a rider
  const handleAssignOrder = (riderId: string) => {
    const selectedRiderDetails = riders.find(rider => rider.id === riderId);
    
    alert(`Successfully assigned ${selectedOrders.length} order(s) to ${selectedRiderDetails?.name}`);
    
    // Remove assigned orders from the list
    const newOrders = orders.filter(order => !selectedOrders.includes(order.id));
    setOrders(newOrders);
    setSelectedOrders([]);
  };

  // Handle save orders
  const handleSaveOrders = () => {
    if (orders.length === 0) {
      alert('No orders to save');
      return;
    }
    
    alert(`Saved ${orders.length} order(s) successfully!`);
  };

  // Check if there are any saved orders
  const hasSavedOrders = orders.length > 0;

  return (
    <>
      <main className="flex flex-col items-center w-full min-h-screen px-4 sm:px-6 md:px-8">
        {/* HEADER */}
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto mt-4 sm:mt-6 md:mt-8">
          <div
            onClick={goToAddOrders}
            className="hidden sm:flex items-center cursor-pointer"
          >
            <img src="/logo.png" alt="Logo" className="h-4 sm:h-5 w-2.5 sm:w-3" />
            <span className="text-red-600 text-base sm:text-lg font-bold">B</span>
            <span className="text-black/50 text-base sm:text-lg font-bold">ites.</span>
          </div>

          <div className="h-5 sm:h-6 px-1 sm:px-1.5 py-1.5 sm:py-2.5 bg-orange-400 rounded-[50px] flex items-center justify-center ml-auto sm:ml-0">
            <div className="text-center text-white text-xs">R 👩🏽‍🍳</div>
          </div>
        </div>

        {/* NAV with Back Button */}
        <section className="flex flex-col items-center justify-center gap-4 w-full max-w-7xl mx-auto mt-6 sm:mt-8">
          <nav className="flex w-full items-center justify-start">
            <div className="flex gap-3 items-center">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#F6F6F6] rounded-full hover:bg-gray-200 transition-colors"
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
              </button>
            </div>
          </nav>

          <main className='flex flex-col items-start justify-center gap-6 w-full'>
            {/* Title Section */}
            <div className="w-full flex flex-col gap-2">
              <h1 className="text-black text-2xl sm:text-3xl font-bold text-left">
                Type Your Orders <span className="inline-block">📝</span>
              </h1>
              <p className="text-black/50 text-sm sm:text-base font-normal text-left max-w-2xl">
                Prefer manual entry? Add your order details one step at a time — quickly and accurately
              </p>
            </div>

            {/* DESKTOP: Sticky Note Forms (hidden on mobile) */}
            <div className="hidden sm:flex flex-row w-full items-start justify-start gap-6">
              {/* Name & Phone Sticky Note */}
              <div className='relative w-auto shrink-0'>
                <svg xmlns="http://www.w3.org/2000/svg" width="251" height="156" viewBox="0 0 251 156" fill="none">
                  <g filter="url(#filter0_d_17069_2354)">
                    <path d="M245.598 0.591648C224.419 0.818174 77.7369 2.86557 7.04306 3.86096C5.22556 12.6248 6.69906 101.745 7.663 145.21C34.2563 144.746 178.178 142.114 246.815 140.857C245.844 127.561 245.599 41.8067 245.598 0.591648Z" fill="#FDF5A3" />
                  </g>
                  <defs>
                    <filter id="filter0_d_17069_2354" x="0.18103" y="0.591797" width="250.634" height="154.618" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dx="-1" dy="5" />
                      <feGaussianBlur stdDeviation="2.5" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.3 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_17069_2354" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_17069_2354" result="shape" />
                    </filter>
                  </defs>
                </svg>

                {/* Decorative Character */}
                <div className='absolute -top-2 -right-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50" fill="none">
                    <path d="M22.7738 18.9627C25.5514 20.3081 27.6672 22.3011 28.8531 24.4117C30.0399 26.5241 30.2758 28.7081 29.4041 30.5078C28.5324 32.3074 26.6725 33.4762 24.2793 33.8545C21.888 34.2324 19.0125 33.8078 16.2349 32.4624C13.4573 31.117 11.3415 29.124 10.1555 27.0133C8.96878 24.901 8.73284 22.717 9.60453 20.9173C10.4762 19.1177 12.3362 17.9489 14.7294 17.5706C17.1207 17.1927 19.9962 17.6173 22.7738 18.9627Z" fill="#0ACF83" stroke="#04B36F" />
                    <ellipse cx="16.3545" cy="24.1872" rx="7" ry="6" transform="rotate(25.8444 16.3545 24.1872)" fill="#4BF1B1" />
                    <mask id="path-3-inside-1_17069_2401" fill="white">
                      <path d="M24.361 28.3029L24.31 28.2782C23.2804 29.5296 20.6903 29.6207 18.1965 28.4128C15.7028 27.2049 14.1685 25.1161 14.5122 23.5324L14.4612 23.5077L18.9137 14.3154L28.8135 19.1106L24.361 28.3029Z" />
                    </mask>
                    <path d="M24.361 28.3029L24.31 28.2782C23.2804 29.5296 20.6903 29.6207 18.1965 28.4128C15.7028 27.2049 14.1685 25.1161 14.5122 23.5324L14.4612 23.5077L18.9137 14.3154L28.8135 19.1106L24.361 28.3029Z" fill="#0ACF83" />
                    <path d="M24.361 28.3029L23.925 29.2029L24.825 29.6388L25.261 28.7389L24.361 28.3029ZM24.31 28.2782L24.7459 27.3783L24.0377 27.0352L23.5378 27.6429L24.31 28.2782ZM14.5122 23.5324L15.4894 23.7445L15.6563 22.9755L14.9481 22.6324L14.5122 23.5324ZM14.4612 23.5077L13.5612 23.0718L13.1253 23.9718L14.0253 24.4077L14.4612 23.5077ZM18.9137 14.3154L19.3496 13.4154L18.4496 12.9795L18.0137 13.8795L18.9137 14.3154ZM28.8135 19.1106L29.7135 19.5466L30.1494 18.6466L29.2494 18.2107L28.8135 19.1106ZM24.361 28.3029L24.7969 27.403L24.7459 27.3783L24.31 28.2782L23.8741 29.1782L23.925 29.2029L24.361 28.3029ZM24.31 28.2782L23.5378 27.6429C23.2779 27.9587 22.7083 28.2439 21.7764 28.2681C20.8693 28.2916 19.7559 28.057 18.6325 27.5128L18.1965 28.4128L17.7606 29.3128C19.1309 29.9765 20.5594 30.3003 21.8282 30.2674C23.0722 30.2352 24.3125 29.8491 25.0822 28.9136L24.31 28.2782ZM18.1965 28.4128L18.6325 27.5128C17.509 26.9687 16.6347 26.2405 16.0908 25.5141C15.532 24.7679 15.4027 24.1442 15.4894 23.7445L14.5122 23.5324L13.5349 23.3204C13.278 24.5043 13.744 25.7168 14.4899 26.7129C15.2506 27.7289 16.3903 28.649 17.7606 29.3128L18.1965 28.4128ZM14.5122 23.5324L14.9481 22.6324L14.8971 22.6077L14.4612 23.5077L14.0253 24.4077L14.0762 24.4324L14.5122 23.5324ZM14.4612 23.5077L15.3612 23.9436L19.8137 14.7514L18.9137 14.3154L18.0137 13.8795L13.5612 23.0718L14.4612 23.5077ZM18.9137 14.3154L18.4778 15.2154L28.3776 20.0106L28.8135 19.1106L29.2494 18.2107L19.3496 13.4154L18.9137 14.3154ZM28.8135 19.1106L27.9135 18.6747L23.461 27.867L24.361 28.3029L25.261 28.7389L29.7135 19.5466L28.8135 19.1106Z" fill="#04B36F" mask="url(#path-3-inside-1_17069_2401)" />
                    <rect x="19.3778" y="15.6514" width="2" height="7" transform="rotate(25.8444 19.3778 15.6514)" fill="#4BF1B1" />
                    <path d="M29.3127 5.46338C33.8911 7.68103 36.0011 12.3006 34.361 15.6866C32.7209 19.0726 27.7881 20.2808 23.2097 18.0631C18.6313 15.8455 16.5213 11.2259 18.1614 7.83989C19.8015 4.4539 24.7343 3.24574 29.3127 5.46338Z" fill="#0ACF83" stroke="#04B36F" />
                    <ellipse cx="23.5472" cy="9.3375" rx="4" ry="3.5" transform="rotate(25.8444 23.5472 9.3375)" fill="#4BF1B1" />
                    <rect x="14.667" y="32.2588" width="2" height="13" transform="rotate(25.8444 14.667 32.2588)" fill="#DDDADA" />
                  </svg>
                </div>

                <p className="absolute -rotate-1 top-6 left-6 text-black text-xs font-normal">Name + Phone Number</p>

                <div className='flex flex-col gap-2.5 absolute top-14 left-6 -rotate-1 w-45'>
                  <input
                    type="text"
                    name="name"
                    placeholder='eg. "Marvin Abekah"'
                    className='text-sm outline-none bg-transparent w-full'
                    value={newOrder.name}
                    onChange={handleInputChange}
                  />
                  <div className="border border-neutral-300 border-dashed w-full"></div>
                  <input
                    type="text"
                    name="phone"
                    placeholder='eg. "+233 -"'
                    className='text-sm outline-none bg-transparent w-full'
                    value={newOrder.phone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Order Details Sticky Note */}
              <div className='relative w-auto shrink-0'>
                <div className="origin-top-left rotate-2 shadow-[0px_4px_6px_0px_rgba(0,0,0,0.25)] inline-flex flex-col justify-start items-start rounded-t-[10px] rounded-b-[10px] w-62.5">
                  <div className="px-3.5 py-1.5 bg-pink-200 rounded-t-[10px] inline-flex justify-start items-start gap-2.5 w-full">
                    <p className="w-48 justify-start text-gray-600 text-xs font-normal text-left">Order + Amount + Location</p>
                  </div>
                  <div className="p-3.5 bg-pink-200 rounded-br-[10px] flex flex-col justify-start items-start gap-2.5 w-full">
                    <input
                      type="text"
                      name="item"
                      placeholder='--eg. "Cupcake"'
                      className='text-black text-xs outline-none bg-transparent w-full'
                      value={newOrder.item}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="price"
                      placeholder='-- eg. "65.00"'
                      className='text-black text-xs outline-none bg-transparent w-full'
                      value={newOrder.price}
                      onChange={handleInputChange}
                    />
                    <input
                      type="text"
                      name="location"
                      placeholder='-- eg. "New Brunei"'
                      className='text-xs outline-none bg-transparent w-full'
                      value={newOrder.location}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                {/* Decorative Character */}
                <div className='absolute -bottom-8 -right-4'>
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50" fill="none">
                    <path d="M22.7738 18.9627C25.5514 20.3081 27.6672 22.3011 28.8531 24.4117C30.0399 26.5241 30.2758 28.7081 29.4041 30.5078C28.5324 32.3074 26.6725 33.4762 24.2793 33.8545C21.888 34.2324 19.0125 33.8078 16.2349 32.4624C13.4573 31.117 11.3415 29.124 10.1555 27.0133C8.96878 24.901 8.73284 22.717 9.60453 20.9173C10.4762 19.1177 12.3362 17.9489 14.7294 17.5706C17.1207 17.1927 19.9962 17.6173 22.7738 18.9627Z" fill="#0ACF83" stroke="#04B36F" />
                    <ellipse cx="16.3545" cy="24.1872" rx="7" ry="6" transform="rotate(25.8444 16.3545 24.1872)" fill="#4BF1B1" />
                    <mask id="path-3-inside-1_17069_2401" fill="white">
                      <path d="M24.361 28.3029L24.31 28.2782C23.2804 29.5296 20.6903 29.6207 18.1965 28.4128C15.7028 27.2049 14.1685 25.1161 14.5122 23.5324L14.4612 23.5077L18.9137 14.3154L28.8135 19.1106L24.361 28.3029Z" />
                    </mask>
                    <path d="M24.361 28.3029L24.31 28.2782C23.2804 29.5296 20.6903 29.6207 18.1965 28.4128C15.7028 27.2049 14.1685 25.1161 14.5122 23.5324L14.4612 23.5077L18.9137 14.3154L28.8135 19.1106L24.361 28.3029Z" fill="#0ACF83" />
                    <path d="M24.361 28.3029L23.925 29.2029L24.825 29.6388L25.261 28.7389L24.361 28.3029ZM24.31 28.2782L24.7459 27.3783L24.0377 27.0352L23.5378 27.6429L24.31 28.2782ZM14.5122 23.5324L15.4894 23.7445L15.6563 22.9755L14.9481 22.6324L14.5122 23.5324ZM14.4612 23.5077L13.5612 23.0718L13.1253 23.9718L14.0253 24.4077L14.4612 23.5077ZM18.9137 14.3154L19.3496 13.4154L18.4496 12.9795L18.0137 13.8795L18.9137 14.3154ZM28.8135 19.1106L29.7135 19.5466L30.1494 18.6466L29.2494 18.2107L28.8135 19.1106ZM24.361 28.3029L24.7969 27.403L24.7459 27.3783L24.31 28.2782L23.8741 29.1782L23.925 29.2029L24.361 28.3029ZM24.31 28.2782L23.5378 27.6429C23.2779 27.9587 22.7083 28.2439 21.7764 28.2681C20.8693 28.2916 19.7559 28.057 18.6325 27.5128L18.1965 28.4128L17.7606 29.3128C19.1309 29.9765 20.5594 30.3003 21.8282 30.2674C23.0722 30.2352 24.3125 29.8491 25.0822 28.9136L24.31 28.2782ZM18.1965 28.4128L18.6325 27.5128C17.509 26.9687 16.6347 26.2405 16.0908 25.5141C15.532 24.7679 15.4027 24.1442 15.4894 23.7445L14.5122 23.5324L13.5349 23.3204C13.278 24.5043 13.744 25.7168 14.4899 26.7129C15.2506 27.7289 16.3903 28.649 17.7606 29.3128L18.1965 28.4128ZM14.5122 23.5324L14.9481 22.6324L14.8971 22.6077L14.4612 23.5077L14.0253 24.4077L14.0762 24.4324L14.5122 23.5324ZM14.4612 23.5077L15.3612 23.9436L19.8137 14.7514L18.9137 14.3154L18.0137 13.8795L13.5612 23.0718L14.4612 23.5077ZM18.9137 14.3154L18.4778 15.2154L28.3776 20.0106L28.8135 19.1106L29.2494 18.2107L19.3496 13.4154L18.9137 14.3154ZM28.8135 19.1106L27.9135 18.6747L23.461 27.867L24.361 28.3029L25.261 28.7389L29.7135 19.5466L28.8135 19.1106Z" fill="#04B36F" mask="url(#path-3-inside-1_17069_2401)" />
                    <rect x="19.3778" y="15.6514" width="2" height="7" transform="rotate(25.8444 19.3778 15.6514)" fill="#4BF1B1" />
                    <path d="M29.3127 5.46338C33.8911 7.68103 36.0011 12.3006 34.361 15.6866C32.7209 19.0726 27.7881 20.2808 23.2097 18.0631C18.6313 15.8455 16.5213 11.2259 18.1614 7.83989C19.8015 4.4539 24.7343 3.24574 29.3127 5.46338Z" fill="#0ACF83" stroke="#04B36F" />
                    <ellipse cx="23.5472" cy="9.3375" rx="4" ry="3.5" transform="rotate(25.8444 23.5472 9.3375)" fill="#4BF1B1" />
                    <rect x="14.667" y="32.2588" width="2" height="13" transform="rotate(25.8444 14.667 32.2588)" fill="#DDDADA" />
                  </svg>
                </div>
              </div>
            </div>

            {/* MOBILE: Add Order Button (visible only on mobile) */}
            <div className="block sm:hidden w-full">
              <button
                onClick={() => setIsAddOrderSheetOpen(true)}
                className="w-full flex items-center justify-center gap-2 bg-orange-400 text-white py-3 px-4 rounded-xl font-medium hover:bg-orange-500 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Add New Order
              </button>
            </div>

            {/* DESKTOP: Add Order Button (visible only on desktop) */}
            <div className="hidden sm:block">
              <PrimaryButton
                title="Add Order"
                style={{
                  height: 40,
                  fontSize: 16,
                  fontWeight: '400',
                  width: 120
                }}
                onClick={addNewOrder}
              />
            </div>
          </main>

          {/* Divider */}
          {hasSavedOrders && (
            <div className='border border-neutral-200 w-full border-dashed my-2'></div>
          )}

          {/* Added Orders Section */}
          {hasSavedOrders && (
            <section className='flex flex-col gap-3 items-start w-full'>
              <nav className='flex w-full items-center justify-between flex-wrap gap-2'>
                <p className='text-sm sm:text-base font-semibold'>Added Orders ({orders.length})</p>

                {/* Action Buttons */}
                {selectedOrders.length > 0 && (
                  <div className='flex items-center gap-2'>
                    <button 
                      className='text-xs sm:text-sm text-green-600 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-green-50 hover:bg-green-100 transition-colors'
                      onClick={handleAssignToRiders}
                    >
                      Assign Rider
                    </button>
                    <button 
                      className='text-xs sm:text-sm text-orange-400 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 transition-colors'
                      onClick={handleSaveOrders}
                    >
                      Save
                    </button>
                  </div>
                )}
              </nav>

              {/* Select All Checkbox */}
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
                  <span className="text-xs sm:text-sm text-black/70">
                    {selectedOrders.length === orders.length ? 'Deselect All' : 'Select All'} ({selectedOrders.length} of {orders.length})
                  </span>
                </div>
              )}

              {/* Orders Grid */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {orders.map((order) => (
                  <StickerCard
                    key={order.id}
                    order={order}
                    checked={selectedOrders.includes(order.id)}
                    onToggle={() => toggleOrderSelection(order.id)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {!hasSavedOrders && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-dashed w-full">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <p className="text-gray-500 text-center text-sm">
                No orders added yet.<br />
                Tap "Add New Order" to get started.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* MOBILE: Add Order Bottom Sheet */}
      <AddOrderBottomSheet
        isOpen={isAddOrderSheetOpen}
        onClose={() => setIsAddOrderSheetOpen(false)}
        onAddOrder={addNewOrder}
        newOrder={newOrder}
        onInputChange={handleInputChange}
      />

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
}

export default App;