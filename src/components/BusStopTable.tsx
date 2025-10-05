import React, { useState } from 'react';

interface BusStop {
  id: number;
  name: string;
  crowdSize: string;
  status: string;
  activeBuses: string;
  statusColor: 'green' | 'red' | 'yellow';
  latitude: number;
  longitude: number;
}

interface NewBusStopData {
  name: string;
  location: string;
  description: string;
  initialStatus: string;
  latitude: string;
  longitude: string;
}

interface CustomTableProps {
  data?: BusStop[];
  title?: string;
  onCreateNew?: (busStopData: NewBusStopData) => void;
  onView?: (stop: BusStop) => void;
  onRemove?: (stop: BusStop) => void;
}

const CustomTable: React.FC<CustomTableProps> = ({ 
  data = [
    {
      id: 1,
      name: 'KSB',
      crowdSize: '25+ people',
      status: 'Active',
      activeBuses: '3 buses',
      statusColor: 'green' as const,
      latitude: 6.669314250173885,
      longitude: -1.567181795001016
    },
    {
      id: 2,
      name: 'Brunei',
      crowdSize: '12+ people',
      status: 'Active',
      activeBuses: '2 buses',
      statusColor: 'green' as const,
      latitude: 6.670465091472612,
      longitude: -1.5741574445526254
    },
    {
      id: 3,
      name: 'Commercial Area',
      crowdSize: '0 people',
      status: 'Inactive',
      activeBuses: '0 buses',
      statusColor: 'red' as const,
      latitude: 6.682751297721754,
      longitude: -1.5769726260262382
    },
    {
      id: 4,
      name: 'Gaza',
      crowdSize: '8+ people',
      status: 'Maintenance',
      activeBuses: '1 bus',
      statusColor: 'yellow' as const,
      latitude: 6.686603046574587,
      longitude: -1.556854180379707
    },
    {
      id: 5,
      name: 'Pharmacy',
      crowdSize: '15+ people',
      status: 'Active',
      activeBuses: '2 buses',
      statusColor: 'green' as const,
      latitude: 6.67480379472123,
      longitude: -1.5663873751176354
    }
  ],
  title = "Bus Stops",
  onCreateNew = () => console.log('Create new clicked'),
  onView = (stop: BusStop) => console.log('View stop:', stop),
  onRemove = (stop: BusStop) => console.log('Remove stop:', stop)
}) => {
  const busStops = data;

  const [selectedStops, setSelectedStops] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newBusStopData, setNewBusStopData] = useState<NewBusStopData>({
    name: '',
    location: 'On Campus',
    description: '',
    initialStatus: 'Active',
    latitude: '',
    longitude: ''
  });

  // Available locations for the dropdown
  const availableLocations = [
    'On Campus',
    'Off Campus',
    'Hub for student activities',
    'Medical Facility',
    'Commercial District',
    'Residential Area'
  ];

  // Modal handlers
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewBusStopData({
      name: '',
      location: 'On Campus',
      description: '',
      initialStatus: 'Active',
      latitude: '',
      longitude: ''
    });
  };

  const handleCreateBusStop = () => {
    if (newBusStopData.name.trim() && 
        newBusStopData.location.trim() && 
        newBusStopData.latitude.trim() && 
        newBusStopData.longitude.trim()) {
      // Validate coordinates
      const lat = parseFloat(newBusStopData.latitude);
      const lng = parseFloat(newBusStopData.longitude);
      
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        alert('Please enter valid coordinates. Latitude must be between -90 and 90, Longitude between -180 and 180.');
        return;
      }
      
      onCreateNew(newBusStopData);
      closeModal();
    }
  };

  const handleInputChange = (field: keyof NewBusStopData, value: string) => {
    setNewBusStopData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleStop = (stopId: number) => {
    const newSelected = new Set(selectedStops);
    if (newSelected.has(stopId)) {
      newSelected.delete(stopId);
    } else {
      newSelected.add(stopId);
    }
    setSelectedStops(newSelected);
  };

  const toggleAllStops = () => {
    if (selectedStops.size === busStops.length) {
      setSelectedStops(new Set());
    } else {
      setSelectedStops(new Set(busStops.map(s => s.id)));
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

  // const getStopIcon = (status: string, name: string) => {
  //   const iconColor = status === 'Active' ? 'bg-green-500' : 
  //                    status === 'Inactive' ? 'bg-red-500' : 'bg-yellow-500';
    
  //   // Generate initials from bus stop name
  //   const initials = name
  //     .split(' ')
  //     .map(word => word[0])
  //     .join('')
  //     .toUpperCase()
  //     .slice(0, 2);
    
  //   return (
  //     <div className={`w-8 h-8 rounded-full ${iconColor} flex items-center justify-center text-white text-xs font-semibold`}>
  //       {initials}
  //     </div>
  //   );
  // };

  // Generate icon color based on stop name
  const getIconBackgroundColor = (name: string) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-purple-500',
      'bg-orange-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-teal-500'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getCrowdSizeInfo = (crowdSize: string, activeBuses: string) => {
    const peopleCount = parseInt(crowdSize.match(/\d+/)?.[0] || '0');
    const busCount = parseInt(activeBuses.match(/\d+/)?.[0] || '0');
    
    let crowdLevel = 'Low';
    let crowdColor = 'text-green-600';
    
    if (peopleCount > 20) {
      crowdLevel = 'High';
      crowdColor = 'text-red-600';
    } else if (peopleCount > 10) {
      crowdLevel = 'Medium';
      crowdColor = 'text-yellow-600';
    }

    return { crowdLevel, crowdColor, busCount };
  };

  return (
    <main className='w-[1123px] m-10 flex flex-col items-start justify-start rounded-xl border border-black/10 bg-white shadow-sm'>
      {/* Header */}
      <header className='px-6 py-5 items-center justify-between max-w-full border-b border-black/10 flex w-full'>
        <div className='flex items-center justify-center gap-2'>
          <p className='text-gray-900 text-lg font-semibold'>{title}</p>
          <div className='text-violet-700 text-sm font-medium px-2 py-0.5 bg-purple-50 rounded-2xl  outline-1 outline-offset-[-1px] outline-gray-200'>
            {busStops.length} {title}
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
        <div className='flex gap-3 items-center w-64'>
          <input
            type="checkbox"
            checked={selectedStops.size === busStops.length && busStops.length > 0}
            onChange={toggleAllStops}
            className="w-4 h-4 rounded border border-zinc-300 text-green-600 focus:ring-green-500"
          />
          <p className="text-gray-600 text-xs font-semibold leading-none">Stop Name</p>
        </div>

        <div className='flex gap-1 items-center w-32'>
          <p className="text-gray-600 text-xs font-semibold leading-none">Coordinates</p>
        </div>

        <div className='flex gap-1 items-center w-24'>
          <p className="text-gray-600 text-xs font-semibold leading-none">Crowd Size</p>
        </div>

        <div className='flex gap-1 items-center w-24'>
          <p className="text-gray-600 text-xs font-semibold leading-none">Status</p>
        </div>

        <div className='flex gap-1 items-center w-24'>
          <p className="text-gray-600 text-xs font-semibold leading-none">Active Buses</p>
        </div>

        <div className='flex gap-1 items-center w-24'>
          <p className="text-gray-600 text-xs font-semibold leading-none">Actions</p>
        </div>
      </section>

      {/* Table Rows */}
      {busStops.length === 0 ? (
        <div className="flex items-center justify-center py-12 w-full">
          <div className="text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-gray-500 text-sm">No bus stops found</p>
            <button 
              onClick={openModal}
              className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Add your first bus stop
            </button>
          </div>
        </div>
      ) : (
        busStops.map((stop, index) => {
          const { crowdLevel, crowdColor } = getCrowdSizeInfo(stop.crowdSize, stop.activeBuses);
          
          return (
            <section 
              key={stop.id} 
              className={`flex w-full items-center min-h-16 px-6 py-3 justify-between ${index < busStops.length - 1 ? 'border-b border-black/10' : ''} ${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
              } hover:bg-gray-100 transition-colors duration-150`}
            >
              <div className='flex gap-3 items-center w-64'>
                <input
                  type="checkbox"
                  checked={selectedStops.has(stop.id)}
                  onChange={() => toggleStop(stop.id)}
                  className="w-4 h-4 rounded border border-zinc-300 text-green-600 focus:ring-green-500"
                />
                <div className={`w-8 h-8 rounded-full ${getIconBackgroundColor(stop.name)} flex items-center justify-center text-white text-xs font-semibold`}>
                  {stop.name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-gray-900 text-sm font-medium leading-none">{stop.name}</p>
                  <p className="text-gray-500 text-xs mt-1">Stop ID: {stop.id.toString().padStart(3, '0')}</p>
                </div>
              </div>

              <div className='flex gap-1 items-center w-32'>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-xs font-mono">
                    {stop.latitude.toFixed(4)}, {stop.longitude.toFixed(4)}
                  </p>
                  <button 
                    onClick={() => {
                      const url = `https://maps.google.com/?q=${stop.latitude},${stop.longitude}`;
                      window.open(url, '_blank');
                    }}
                    className="text-blue-600 hover:text-blue-800 text-xs underline"
                  >
                    View on Map
                  </button>
                </div>
              </div>

              <div className='flex gap-1 items-center w-24'>
                <div className="flex flex-col">
                  <p className="text-gray-600 text-sm leading-none font-medium">{stop.crowdSize}</p>
                  <p className={`text-xs ${crowdColor}`}>{crowdLevel} density</p>
                </div>
              </div>

              <div className='flex gap-1 items-center w-24'>
                {getStatusBadge(stop.status, stop.statusColor)}
              </div>

              <div className='flex gap-1 items-center w-24'>
                <div className="flex items-center gap-1">
                  <p className="text-gray-600 text-sm leading-none font-medium">{stop.activeBuses}</p>
              
                </div>
              </div>

              <div className='flex gap-2 items-center w-24'>
                <button 
                  onClick={() => onView(stop)}
                  className="text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                >
                  View
                </button>
                <button 
                  onClick={() => onRemove(stop)}
                  className="text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            </section>
          );
        })
      )}

      {/* Footer with selection info */}
      {selectedStops.size > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-t border-blue-200 w-full flex items-center justify-between">
          <p className="text-blue-700 text-sm font-medium">
            {selectedStops.size} stop{selectedStops.size > 1 ? 's' : ''} selected
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 text-blue-700 border border-blue-300 rounded-md hover:bg-blue-100 transition-colors text-sm">
              Export Selected
            </button>
            <button className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
              Deactivate Selected
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
                  <h2 className="text-lg font-semibold text-gray-900 text-left">Add New Bus Stop</h2>
                  <p className="text-sm text-gray-600 mt-1 text-left">Enter the details for the new bus stop</p>
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
                  Bus Stop Name
                </label>
                <input
                  type="text"
                  value={newBusStopData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Central Library, Student Center"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newBusStopData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="e.g., 6.6750"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors text-left"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={newBusStopData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="e.g., -1.5723"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  />
                </div>
              </div>

              <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded text-left">
                <strong>Tip:</strong> You can get coordinates by right-clicking on Google Maps and selecting the coordinates that appear.
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Location Type
                </label>
                <select
                  value={newBusStopData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  {availableLocations.map((location) => (
                    <option key={location} value={location}>
                      {location}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Description
                </label>
                <textarea
                  value={newBusStopData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Brief description of the bus stop location and facilities"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
                  Initial Status
                </label>
                <select
                  value={newBusStopData.initialStatus}
                  onChange={(e) => handleInputChange('initialStatus', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Maintenance">Under Maintenance</option>
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
                onClick={handleCreateBusStop}
                disabled={!newBusStopData.name.trim() || !newBusStopData.location.trim() || !newBusStopData.latitude.trim() || !newBusStopData.longitude.trim()}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Add Bus Stop
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CustomTable;