import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

// Status configuration with colors and display names
const statusConfig = [
  { key: 'all', label: 'All Orders', color: 'gray', textColor: 'text-gray-400', borderColor: 'border-gray-200', bgColor: 'bg-gray-50', chartColor: 'transparent' },
  { key: 'Pending', label: 'Pending', color: 'orange', textColor: 'text-orange-400', borderColor: 'border-orange-200', bgColor: 'bg-orange-50', chartColor: '#f97316' },
  { key: 'Move To Packaged', label: 'Move To Packaged', color: 'sky', textColor: 'text-sky-400', borderColor: 'border-sky-200', bgColor: 'bg-sky-50', chartColor: '#0ea5e9' },
  { key: 'Move In Transit', label: 'Move In Transit', color: 'blue', textColor: 'text-blue-500', borderColor: 'border-blue-200', bgColor: 'bg-blue-50', chartColor: '#3b82f6' },
  { key: 'Completed', label: 'Completed', color: 'emerald', textColor: 'text-emerald-500', borderColor: 'border-emerald-200', bgColor: 'bg-emerald-50', chartColor: '#10b981' },
  { key: 'Pick Up', label: 'Pick Up', color: 'purple', textColor: 'text-purple-500', borderColor: 'border-purple-200', bgColor: 'bg-purple-50', chartColor: '#8b5cf6' },
  { key: 'Refund', label: 'Refund', color: 'red', textColor: 'text-red-400', borderColor: 'border-red-200', bgColor: 'bg-red-50', chartColor: '#ef4444' },
];

// Your orders data
const ordersByDate = [
  { 
    date: '14th Dec', 
    orders: [
      { id: '#001', name: 'Prince', phone: '055 414 4611', hall: 'Suncity', item: 'Jollof', price: 60, status: 'Pending' },
      { id: '#002', name: 'Kofi Asante', phone: '055 321 7654', hall: 'Hall 2', item: 'Banku', price: 40, status: 'Completed' }
    ]
  },
  { 
    date: '15th Dec', 
    orders: [
      { id: '#003', name: 'Ama Serwaa', phone: '055 123 4567', hall: 'Hall 7', item: 'Fufu', price: 50, status: 'Move To Packaged' },
      { id: '#004', name: 'Kwame Mensah', phone: '055 987 6543', hall: 'Pentagon', item: 'Rice', price: 45, status: 'Move In Transit' }
    ]
  },
  { 
    date: '16th Dec', 
    orders: [
      { id: '#005', name: 'Abena Osei', phone: '055 246 8135', hall: 'Suncity', item: 'Waakye', price: 35, status: 'Completed' },
      { id: '#006', name: 'Yaw Boateng', phone: '055 369 2580', hall: 'Hall 2', item: 'Kenkey', price: 30, status: 'Pick Up' }
    ]
  },
  { 
    date: '17th Dec', 
    orders: [
      { id: '#007', name: 'Akosua Frimpong', phone: '055 147 2589', hall: 'Hall 7', item: 'Jollof', price: 60, status: 'Pending' },
      { id: '#008', name: 'Kojo Appiah', phone: '055 258 3691', hall: 'Pentagon', item: 'Banku', price: 40, status: 'Refund' }
    ]
  },
  { 
    date: '18th Dec', 
    orders: [
      { id: '#009', name: 'Efua Darko', phone: '055 369 1470', hall: 'Suncity', item: 'Fufu', price: 50, status: 'Move To Packaged' },
      { id: '#010', name: 'Kwabena Owusu', phone: '055 741 8520', hall: 'Hall 2', item: 'Rice', price: 45, status: 'Completed' }
    ]
  },
  { 
    date: '19th Dec', 
    orders: [
      { id: '#011', name: 'Prince', phone: '055 414 4611', hall: 'Suncity', item: 'Jollof', price: 60, status: 'Pending' },
      { id: '#012', name: 'Adjoa Mensah', phone: '055 852 9630', hall: 'Hall 7', item: 'Waakye', price: 35, status: 'Move In Transit' }
    ]
  },
  { 
    date: '20th Dec', 
    orders: [
      { id: '#013', name: 'Kwesi Agyemang', phone: '055 963 7410', hall: 'Pentagon', item: 'Kenkey', price: 30, status: 'Completed' },
      { id: '#014', name: 'Kofi Asante', phone: '055 321 7654', hall: 'Hall 2', item: 'Banku', price: 40, status: 'Pick Up' }
    ]
  },
  { 
    date: '21st Dec', 
    orders: [
      { id: '#015', name: 'Afia Boakye', phone: '055 159 7530', hall: 'Suncity', item: 'Jollof', price: 60, status: 'Pending' },
      { id: '#016', name: 'Yaa Asare', phone: '055 753 9510', hall: 'Hall 7', item: 'Fufu', price: 50, status: 'Refund' }
    ]
  },
  { 
    date: '22nd Dec', 
    orders: [
      { id: '#017', name: 'Kofi Adu', phone: '055 357 1590', hall: 'Pentagon', item: 'Rice', price: 45, status: 'Move To Packaged' },
      { id: '#018', name: 'Esi Annan', phone: '055 951 3570', hall: 'Hall 2', item: 'Waakye', price: 35, status: 'Completed' }
    ]
  },
  { 
    date: '23rd Dec', 
    orders: [
      { id: '#019', name: 'Nana Ofosu', phone: '055 753 1598', hall: 'Suncity', item: 'Kenkey', price: 30, status: 'Move In Transit' },
      { id: '#020', name: 'Ama Owusu', phone: '055 159 7538', hall: 'Hall 7', item: 'Banku', price: 40, status: 'Pending' }
    ]
  }
];

