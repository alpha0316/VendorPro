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

type StorageLike = {
  get: (key: string, secure: boolean) => Promise<{ value?: string } | null>;
  set: (key: string, value: string, secure: boolean) => Promise<void>;
};

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

const isValidExtractedOrder = (order: ExtractedOrder | null | undefined): order is ExtractedOrder => {
  if (!order) return false;
  return Boolean(order.name || order.phone || order.product || order.location);
};

const normalizeItemsForUI = (product: string, amount: string) => {
  const itemString = (product || 'Unknown product')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
    .join(', ');

  const parsedAmount = parseFloat(amount);
  const totalPrice = Number.isFinite(parsedAmount) ? `GHC${parsedAmount.toFixed(2)}` : '₵0.00';

  return { itemString: itemString || 'Unknown product', totalPrice };
};

const getStorage = (): StorageLike | null => {
  const maybeStorage = (window as Window & { storage?: StorageLike }).storage;
  if (!maybeStorage) return null;
  if (typeof maybeStorage.get !== 'function' || typeof maybeStorage.set !== 'function') return null;
  return maybeStorage;
};

/* ---------------- RANDOM SOFT COLOR GENERATOR ---------------- */
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
                  className={`w-full flex flex-col gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 ${selectedRider === rider.id
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
                      className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer ${selectedRider === rider.id
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
            className={`px-3 py-2 rounded-full font-medium transition-colors duration-200 ${selectedRider
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
      className="relative w-full overflow-hidden cursor-pointer transition-all"
      style={{ minHeight: `${188 + Math.max(0, parsedLines.length - 1) * 52}px` }}
      onClick={onToggle}
    >
      <StickerBg />
      <div className="relative z-10 px-4 pt-3.5 pb-4">

        {/* Row 1 — name + checkbox */}
        <div className="flex items-center justify-between mx-3 mt-3">
          <p className="text-sm font-bold text-black leading-snug flex-1 text-left">{order.name}</p>
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

        {/* Row 2 — phone/location + item count + total */}
        <div className="flex items-center justify-between mt-1 mx-3">
          <p className="text-xs text-black/50">{order.phone} <span className="mx-0.5">|</span> {order.hall}</p>
          <div className="flex items-center gap-1">
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M10.0502 3.47C10.0502 3.74 9.9052 3.985 9.6752 4.11L8.8052 4.58L8.0652 4.975L6.5302 5.805C6.3652 5.895 6.1852 5.94 6.0002 5.94C5.8152 5.94 5.6352 5.895 5.4702 5.805L2.3252 4.11C2.0952 3.985 1.9502 3.74 1.9502 3.47C1.9502 3.2 2.0952 2.955 2.3252 2.83L3.3102 2.3L4.0952 1.875L5.4702 1.135C5.8002 0.955 6.2002 0.955 6.5302 1.135L9.6752 2.83C9.9052 2.955 10.0502 3.2 10.0502 3.47Z" fill="black" fillOpacity="0.5" />
              <path d="M4.95035 6.39507L2.02535 4.93507C1.80035 4.82007 1.54035 4.83507 1.32535 4.96507C1.11035 5.09507 0.985352 5.32507 0.985352 5.57507V8.34007C0.985352 8.82007 1.25035 9.25007 1.68035 9.46507L4.60535 10.9251C4.70535 10.9751 4.81535 11.0001 4.92535 11.0001C5.05535 11.0001 5.18535 10.9651 5.30035 10.8901C5.51535 10.7601 5.64035 10.5301 5.64035 10.2801V7.51507C5.64535 7.04007 5.38035 6.61007 4.95035 6.39507Z" fill="black" fillOpacity="0.5" />
              <path d="M11.0155 5.57482V8.33982C11.0155 8.81482 10.7505 9.24482 10.3205 9.45982L7.39547 10.9248C7.29547 10.9748 7.18547 10.9998 7.07547 10.9998C6.94547 10.9998 6.81547 10.9648 6.69547 10.8898C6.48547 10.7598 6.35547 10.5298 6.35547 10.2798V7.51982C6.35547 7.03982 6.62047 6.60982 7.05047 6.39482L8.12547 5.85982L8.87547 5.48482L9.97547 4.93482C10.2005 4.81982 10.4605 4.82982 10.6755 4.96482C10.8855 5.09482 11.0155 5.32482 11.0155 5.57482Z" fill="black" fillOpacity="0.5" />
              <path d="M8.80457 4.58L8.06457 4.975L3.30957 2.3L4.09457 1.875L8.68457 4.465C8.73457 4.495 8.77457 4.535 8.80457 4.58Z" fill="black" fillOpacity="0.5" />
              <path d="M8.875 5.48486V6.61986C8.875 6.82486 8.705 6.99486 8.5 6.99486C8.295 6.99486 8.125 6.82486 8.125 6.61986V5.85986L8.875 5.48486Z" fill="black" fillOpacity="0.5" />
            </svg>
            <span className="text-xs text-black/50">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
            <span className="text-black/30 text-xs mx-0.5">·</span> */}
            <span className="text-sm font-bold text-black">{order.price}</span>
          </div>
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
        </div>

        {/* Product rows */}
        <div className="flex flex-col mx-3 mb-12">
          {parsedLines.map(({ name, qty, price }, idx) => (
            <div key={idx}>
              {idx > 0 && (
                <div className="border-t border-dashed border-black/15 my-2.5" />
              )}
              <div className="flex items-center w-full">
                <span className="text-sm text-black flex-1 text-left">{name}</span>
                <span className="text-sm text-black/50 w-6 text-center">{qty}</span>
                <span className="text-sm text-black font-medium w-16 text-right">{price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
};

const PreparedList: React.FC<PreparedListProps> = ({
  orders: incomingOrders,
  goBackToOrderImages,
  goToAddOrders
}) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedOrders, setSavedOrders] = useState<Order[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [isRiderModalOpen, setIsRiderModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<string | null>(null);

  useEffect(() => {
    const transformedOrders = incomingOrders
      .filter(isValidExtractedOrder)
      .map((order, index) => {
        const { itemString, totalPrice } = normalizeItemsForUI(order.product, order.amount);
        return {
          id: `#${String(index + 11).padStart(3, '0')}`,
          name: order.name,
          phone: order.phone,
          hall: order.location,
          item: itemString,
          price: totalPrice
        };
      });
    setOrders(transformedOrders);
  }, [incomingOrders]);

  const [riders] = useState<Rider[]>([
    { id: '1', name: 'John Doe',     phone: '08123456789', totalRides: 24, dateAdded: '26/12/25', rating: 4.6 },
    { id: '2', name: 'Jane Smith',   phone: '08098765432', totalRides: 18, dateAdded: '15/12/25', rating: 4.8 },
    { id: '3', name: 'Mike Johnson', phone: '07012345678', totalRides: 32, dateAdded: '10/12/25', rating: 4.4 },
  ]);

  const hasSavedOrders = savedOrders.length > 0;
  const hasPreparedOrders = orders.length > 0;

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
    );
  };

  const selectAll = () => {
    setSelectedOrders(selectedOrders.length === orders.length ? [] : orders.map(o => o.id));
  };

  const handleSaveOrders = async () => {
    if (selectedOrders.length === 0) { alert('Please select at least one order to save'); return; }
    try {
      const selectedOrderData = orders.filter(o => selectedOrders.includes(o.id));
      const newSavedOrders = [...savedOrders];
      selectedOrderData.forEach(order => {
        if (!newSavedOrders.some(saved => saved.id === order.id)) newSavedOrders.push(order);
      });
      setSavedOrders(newSavedOrders);
      setSelectedOrders([]);
      const storage = getStorage();
      if (storage) await storage.set('savedOrders', JSON.stringify(newSavedOrders), false);
      alert(`${selectedOrderData.length} order(s) saved successfully!`);
    } catch (error) {
      console.error('Error saving orders:', error);
      alert('Failed to save orders. Please try again.');
    }
  };

  const handleAssignToRiders = () => {
    if (selectedOrders.length === 0) { alert('Please select at least one order'); return; }
    setSelectedRider(null);
    setIsRiderModalOpen(true);
  };

  const handleAssignOrder = async (riderId: string) => {
    const rider = riders.find(r => r.id === riderId);
    alert(`Successfully assigned ${selectedOrders.length} order(s) to ${rider?.name}`);
    const newOrders = orders.filter(o => !selectedOrders.includes(o.id));
    const newSavedOrders = savedOrders.filter(o => !selectedOrders.includes(o.id));
    setOrders(newOrders);
    setSavedOrders(newSavedOrders);
    setSelectedOrders([]);
    try {
      const storage = getStorage();
      if (storage) await storage.set('savedOrders', JSON.stringify(newSavedOrders), false);
    } catch (error) {
      console.error('Error updating saved orders:', error);
    }
  };

  useEffect(() => {
    const loadSavedOrders = async () => {
      try {
        setIsLoadingSaved(true);
        const storage = getStorage();
        if (storage) {
          const result = await storage.get('savedOrders', false);
          if (result?.value) setSavedOrders(JSON.parse(result.value));
        }
      } catch (error) {
        console.log('No saved orders found or error loading:', error);
      } finally {
        setIsLoadingSaved(false);
      }
    };
    loadSavedOrders();
  }, []);

  const displayOrders = [...orders, ...savedOrders];

  return (
    <>
      <main className="flex flex-col items-center w-full min-h-screen px-4 sm:px-6 md:px-8">
        {/* HEADER */}
        <div className="flex items-center justify-between w-full max-w-7xl mx-auto mt-4 sm:mt-6 md:mt-8">
          <div onClick={goToAddOrders} className="flex items-center cursor-pointer">
            <img src="/logo.png" alt="Logo" className="h-4 sm:h-5 w-2.5 sm:w-3" />
            <span className="text-red-600 text-base sm:text-lg font-bold">B</span>
            <span className="text-black/50 text-base sm:text-lg font-bold">ites.</span>
          </div>
          <div className="h-5 sm:h-6 px-1 sm:px-1.5 py-1.5 sm:py-2.5 bg-orange-400 rounded-[50px] flex items-center justify-center">
            <div className="text-center text-white text-xs">R 👩🏽‍🍳</div>
          </div>
        </div>

        <section className="flex flex-col items-center gap-5 sm:gap-7 mt-6 sm:mt-10 w-full max-w-7xl">
          {/* NAV */}
          <nav className="flex w-full items-center justify-between">
            <div className="flex gap-2 items-center">
              <button
                onClick={goBackToOrderImages}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#F6F6F6] rounded-full hover:bg-gray-200 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 13L5 8L10 3" stroke="black" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="text-black text-base sm:text-lg font-bold">
                Prepared Order List
                <span className="text-black/50 font-normal ml-1">({displayOrders.length})</span>
              </p>
            </div>

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

          {isLoadingSaved && (
            <div className="text-sm text-gray-500">Loading saved orders...</div>
          )}

          {/* PREPARED ORDERS SECTION */}
          {hasPreparedOrders && (
            <section className='flex flex-col gap-3 items-start w-full'>
              {orders.length > 1 && (
                <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={selectAll}>
                  <CheckCircleIcon
                    defaultChecked={selectedOrders.length === orders.length && orders.length > 0}
                    onChange={selectAll}
                    size={18}
                  />
                  <span className="text-xs sm:text-sm text-black/70">
                    {selectedOrders.length === orders.length ? 'Deselect All' : 'Select All'} ({selectedOrders.length} of {orders.length})
                  </span>
                </div>
              )}

              {/* Unified grid — mobile card design at every breakpoint */}
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

          {hasPreparedOrders && hasSavedOrders && (
            <div className='border border-neutral-200 w-full border-dashed my-2'></div>
          )}

          {/* SAVED ORDERS SECTION */}
          {hasSavedOrders && (
            <section className='flex flex-col gap-3 items-start w-full'>
              <nav className='flex w-full items-center justify-between'>
                <p className='text-sm sm:text-base font-semibold'>Saved Orders ({savedOrders.length})</p>
              </nav>

              {savedOrders.length > 1 && (
                <div
                  className="flex items-center gap-2 mb-2 cursor-pointer"
                  onClick={() => {
                    if (selectedOrders.length === savedOrders.length) {
                      setSelectedOrders(selectedOrders.filter(id => !savedOrders.some(o => o.id === id)));
                    } else {
                      const savedIds = savedOrders.map(o => o.id);
                      setSelectedOrders(Array.from(new Set([...selectedOrders, ...savedIds])));
                    }
                  }}
                >
                  <CheckCircleIcon
                    defaultChecked={selectedOrders.length === savedOrders.length && savedOrders.length > 0}
                    onChange={() => {}}
                    size={18}
                  />
                  <span className="text-xs sm:text-sm text-black/70">
                    {selectedOrders.length === savedOrders.length ? 'Deselect All' : 'Select All'}
                  </span>
                </div>
              )}

              {/* Unified grid — mobile card design at every breakpoint */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {savedOrders.map((order) => (
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
          {!hasPreparedOrders && !hasSavedOrders && !isLoadingSaved && (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-dashed w-full">
              <div className="text-gray-400 text-4xl mb-4">📦</div>
              <p className="text-gray-500 text-center text-sm">
                No prepared orders yet.<br />
                Go back to extract orders from images.
              </p>
              <button onClick={goBackToOrderImages} className="mt-4 text-red-600 text-sm font-medium hover:underline">
                Go to Order Images
              </button>
            </div>
          )}
        </section>
      </main>

      <RiderModal
        isOpen={isRiderModalOpen}
        onClose={() => { setIsRiderModalOpen(false); setSelectedRider(null); }}
        onAssign={handleAssignOrder}
        riders={riders}
        selectedRider={selectedRider}
        onSelectRider={setSelectedRider}
      />
    </>
  );
};

export default PreparedList;