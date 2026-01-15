import React from "react";

/* ---------------- CHECK ICON ---------------- */
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
            className="cursor-pointer"
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
            className="cursor-pointer"
        >
            <circle cx="10" cy="10" r="9" stroke="#C7C7C7" strokeWidth="2" fill="none" />
        </svg>
    );
};

/* ---------------- SINGLE ORDER ITEM ---------------- */
type Order = {
    id: string;
    name: string;
    phone: string;
    location: string;
    item: string;
    amount: string;
    date: Date;
};

interface OrderItemProps {
    order: Order;
    checked: boolean;
    onToggle: () => void;
    showDateHeader?: boolean;
}

/* ---------------- UPDATED ORDER ITEM COMPONENT ---------------- */
const OrderItem: React.FC<{
  order: Order;
  checked: boolean;
  onToggle: () => void;
}> = ({ order, checked, onToggle }) => {
  const { id, name, phone, hall, item, price } = order;
  
  // Generate random soft color for this order
  const orderColor = getRandomSoftColor();
  
  // Parse the item string to extract products, quantities and prices
  const parseOrderItems = (itemString: string): Array<{name: string, quantity: number, price?: string}> => {
    const items: Array<{name: string, quantity: number, price?: string}> = [];
    
    // Split by comma
    const parts = itemString.split(',').map(p => p.trim());
    
    parts.forEach(part => {
      // Check for pattern like "2 Shawarmas (₵60.00)" 
      const patternWithPrice = /^(\d+)\s+([^(]+?)\s*\(₵(\d+(?:\.\d{2})?)\)$/;
      const matchWithPrice = part.match(patternWithPrice);
      
      if (matchWithPrice) {
        const quantity = parseInt(matchWithPrice[1]);
        const name = matchWithPrice[2].trim();
        const price = `₵${matchWithPrice[3]}`;
        items.push({ name, quantity, price });
      } else {
        // Check for pattern like "2 Shawarmas" (no price)
        const patternNoPrice = /^(\d+)\s+(.+)$/;
        const matchNoPrice = part.match(patternNoPrice);
        
        if (matchNoPrice) {
          const quantity = parseInt(matchNoPrice[1]);
          const name = matchNoPrice[2].trim();
          items.push({ name, quantity });
        } else {
          // No quantity specified, assume 1
          items.push({ name: part, quantity: 1 });
        }
      }
    });
    
    return items;
  };
  
  const orderItems = parseOrderItems(item);

  return (
    <div className={`flex flex-col w-full rounded-lg transition-all ${checked ? 'ring-2 ring-green-500' : ''}`}>
      {/* Header Section */}
      <div 
        className={`flex items-center justify-between w-full p-3 ${orderColor} rounded-t-lg cursor-pointer hover:opacity-90 transition-opacity duration-200`}
        onClick={onToggle}
      >
        <div className='flex gap-3 items-start justify-start'>
          <CheckCircleIcon checked={checked} onToggle={onToggle} size={18} />
          
          <div className='flex gap-2 items-start justify-start'>
            <p className='text-black/70 text-xs font-semibold'>{id}</p>
            <div className='flex gap-1 flex-col items-start justify-start'>
              <p className='text-black text-sm font-semibold'>{name}</p>
              <div className="flex justify-center items-center gap-2">
                <p className="text-black/70 text-[10px] font-normal">{phone}</p>
                <div className="w-px h-3 bg-gray-600/30"></div>
                <p className="text-black/70 text-[10px]">{hall}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-black text-sm font-semibold">{price}</p>
        </div>
      </div>

      {/* Orders Card */}
      <div className={`${orderColor} rounded-b-lg p-4 relative shadow-sm`}>
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
          </svg>
          <p className="text-gray-700 text-xs font-medium">Orders</p>
        </div>

        {/* Order Items - Show item, quantity and price in table format */}
        <div className="flex flex-col gap-2">
          {orderItems.map((orderItem, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between py-2">
                {/* ITEM NAME - left aligned */}
                <p className="text-black text-sm font-normal capitalize flex-1">
                  {orderItem.name}
                </p>
                
                {/* QUANTITY AND PRICE TOGETHER - right aligned */}
                <div className="flex items-center gap-2">
                  <p className="text-gray-700 text-sm font-normal">
                    {orderItem.quantity}
                  </p>
                  <span className="text-gray-400">•</span>
                  <p className="text-black text-sm font-normal">
                    {orderItem.price || '—'}
                  </p>
                </div>
              </div>
              {idx < orderItems.length - 1 && (
                <div className="border-b border-dashed border-gray-600/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ---------------- ORDERS LIST ---------------- */
interface OrdersListProps {
    onCheckChange?: (checkedItems: Record<string, boolean>) => void;
    orders?: Order[];
}

const OrdersList: React.FC<OrdersListProps> = ({ onCheckChange, orders = [] }) => {
    // Track checked state for each order by id
    const [checkedItems, setCheckedItems] = React.useState<Record<string, boolean>>({});

    const handleToggle = (id: string) => {
        const newCheckedState = {
            ...checkedItems,
            [id]: !checkedItems[id],
        };
        setCheckedItems(newCheckedState);

        // Notify parent component
        onCheckChange?.(newCheckedState);
    };

    // Group orders by date for "Last Week" and "Past Orders" views
    const groupOrdersByDate = (orders: Order[]) => {
        const groups: Record<string, Order[]> = {};
        
        orders.forEach(order => {
            const dateKey = order.date.toDateString(); // Unique key for each day
            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }
            groups[dateKey].push(order);
        });
        
        return groups;
    };

    // Sort date groups chronologically (most recent first)
    const getSortedDateGroups = (groups: Record<string, Order[]>) => {
        return Object.entries(groups).sort(([dateA], [dateB]) => {
            return new Date(dateB).getTime() - new Date(dateA).getTime();
        });
    };

    // Check if we should show date headers (for Last Week and Past Orders)
    const shouldShowDateHeaders = orders.length > 0 && (
        // This logic should come from parent component, but for now we'll check if we have multiple dates
        new Set(orders.map(order => order.date.toDateString())).size > 1
    );

    // Group orders if we need date headers
    const dateGroups = shouldShowDateHeaders ? groupOrdersByDate(orders) : { 'all': orders };
    const sortedGroups = getSortedDateGroups(dateGroups);

    // Handle empty state
    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 w-full">
                <p className="text-black/50 text-sm">No orders found</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            {sortedGroups.map(([dateKey, groupOrders]) => (
                <div key={dateKey} className="flex flex-col gap-3">
                    {groupOrders.map((order, index) => (
                        <OrderItem
                            key={order.id}
                            order={order}
                            checked={!!checkedItems[order.id]}
                            onToggle={() => handleToggle(order.id)}
                            showDateHeader={shouldShowDateHeaders && index === 0}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default OrdersList;