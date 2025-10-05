import React, { useState } from 'react';

interface Driver {
  id: number;
  name: string;
  speed: string;
  status: string;
  route: string;
  statusColor: 'green' | 'red' | 'yellow';
}

interface NewBusData {
  phone: string | number | readonly string[] | undefined;
  name: string;
  driver: string;
  route: string;
  initialStatus: string;
}

interface CustomTableProps {
  data?: Driver[];
  title?: string;
  onCreateNew?: (busData: NewBusData) => void;
  onView?: (driver: Driver) => void;
  onRemove?: (driver: Driver) => void;
}

const CustomTable: React.FC<CustomTableProps> = ({ 
  data = [
    {
      id: 1,
      name: 'Olivia Rhye',
      speed: '45 km/h',
      status: 'Active',
      route: 'Brunei -> KSB',
      statusColor: 'green' as const
    },
    {
      id: 2,
      name: 'Phoenix Baker',
      speed: '52 km/h',
      status: 'Active',
      route: 'Brunei -> KSB',
      statusColor: 'green' as const
    },
    {
      id: 3,
      name: 'Lana Steiner',
      speed: '0 km/h',
      status: 'Offline',
      route: 'Commercial -> KSB',
      statusColor: 'red' as const
    },
    {
      id: 4,
      name: 'Demi Wilkinson',
      speed: '38 km/h',
      status: 'Break',
      route: 'Gaza -> Pharmacy',
      statusColor: 'yellow' as const
    },
    {
      id: 5,
      name: 'Candice Wu',
      speed: '41 km/h',
      status: 'Active',
      route: 'Commercial -> KSB',
      statusColor: 'green' as const
    }
  ],
  title = "Drivers",
  onCreateNew = () => console.log('Create new clicked'),
  onView = (driver: Driver) => console.log('View driver:', driver),
  onRemove = (driver: Driver) => console.log('Remove driver:', driver)
}) => {
  const drivers = data;

  const [selectedDrivers, setSelectedDrivers] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBusData, setNewBusData] = useState<NewBusData>({
    name: '',
    driver: '',
    phone: '',
    route: 'Brunei - KSB',
    initialStatus: 'Active'
  });

  // Available routes for the dropdown
  const availableRoutes = [
    'Brunei - KSB',
    'Commercial - KSB',
    'Gaza - Pharmacy Bus stop',
  ];

  // Modal handlers
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewBusData({
      name: '',
      driver: '',
      phone: '',
      route: 'Brunei - KSB',
      initialStatus: 'Active'
    });
  };

  const handleCreateBus = () => {
    if (newBusData.name.trim() && newBusData.driver.trim() && newBusData.route.trim() ) {
      onCreateNew(newBusData);
      closeModal();
    }
  };

  const handleInputChange = (field: keyof NewBusData, value: string) => {
    setNewBusData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleDriver = (driverId: number) => {
    const newSelected = new Set(selectedDrivers);
    if (newSelected.has(driverId)) {
      newSelected.delete(driverId);
    } else {
      newSelected.add(driverId);
    }
    setSelectedDrivers(newSelected);
  };

  const toggleAllDrivers = () => {
    if (selectedDrivers.size === drivers.length) {
      setSelectedDrivers(new Set());
    } else {
      setSelectedDrivers(new Set(drivers.map(d => d.id)));
    }
  };

  const getStatusBadge = (status: string, statusColor: 'green' | 'red' | 'yellow') => {
    const colorClasses = {
      green: 'bg-green-50 text-green-700 outline-green-200',
      red: 'bg-red-50 text-red-700 outline-red-200',
      yellow: 'bg-yellow-50 text-yellow-700 outline-yellow-200'
    };

    return (
      <div className={`pl-1.5 pr-2 py-0.5 rounded-2xl  outline-1 outline-offset-[-1px] inline-flex justify-start items-center gap-1 ${colorClasses[statusColor]}`}>
        <div className="w-2 h-2 rounded-full bg-current"></div>
        <div className="text-center justify-start text-xs font-medium leading-none">{status}</div>
      </div>
    );
  };

  // Generate initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Generate a consistent color based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-yellow-100 text-yellow-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <main className='w-[1123px] m-10 flex flex-col items-start justify-start rounded-xl border border-black/10 bg-white shadow-sm'>
      {/* Header */}
      <header className='px-6 py-5 items-center justify-between max-w-full border-b border-black/10 flex w-full'>
        <div className='flex items-center justify-center gap-2'>
          <p className='text-gray-900 text-lg font-semibold'>{title}</p>
          <div className='text-violet-700 text-sm font-medium px-2 py-0.5 bg-purple-50 rounded-2xl  outline-1 outline-offset-[-1px] outline-gray-200'>
            {drivers.length} {title}
          </div>
        </div>

        <button 
          onClick={openModal}
          className='px-3 py-2 bg-green-600 rounded-lg inline-flex justify-center items-center text-white hover:bg-green-700 transition-colors duration-200 text-sm font-medium'
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New {title.slice(0, -1)}
        </button>
      </header>

      {/* Table Header */}
      <section className='flex w-full items-center h-11 px-6 py-3 border-b border-black/10 justify-between bg-gray-50'>
        <div className='flex gap-3 items-center w-80'>
          <input
            type="checkbox"
            checked={selectedDrivers.size === drivers.length && drivers.length > 0}
            onChange={toggleAllDrivers}
            className="w-4 h-4 rounded border border-zinc-300 text-green-600 focus:ring-green-500"
          />
          <p className="text-gray-600 text-xs font-semibold leading-none">Driver Name</p>
        </div>

        <div className='flex gap-1 items-center w-24'>
          <p className="text-gray-600 text-xs font-semibold leading-none">Speed</p>
        </div>

        <div className='flex gap-1 items-center w-24'>
          <p className="text-gray-600 text-xs font-semibold leading-none">Status</p>
        </div>

        <div className='flex gap-1 items-center w-40'>
          <p className="text-gray-600 text-xs font-semibold leading-none">Route</p>
        </div>

        <div className='flex gap-1 items-center w-24'>
          <p className="text-gray-600 text-xs font-semibold leading-none">Actions</p>
        </div>
      </section>

      {/* Table Rows */}
      {drivers.length === 0 ? (
        <div className="flex items-center justify-center py-12 w-full">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500 text-sm">No drivers found</p>
            <button 
              onClick={openModal}
              className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Add your first driver
            </button>
          </div>
        </div>
      ) : (
        drivers.map((driver, index) => (
          <section 
            key={driver.id} 
            className={`flex w-full items-center min-h-16 px-6 py-3 ${index < drivers.length - 1 ? 'border-b border-black/10' : ''} justify-between ${
              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
            } hover:bg-gray-100 transition-colors duration-150`}
          >
            <div className='flex gap-3 items-center w-80'>
              <input
                type="checkbox"
                checked={selectedDrivers.has(driver.id)}
                onChange={() => toggleDriver(driver.id)}
                className="w-4 h-4 rounded border border-zinc-300 text-green-600 focus:ring-green-500"
              />
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${getAvatarColor(driver.name)}`}>
                {getInitials(driver.name)}
              </div>
              <div className="flex flex-col items-start">
                <p className="text-gray-900 text-sm font-medium leading-none">{driver.name}</p>
                <p className="text-gray-500 text-xs mt-1">Bus Number: {driver.id.toString().padStart(3, '0')}</p>
              </div>
            </div>

            <div className='flex gap-1 items-center w-24'>
              <p className="text-gray-600 text-sm leading-none font-medium">{driver.speed}</p>
            </div>

            <div className='flex gap-1 items-center w-24'>
              {getStatusBadge(driver.status, driver.statusColor)}
            </div>

            <div className='flex gap-1 items-center w-40'>
              <p className="text-gray-600 text-sm leading-none">{driver.route}</p>
            </div>

            <div className='flex gap-2 items-center w-24'>
              <button 
                onClick={() => onView(driver)}
                className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
              >
                View
              </button>
              <button 
                onClick={() => onRemove(driver)}
                className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
              >
                Remove
              </button>
            </div>
          </section>
        ))
      )}

      {/* Footer with selection info */}
      {selectedDrivers.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200 w-full flex items-center justify-between">
          <p className="text-blue-700 text-sm font-medium">
            {selectedDrivers.size} driver{selectedDrivers.size > 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors text-sm">
              Export Selected
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 text-left">Add New Bus</h2>
                  <p className="text-sm text-gray-600 mt-1 text-left">Enter the details for the new bus</p>
                </div>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Driver Name
                </label>
                <input
                  type="text"
                  value={newBusData.driver}
                  onChange={(e) => handleInputChange('driver', e.target.value)}
                  placeholder="e.g., Mr Kwame Agyei"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newBusData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="e.g., 024 -"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Bus Number
                </label>
                <input
                  type="text"
                  value={newBusData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., AS-1234-26"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Route
                </label>
                <select
                  value={newBusData.route}
                  onChange={(e) => handleInputChange('route', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  {availableRoutes.map((route) => (
                    <option key={route} value={route}>
                      {route}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Initial Status
                </label>
                <select
                  value={newBusData.initialStatus}
                  onChange={(e) => handleInputChange('initialStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="Break">Break</option>
                  <option value="Offline">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateBus}
                disabled={!newBusData.name.trim() || !newBusData.driver.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add Bus
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CustomTable;