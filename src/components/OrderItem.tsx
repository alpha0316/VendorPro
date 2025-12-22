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

const OrderItem: React.FC<OrderItemProps> = ({ order, checked, onToggle, showDateHeader = false }) => {
    const { id, name, phone, location, item, amount, date } = order;


    const formatDate = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long' 
        };
        const dateString = date.toLocaleDateString('en-US', options);
        const day = date.getDate();
        const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
        return dateString.replace(/\d+/, day + suffix);
    };

    return (
        <section className="flex flex-col gap-3 w-full">
     
            {showDateHeader && (
                <div className="flex items-center justify-between gap-2 ">
                    <p className="text-black/40 text-xs font-medium w-full text-left">{formatDate(date)}</p>
                    <div className="w-140 h-0.5 bg-neutral-100"/>
                </div>
            )}

            <div className="flex items-center justify-between w-full">
                {/* LEFT */}
                <div className="flex gap-2 items-start">
                    <CheckCircleIcon checked={checked} onToggle={onToggle} />
                    <p className="text-black/50 text-xs">{id}</p>
                    <div className="flex flex-col gap-1">
                        <p className="text-black text-xs text-left">{name}</p>
                        <div className="flex items-center gap-2">
                            <p className="text-black/60 text-[10px]">{phone}</p>
                            <div className="w-px h-3 bg-gray-300" />
                            <p className="text-black/50 text-[10px]">{location}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="inline-flex items-center gap-2.5">
                    <p className="px-1 py-0.5 bg-neutral-50 rounded-xl text-xs">{item}</p>
                    <p className="text-xs font-normal">{amount}</p>
                </div>
            </div>
        </section>
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