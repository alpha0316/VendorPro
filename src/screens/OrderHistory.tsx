import './../App.css'
import React from 'react'

interface AppProps {
  goToAddOrders: () => void;
}

type OrderStatus = 'Pending' | 'Packaged' | 'In Transit' | 'Completed' | 'Pickup';
type DateFilter = 'Today' | 'Yesterday' | 'Last Week' | 'Past Orders';

const ORDER_STATUSES: OrderStatus[] = ['Pending', 'Packaged', 'In Transit', 'Completed', 'Pickup'];
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

interface Order {
  id: string;
  name: string;
  phone: string;
  location: string;
  item: string;
  amount: string;
  status: OrderStatus;
  date: Date;
}

type PersistedOrderLike = Partial<{
  id: string;
  name: string;
  phone: string;
  hall: string;
  location: string;
  item: string;
  product: string;
  price: string;
  amount: string;
  status: string;
  date: string;
}>;

type StorageLike = {
  get: (key: string, secure: boolean) => Promise<{ value?: string } | null>;
};

const sampleOrders: Order[] = [
  {
    id: "#011",
    name: "Essandoh Prince Takyi",
    phone: "055 414 4611",
    location: "NYA",
    item: "Shawarma",
    amount: "GHC 65",
    status: "Pending",
    date: new Date(),
  },
  {
    id: "#012",
    name: "Kwame Boateng",
    phone: "024 889 1023",
    location: "Unity Hall",
    item: "Jollof",
    amount: "GHC 40",
    status: "Packaged",
    date: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: "#013",
    name: "Akosua Mensah",
    phone: "020 554 7789",
    location: "Ayeduase",
    item: "Pizza",
    amount: "GHC 90",
    status: "In Transit",
    date: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: "#014",
    name: "Kwabena Osei",
    phone: "054 123 4567",
    location: "Katanga",
    item: "Burger",
    amount: "GHC 55",
    status: "Completed",
    date: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: "#015",
    name: "Esi Asare",
    phone: "027 890 1234",
    location: "Republic Hall",
    item: "Fried Rice",
    amount: "GHC 75",
    status: "Pickup",
    date: new Date(new Date().setDate(new Date().getDate() - 8)),
  },
  {
    id: "#016",
    name: "Yaw Boateng",
    phone: "023 456 7890",
    location: "GTUC",
    item: "Chicken & Chips",
    amount: "GHC 60",
    status: "Pending",
    date: new Date('2024-11-15'),
  },
  {
    id: "#018",
    name: "Yaw Boateng",
    phone: "023 456 7890",
    location: "GTUC",
    item: "Chicken & Chips",
    amount: "GHC 60",
    status: "Pending",
    date: new Date('2024-11-15'),
  },
  {
    id: "#017",
    name: "Yaw Boateng",
    phone: "023 456 7890",
    location: "GTUC",
    item: "Chicken & Chips",
    amount: "GHC 60",
    status: "Completed",
    date: new Date('2024-11-17'),
  },
];