const RevenueDashboard = () => {
  const [activeTab, setActiveTab] = useState('revenue');
  const [activeFilters, setActiveFilters] = useState(['all']);

  // Transform orders data into chart format
  const transformOrdersToChartData = () => {
    return ordersByDate.map(dateData => {
      const chartItem: { name: string; [key: string]: number | string } = { name: dateData.date };
      
      // Initialize all statuses to 0
      const statusKeys = ['Pending', 'Move To Packaged', 'Move In Transit', 'Completed', 'Pick Up', 'Refund'];
      statusKeys.forEach(key => {
        chartItem[key] = 0;
      });
      
      // Sum prices for each status
      dateData.orders.forEach(order => {
        if (chartItem[order.status] !== undefined) {
          chartItem[order.status] = Number(chartItem[order.status]) + order.price;
        }
      });
      
      // Calculate total for the day
      const dailyTotal = statusKeys.reduce((sum, key) => sum + (chartItem[key] as number), 0);
      
      // Find max daily total from all days for Y-axis scaling
      
      // Calculate empty space to make all bars reach the same height
      // For your data, maxTotal is around 100 (60 + 40), so we'll use 120 as a nice round max
      const targetMax = 120; // Set a nice round number slightly above the actual max
      chartItem.empty = Math.max(0, targetMax - dailyTotal);
      
      return chartItem;
    });
  };

  const baseChartData = transformOrdersToChartData();

  // Toggle filter on/off
  const toggleFilter = (filterKey: string) => {
    if (filterKey === 'all') {
      // If clicking "All", reset to only "All"
      setActiveFilters(['all']);
    } else {
      // Remove "all" if it exists (since we're selecting a specific filter)
      const newFilters = activeFilters.filter(f => f !== 'all');
      
      // Toggle the specific filter
      if (newFilters.includes(filterKey)) {
        // Remove filter if it's already active
        const updatedFilters = newFilters.filter(f => f !== filterKey);
        // If no filters left, default to "all"
        setActiveFilters(updatedFilters.length > 0 ? updatedFilters : ['all']);
      } else {
        // Add filter if it's not active
        setActiveFilters([...newFilters, filterKey]);
      }
    }
  };

  // Check if a filter is active
  const isFilterActive = (filterKey: string) => {
    if (filterKey === 'all') {
      return activeFilters.includes('all') || activeFilters.length === 0;
    }
    return activeFilters.includes(filterKey);
  };

  // Filter chart data based on active filters
  const getFilteredData = () => {
    if (activeFilters.includes('all') || activeFilters.length === 0) {
      return baseChartData;
    }

    return baseChartData.map(item => {
      const filteredItem: { name: string; [key: string]: number | string } = { name: item.name };
      
      // Calculate new daily total based on active filters
      let newTotal = 0;
      activeFilters.forEach(filterKey => {
        if (item[filterKey] !== undefined) {
          filteredItem[filterKey] = item[filterKey];
          newTotal += item[filterKey] as number;
        }
      });
      
      // Recalculate empty space to maintain consistent bar heights
      // Find the maximum total among all days for the active filters
      const filteredTotals = baseChartData.map(d => {
        let total = 0;
        activeFilters.forEach(filterKey => {
          if (d[filterKey] !== undefined) {
            total += d[filterKey] as number;
          }
        });
        return total;
      });
      
      const maxFilteredTotal = Math.max(...filteredTotals);
      // Use a nice round number slightly above the max
      const targetMax = Math.ceil(maxFilteredTotal / 20) * 20 + 20; // Round up to nearest 20 + 20 padding
      
      filteredItem.empty = Math.max(0, targetMax - newTotal);
      
      return filteredItem;
    });
  };

  const filteredData = getFilteredData();

  // Calculate Y-axis max value for proper scaling
  const calculateYAxisMax = () => {
    if (filteredData.length === 0) return 100;
    
    // Calculate max total from filtered data
    const maxTotal = Math.max(...filteredData.map(item => {
      let total = 0;
      Object.entries(item).forEach(([key, value]) => {
        if (key !== 'name' && key !== 'empty' && key !== 'all') {
          total += typeof value === 'number' ? value : Number(value) || 0;
        }
      });
      return total;
    }));
    
    // Round up to nearest nice number for Y-axis
    return Math.ceil(maxTotal / 20) * 20 + 20;
  };

  const yAxisMax = calculateYAxisMax();

  // Custom tooltip component
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      color?: string;
      dataKey?: string;
      value?: number;
      [key: string]: any;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      // Filter out empty and calculate total
      const nonEmptyPayload = payload.filter(entry => entry.dataKey !== 'empty');
      const total = nonEmptyPayload.reduce((sum, entry) => sum + (entry.value || 0), 0);
      
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-bold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {nonEmptyPayload.map((entry, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-600 text-sm">
                    {statusConfig.find(s => s.key === entry.dataKey)?.label || entry.dataKey}
                  </span>
                </div>
                <span className="font-medium text-gray-800">₵ {entry.value?.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-1 mt-1">
              <div className="flex items-center justify-between font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-800">₵ {total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Generate Y-axis ticks based on the max value
  const generateYAxisTicks = () => {
    const ticks = [];
    const tickCount = 6; // Number of ticks we want
    const tickStep = yAxisMax / (tickCount - 1);
    
    for (let i = 0; i < tickCount; i++) {
      ticks.push(Math.round(tickStep * i));
    }
    
    return ticks;
  };

  const yAxisTicks = generateYAxisTicks();

  return (
    <div className="p-8 bg-white rounded-xl font-sans">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-8">
        <div>
          {/* Tab Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-md w-fit mb-4">
            <button 
              onClick={() => setActiveTab('revenue')}
              className={`px-4 py-1 rounded text-sm font-medium transition-all ${
                activeTab === 'revenue' 
                  ? 'bg-white shadow-sm text-blue-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Revenue
            </button>
            <button 
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-1 rounded text-sm font-medium transition-all ${
                activeTab === 'orders' 
                  ? 'bg-white shadow-sm text-blue-500' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Orders
            </button>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 capitalize">
            {activeTab === 'revenue' ? 'Revenue' : 'Orders'}
          </h2>
        </div>

        {/* Filters/Legend */}
        <div className="flex flex-wrap gap-2 pt-2 max-w-md justify-end">
          {statusConfig.map((status) => (
            <button
              key={status.key}
              onClick={() => toggleFilter(status.key)}
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${
                isFilterActive(status.key)
                  ? `${status.textColor} ${status.bgColor} border-${status.color}-300 shadow-sm`
                  : 'text-gray-400 border-gray-200 hover:border-gray-300 hover:text-gray-500'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section */}
      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={filteredData} 
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }} 
            barSize={40}
            // Removed stackOffset="expand" to show actual values
          >
            <CartesianGrid vertical={false} stroke="#f0f0f6" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => `₵${value}`}
              domain={[0, yAxisMax]}
              ticks={yAxisTicks}
            />
            <Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(0,0,0,0.05)'}} />
            
            {/* Stacked Bars - Show only active filters */}
            {activeFilters.includes('all') || activeFilters.includes('Refund') ? (
              <Bar dataKey="Refund" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
            ) : null}
            
            {activeFilters.includes('all') || activeFilters.includes('Pick Up') ? (
              <Bar dataKey="Pick Up" stackId="a" fill="#8b5cf6" />
            ) : null}
            
            {activeFilters.includes('all') || activeFilters.includes('Completed') ? (
              <Bar dataKey="Completed" stackId="a" fill="#10b981" />
            ) : null}
            
            {activeFilters.includes('all') || activeFilters.includes('Move In Transit') ? (
              <Bar dataKey="Move In Transit" stackId="a" fill="#3b82f6" />
            ) : null}
            
            {activeFilters.includes('all') || activeFilters.includes('Move To Packaged') ? (
              <Bar dataKey="Move To Packaged" stackId="a" fill="#0ea5e9" />
            ) : null}
            
            {activeFilters.includes('all') || activeFilters.includes('Pending') ? (
              <Bar dataKey="Pending" stackId="a" fill="#f97316" />
            ) : null}
            
            {/* Top gray "empty" space - always show (but now it represents actual empty space) */}
            <Bar dataKey="empty" stackId="a" fill="#f3f4f6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

 
    </div>
  );
};

export default RevenueDashboard;