function App({ goToAddOrders }: AppProps) {

  const [] = React.useState(false);
  const [] = React.useState<Record<string, boolean>>({});
  const [] = React.useState(true);
  const [selectedDateFilter] = React.useState<DateFilter>('Today');
  const [orders, setOrders] = React.useState<Order[]>(sampleOrders);
  const [draggedOrderId, setDraggedOrderId] = React.useState<string | null>(null);
  const [, setDragOverStatus] = React.useState<OrderStatus | null>(null);
  const [expandedProducts, setExpandedProducts] = React.useState<Record<string, boolean>>({});

  // ── Mobile-only state ──────────────────────────────────────────────────────
  const [mobileSelectedStatus, setMobileSelectedStatus] = React.useState<OrderStatus>('Pending');
  const [mobileCheckedOrders, setMobileCheckedOrders] = React.useState<Record<string, boolean>>({});
  const [showBottomSheet, setShowBottomSheet] = React.useState(false);

  const getStorage = (): StorageLike | null => {
    const maybeStorage = (window as Window & { storage?: StorageLike }).storage;
    if (!maybeStorage || typeof maybeStorage.get !== 'function') return null;
    return maybeStorage;
  };

  const normalizeAmount = (value?: string): string => {
    if (!value) return '₵0.00';
    const cleaned = value.trim();
    if (!cleaned) return '₵0.00';
    if (cleaned.includes('GHC') || cleaned.toUpperCase().includes('GHC')) return cleaned;
    const parsed = parseFloat(cleaned.replace(/[^\d.]/g, ''));
    if (Number.isFinite(parsed)) return `GHC${parsed.toFixed(2)}`;
    return cleaned;
  };

  const normalizeStatus = (value?: string): OrderStatus => {
    if (!value) return 'Pending';
    const normalized = value.toLowerCase().trim();
    if (normalized === 'pending') return 'Pending';
    if (normalized === 'packaged') return 'Packaged';
    if (normalized === 'in transit' || normalized === 'in-transit') return 'In Transit';
    if (normalized === 'completed') return 'Completed';
    if (normalized === 'pickup' || normalized === 'pick up' || normalized === 'pick-up') return 'Pickup';
    return 'Pending';
  };

  const normalizeDate = (value?: string): Date => {
    if (!value) return new Date();
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const getDateFilter = React.useCallback((date: Date, filter: DateFilter): boolean => {
    const isToday = (checkDate: Date) => {
      const today = new Date();
      return checkDate.getDate() === today.getDate() &&
        checkDate.getMonth() === today.getMonth() &&
        checkDate.getFullYear() === today.getFullYear();
    };

    const isYesterday = (checkDate: Date) => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return checkDate.getDate() === yesterday.getDate() &&
        checkDate.getMonth() === yesterday.getMonth() &&
        checkDate.getFullYear() === yesterday.getFullYear();
    };

    const isLastWeek = (checkDate: Date) => {
      const now = new Date();
      const today = new Date(now);
      const dayOfWeek = today.getDay();
      const lastMonday = new Date(today);
      lastMonday.setDate(today.getDate() - dayOfWeek - 6);
      lastMonday.setHours(0, 0, 0, 0);
      const lastSunday = new Date(today);
      lastSunday.setDate(today.getDate() - dayOfWeek);
      lastSunday.setHours(23, 59, 59, 999);
      return checkDate >= lastMonday && checkDate <= lastSunday;
    };

    const isPastOrder = (checkDate: Date) => {
      const twoWeeksAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      twoWeeksAgo.setHours(0, 0, 0, 0);
      return checkDate < twoWeeksAgo;
    };

    switch (filter) {
      case 'Today': return isToday(date);
      case 'Yesterday': return isYesterday(date);
      case 'Last Week': return isLastWeek(date);
      case 'Past Orders': return isPastOrder(date);
      default: return true;
    }
  }, []);

  const filteredOrders = React.useMemo(
    () => orders.filter(order => getDateFilter(order.date, selectedDateFilter)),
    [orders, selectedDateFilter, getDateFilter]
  );

  // Mobile orders: all orders for the selected tab, no date filter
  const mobileOrders = React.useMemo(
    () => orders.filter(order => order.status === mobileSelectedStatus),
    [orders, mobileSelectedStatus]
  );

  // ── Mobile handlers ────────────────────────────────────────────────────────
  const handleMobileCheck = (orderId: string, checked: boolean) => {
    const updated = { ...mobileCheckedOrders, [orderId]: checked };
    setMobileCheckedOrders(updated);
    // Don't automatically show bottom sheet, let user click Move button
  };

  const handleMobileStatusChange = (newStatus: OrderStatus) => {
    const selectedIds = Object.entries(mobileCheckedOrders)
      .filter(([, v]) => v)
      .map(([k]) => k);
    setOrders(prev =>
      prev.map(o => selectedIds.includes(o.id) ? { ...o, status: newStatus } : o)
    );
    setMobileCheckedOrders({});
    setShowBottomSheet(false);
  };

  const mobileSelectedCount = Object.values(mobileCheckedOrders).filter(Boolean).length;

  const getLastWeekDateRange = () => {
    const now = new Date();
    const today = new Date(now);
    const dayOfWeek = today.getDay();
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - dayOfWeek - 6);
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - dayOfWeek);
    const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    return `${formatDate(lastMonday)} - ${formatDate(lastSunday)}`;
  };

  const getMainTitle = () => {
    switch (selectedDateFilter) {
      case 'Today': return 'Your Orders Today';
      case 'Yesterday': return 'Your Orders Yesterday';
      case 'Last Week': return `Your Orders Last Week (${getLastWeekDateRange()})`;
      case 'Past Orders': return 'Your Past Orders';
      default: return 'Your Orders This Week';
    }
  };

  const getOrderCount = () => filteredOrders.length;

  const handleDragStart = (orderId: string) => setDraggedOrderId(orderId);

  const handleDragEnd = () => {
    setDraggedOrderId(null);
    setDragOverStatus(null);
  };

  const handleDropToStatus = (newStatus: OrderStatus) => {
    if (!draggedOrderId) return;
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === draggedOrderId ? { ...order, status: newStatus } : order
      )
    );
    setDraggedOrderId(null);
    setDragOverStatus(null);
  };

  const getStickerColor = (order: Order): string => {
    const seed = `${order.id}-${order.phone}-${order.name}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return STICKER_COLORS[hash % STICKER_COLORS.length];
  };

  const getItemCount = (item: string): number =>
    item.split(',').map(x => x.trim()).filter(Boolean).length || 1;

  const getProductLines = (item: string): string[] =>
    item.split(',').map(x => x.trim()).filter(Boolean);

  const kanbanOrdersByStatus = React.useMemo(() => {
    return ORDER_STATUSES.reduce<Record<OrderStatus, Order[]>>((acc, status) => {
      acc[status] = filteredOrders.filter(order => order.status === status);
      return acc;
    }, {
      Pending: [],
      Packaged: [],
      'In Transit': [],
      Completed: [],
      Pickup: [],
    });
  }, [filteredOrders]);

  React.useEffect(() => {
    const loadSavedOrders = async () => {
      const parsePayload = (raw: string | null): PersistedOrderLike[] => {
        if (!raw) return [];
        try {
          const parsed = JSON.parse(raw);
          return Array.isArray(parsed) ? parsed : [];
        } catch {
          return [];
        }
      };

      try {
        let persisted: PersistedOrderLike[] = [];
        const storage = getStorage();
        if (storage) {
          const response = await storage.get('savedOrders', false);
          persisted = parsePayload(response?.value ?? null);
        }
        if (persisted.length === 0 && typeof window !== 'undefined' && window.localStorage) {
          persisted = parsePayload(window.localStorage.getItem('savedOrders'));
        }
        if (persisted.length === 0) return;

        const normalized: Order[] = persisted.map((order, index) => ({
          id: order.id || `#${String(index + 100).padStart(3, '0')}`,
          name: order.name?.trim() || 'Unknown',
          phone: order.phone?.trim() || 'No phone',
          location: order.location?.trim() || order.hall?.trim() || 'Pick-up',
          item: order.item?.trim() || order.product?.trim() || 'Unknown item',
          amount: normalizeAmount(order.amount || order.price),
          status: normalizeStatus(order.status),
          date: normalizeDate(order.date),
        }));
        setOrders(normalized);
      } catch (error) {
        console.error('Failed to load saved orders for history:', error);
      }
    };
    loadSavedOrders();
  }, []);

  // ── Shared sticky-note card renderer ──────────────────────────────────────
  const renderStickerCard = (
    order: Order,
    opts: {
      draggable?: boolean;
      showCheckbox?: boolean;
      isChecked?: boolean;
      onCheck?: (id: string, checked: boolean) => void;
      fullWidth?: boolean;
    } = {}
  ) => {
    const { draggable = false, showCheckbox = false, isChecked = false, onCheck, fullWidth = false } = opts;
    const orderKey = `${order.id}-${order.phone}-${order.date.getTime()}`;
    const stickerColor = getStickerColor(order);
    const filterId = `sticker-filter-${orderKey.replace(/[^a-zA-Z0-9_-]/g, '')}`;

    // ── SVG background (shared) ──────────────────────────────────────────────
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

    // ── MOBILE layout ────────────────────────────────────────────────────────
    if (fullWidth) {
      const productLines = getProductLines(order.item);
      const parsedLines = productLines.map(l => parseProductLine(l));
      const itemCount = productLines.length || 1;

      return (
        <article
          key={orderKey}
          className="relative w-full overflow-hidden"
          style={{ minHeight: `${188 + Math.max(0, parsedLines.length - 1) * 52}px` }}
        >
          <StickerBg />
          <div className="relative z-10 px-4 pt-3.5 pb-4">

            {/* Row 1 — name + checkbox */}
            <div className="flex items-center justify-between mx-3 mt-3">
              <p className="text-sm font-bold text-black leading-snug flex-1 text-left ">{order.name}</p>
              {showCheckbox ? (
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={e => onCheck?.(order.id, e.target.checked)}
                  className="w-4 h-4 rounded accent-orange-400 cursor-pointer shrink-0"
                  onClick={e => e.stopPropagation()}
                />
              ) : (
                <div className="w-5 h-5 rounded-full bg-black/10 shrink-0" />
              )}
            </div>

            {/* Row 2 — phone/location + item count + total */}
            <div className="flex items-center justify-between mt-1 mx-3">
              <p className="text-xs text-black/50">{order.phone} <span className="mx-0.5">|</span> {order.location}</p>
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10.0502 3.47C10.0502 3.74 9.9052 3.985 9.6752 4.11L8.8052 4.58L8.0652 4.975L6.5302 5.805C6.3652 5.895 6.1852 5.94 6.0002 5.94C5.8152 5.94 5.6352 5.895 5.4702 5.805L2.3252 4.11C2.0952 3.985 1.9502 3.74 1.9502 3.47C1.9502 3.2 2.0952 2.955 2.3252 2.83L3.3102 2.3L4.0952 1.875L5.4702 1.135C5.8002 0.955 6.2002 0.955 6.5302 1.135L9.6752 2.83C9.9052 2.955 10.0502 3.2 10.0502 3.47Z" fill="black" fill-opacity="0.5" />
                  <path d="M4.95035 6.39507L2.02535 4.93507C1.80035 4.82007 1.54035 4.83507 1.32535 4.96507C1.11035 5.09507 0.985352 5.32507 0.985352 5.57507V8.34007C0.985352 8.82007 1.25035 9.25007 1.68035 9.46507L4.60535 10.9251C4.70535 10.9751 4.81535 11.0001 4.92535 11.0001C5.05535 11.0001 5.18535 10.9651 5.30035 10.8901C5.51535 10.7601 5.64035 10.5301 5.64035 10.2801V7.51507C5.64535 7.04007 5.38035 6.61007 4.95035 6.39507Z" fill="black" fill-opacity="0.5" />
                  <path d="M11.0155 5.57482V8.33982C11.0155 8.81482 10.7505 9.24482 10.3205 9.45982L7.39547 10.9248C7.29547 10.9748 7.18547 10.9998 7.07547 10.9998C6.94547 10.9998 6.81547 10.9648 6.69547 10.8898C6.48547 10.7598 6.35547 10.5298 6.35547 10.2798V7.51982C6.35547 7.03982 6.62047 6.60982 7.05047 6.39482L8.12547 5.85982L8.87547 5.48482L9.97547 4.93482C10.2005 4.81982 10.4605 4.82982 10.6755 4.96482C10.8855 5.09482 11.0155 5.32482 11.0155 5.57482Z" fill="black" fill-opacity="0.5" />
                  <path d="M8.80457 4.58L8.06457 4.975L3.30957 2.3L4.09457 1.875L8.68457 4.465C8.73457 4.495 8.77457 4.535 8.80457 4.58Z" fill="black" fill-opacity="0.5" />
                  <path d="M8.875 5.48486V6.61986C8.875 6.82486 8.705 6.99486 8.5 6.99486C8.295 6.99486 8.125 6.82486 8.125 6.61986V5.85986L8.875 5.48486Z" fill="black" fill-opacity="0.5" />
                </svg>
                <span className="text-xs text-black/50">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</span>
                <span className="text-black/30 text-xs mx-0.5">·</span>
                <span className="text-sm font-bold text-black">{order.amount}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-black/10 mt-3 mb-2.5" />

            {/* Orders label */}
            <div className="flex items-center gap-1.5 mb-2 mx-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M8.37053 1.1665H5.62887C5.0222 1.1665 4.52637 1.6565 4.52637 2.26317V2.8115C4.52637 3.41817 5.01637 3.90817 5.62303 3.90817H8.37053C8.9772 3.90817 9.4672 3.41817 9.4672 2.8115V2.26317C9.47303 1.6565 8.9772 1.1665 8.37053 1.1665Z" fill="black" fill-opacity="0.4" />
                <path d="M10.0564 2.81153C10.0564 3.73903 9.29811 4.49737 8.37061 4.49737H5.62895C4.70145 4.49737 3.94311 3.73903 3.94311 2.81153C3.94311 2.48487 3.59311 2.2807 3.30145 2.43237C2.47895 2.86987 1.91895 3.73903 1.91895 4.73653V10.2257C1.91895 11.6607 3.09145 12.8332 4.52645 12.8332H9.47311C10.9081 12.8332 12.0806 11.6607 12.0806 10.2257V4.73653C12.0806 3.73903 11.5206 2.86987 10.6981 2.43237C10.4064 2.2807 10.0564 2.48487 10.0564 2.81153ZM7.22145 9.88737H4.66645C4.42728 9.88737 4.22895 9.68903 4.22895 9.44987C4.22895 9.2107 4.42728 9.01237 4.66645 9.01237H7.22145C7.46061 9.01237 7.65895 9.2107 7.65895 9.44987C7.65895 9.68903 7.46061 9.88737 7.22145 9.88737ZM8.74978 7.55403H4.66645C4.42728 7.55403 4.22895 7.3557 4.22895 7.11653C4.22895 6.87737 4.42728 6.67903 4.66645 6.67903H8.74978C8.98895 6.67903 9.18728 6.87737 9.18728 7.11653C9.18728 7.3557 8.98895 7.55403 8.74978 7.55403Z" fill="black" fill-opacity="0.4" />
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

            {/* Track Order */}
            <div className="flex justify-end my-4 mx-3">
              <button className="text-sm font-semibold text-green-600">
                Track Order
              </button>
            </div>

          </div>
        </article>
      );
    }

    // ── DESKTOP layout (original) ────────────────────────────────────────────
    const itemCount = getItemCount(order.item);
    const productsExpanded = Boolean(expandedProducts[orderKey]);
    const productLines = getProductLines(order.item);

    return (
      <article
        key={orderKey}
        className={`relative overflow-hidden p-3 cursor-grab active:cursor-grabbing transition-transform ${productsExpanded ? 'min-h-44' : 'min-h-31'} ${draggable && draggedOrderId === order.id ? 'opacity-50' : ''}`}
        draggable={draggable}
        onDragStart={draggable ? () => handleDragStart(order.id) : undefined}
        onDragEnd={draggable ? handleDragEnd : undefined}
      >
        <StickerBg />
        <div className="relative z-10">
          <div className="flex items-center justify-between mt-0.5 ml-2 mr-2">
            <p className="text-sm font-semibold text-black">{order.name}</p>
          </div>
          <p className="text-xs text-black/60 mt-1 text-left ml-2">
            {order.phone} <span className="mx-1">|</span> {order.location}
          </p>
          <div className="flex items-center justify-between mt-4 mx-2">
            <p className="text-sm font-semibold text-black">{order.amount}</p>
            <p className="text-sm text-black/60">{itemCount} {itemCount === 1 ? 'Item' : 'Items'}</p>
          </div>
          <div className="mt-3 flex items-center">
            <button
              type="button"
              onClick={() => setExpandedProducts(prev => ({ ...prev, [orderKey]: !prev[orderKey] }))}
              className="text-xs font-medium text-black/70 underline underline-offset-2 ml-28 mb-2"
            >
              {productsExpanded ? 'Hide Products' : 'View Products'}
            </button>
            {order.status === 'In Transit' && (
              <button className="text-xs font-medium text-green-700 underline underline-offset-2">
                Track Order
              </button>
            )}
          </div>
          {productsExpanded && (
            <ul className="mt-2 list-disc pl-4 text-xs text-black/70 space-y-0.5">
              {productLines.map((line, idx) => (
                <li key={`${orderKey}-line-${idx}`}>{line}</li>
              ))}
            </ul>
          )}
        </div>
      </article>
    );
  };

  return (
    <>
      <main className='flex flex-col items-center w-full gap-1.5'>

        <div className='flex items-center justify-between w-full px-4 sm:px-6 md:px-8 lg:w-360 lg:mx-auto mt-4 sm:mt-6 md:mt-8'>
          <div
            onClick={goToAddOrders}
            className="flex items-center cursor-pointer"
          >
            <img
              src="/logo.png"
              alt="Logo"
              className="h-4 sm:h-5 w-2.5 sm:w-3"
            />
            <span className="text-red-600 text-base sm:text-lg font-bold">B</span>
            <span className="text-black/50 text-base sm:text-lg font-bold">ites.</span>
          </div>

          <div className="h-5 sm:h-6 sm:px-1.5 py-1.5 sm:py-2.5 bg-orange-400 rounded-[50px] flex items-center justify-center">
            <div className="text-center text-white text-xs">R 👩🏽‍🍳</div>
          </div>
        </div>

        <section className='flex flex-col w-full items-center justify-center gap-8'>

          {/* ═══════════════════════════════════════════════════════════════════
              DESKTOP KANBAN VIEW — untouched
          ════════════════════════════════════════════════════════════════════ */}
          <section className="hidden min-[788px]:flex flex-col w-full gap-4">
            <aside className="flex items-center justify-between mx-8 my-2">
              <p className="text-black text-base font-bold">
                {getMainTitle()} <span className="text-black/50 font-normal">({getOrderCount()})</span>
              </p>
            </aside>

            <div className="w-full overflow-x-auto pb-2 mx-4">
              <div className="flex gap-4 min-w-max">
                {ORDER_STATUSES.map((status) => (
                  <div
                    key={status}
                    className="w-64 bg-neutral-50 rounded-2xl p-3 flex flex-col gap-3 transition-colors"
                    onDragOver={(event) => { event.preventDefault(); setDragOverStatus(status); }}
                    onDragLeave={() => setDragOverStatus(current => (current === status ? null : current))}
                    onDrop={(event) => { event.preventDefault(); handleDropToStatus(status); }}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-black">{status}</p>
                      <span className="text-xs text-black/50">{kanbanOrdersByStatus[status].length}</span>
                    </div>

                    <div className="flex flex-col gap-2 max-h-135 overflow-y-auto">
                      {kanbanOrdersByStatus[status].map(order =>
                        renderStickerCard(order, { draggable: true })
                      )}

                      {kanbanOrdersByStatus[status].length === 0 && (
                        <div className='bg-white rounded-xl border border-dashed border-black/10 text-center h-34 flex items-center justify-center'>
                          <p className="text-xs text-black/40">No orders</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ═══════════════════════════════════════════════════════════════════
              MOBILE VIEW
          ════════════════════════════════════════════════════════════════════ */}
          <section className="w-full min-[788px]:hidden flex flex-col items-center justify-center gap-2 pb-32">

            {/* Header with Status and Move Button */}
            <aside className="flex flex-row items-center justify-between w-full px-4">
              <p className="text-black text-base font-bold">
                {mobileSelectedStatus}{' '}
                <span className="text-black/50 font-normal">({mobileOrders.length})</span>
              </p>
              
              {/* Move Button - Only shows when items are selected */}
              {mobileSelectedCount > 0 && (
                <button
                  onClick={() => setShowBottomSheet(true)}
                  className="flex items-center gap-1.5  text-orange-400  rounded-full text-sm font-medium transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                  Move ({mobileSelectedCount})
                </button>
              )}
            </aside>

            <main className='flex w-full flex-col items-start justify-center gap-3'>

              {/* Status tabs */}
                <div className='relative w-full'>
                {/* Full-width track line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-black/10" />
                <nav className='flex w-full overflow-x-auto scrollbar-hide ml-1'>
                  {ORDER_STATUSES.map(status => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => {
                    setMobileSelectedStatus(status);
                    setMobileCheckedOrders({});
                    setShowBottomSheet(false);
                    }}
                    className={`relative text-sm pb-1.5 px-3 flex-1 min-w-max whitespace-nowrap transition-colors ${mobileSelectedStatus === status
                    ? 'text-green-600 font-medium'
                    : 'text-black/50'
                    }`}
                  >
                    {status}
                    {/* Active indicator — sits on top of the track */}
                    {mobileSelectedStatus === status && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-400 rounded-full" />
                    )}
                  </button>
                  ))}
                </nav>
                </div>

              {/* Sticky note cards */}
              <section className='flex flex-col items-center justify-center gap-3 w-full px-3'>
                {mobileOrders.length === 0 ? (
                  <div className="w-full rounded-xl border border-dashed border-black/10 bg-neutral-50 py-12 flex items-center justify-center">
                    <p className="text-sm text-black/40">No {mobileSelectedStatus.toLowerCase()} orders</p>
                  </div>
                ) : (
                  mobileOrders.map(order =>
                    renderStickerCard(order, {
                      showCheckbox: true,
                      isChecked: Boolean(mobileCheckedOrders[order.id]),
                      onCheck: handleMobileCheck,
                      fullWidth: true,
                    })
                  )
                )}
              </section>

            </main>
          </section>

        </section>
      </main>

      {/* ═════════════════════════════════════════════════════════════════════
          MOBILE BOTTOM SHEET — status actions
      ══════════════════════════════════════════════════════════════════════ */}
      {showBottomSheet && (
        <div className="fixed inset-0 z-50 min-[788px]:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
            onClick={() => {
              setShowBottomSheet(false);
              // Don't clear selections on backdrop click
            }}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl pt-3 pb-8 px-5 shadow-2xl animate-slide-up">
            {/* Drag handle */}
            <div className="w-10 h-1 bg-black/15 rounded-full mx-auto mb-4" />

            {/* Title */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-base font-bold text-black">
                Move {mobileSelectedCount} {mobileSelectedCount === 1 ? 'order' : 'orders'} to…
              </p>
              <button
                type="button"
                onClick={() => { setShowBottomSheet(false); }}
                className="w-7 h-7 rounded-full bg-black/8 flex items-center justify-center text-black/50 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Status options */}
            <div className="flex flex-col gap-2">
              {(ORDER_STATUSES.filter(s => s !== mobileSelectedStatus) as OrderStatus[]).map(status => {
                const config: Record<OrderStatus, { color: string; bg: string; icon: React.ReactNode }> = {
                  Pending: {
                    color: 'text-orange-500',
                    bg: 'bg-orange-50',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-500">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                    ),
                  },
                  Packaged: {
                    color: 'text-blue-600',
                    bg: 'bg-blue-50',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                      </svg>
                    ),
                  },
                  'In Transit': {
                    color: 'text-purple-600',
                    bg: 'bg-purple-50',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-600">
                        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                      </svg>
                    ),
                  },
                  Completed: {
                    color: 'text-green-600',
                    bg: 'bg-green-50',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                      </svg>
                    ),
                  },
                  Pickup: {
                    color: 'text-rose-500',
                    bg: 'bg-rose-50',
                    icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                    ),
                  },
                };
                const c = config[status];
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => handleMobileStatusChange(status)}
                    className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl ${c.bg} active:opacity-70 transition-opacity`}
                  >
                    {c.icon}
                    <span className={`text-sm font-semibold ${c.color}`}>{status}</span>
                    <svg className="ml-auto text-black/30" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;