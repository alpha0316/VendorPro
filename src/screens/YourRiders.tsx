import './../App.css'
import { useState } from 'react';

interface AppProps {
  goToAddOrders: () => void;
}

interface Rider {
  id: string;
  name: string;
  phone: string;
  totalRides: number;
  dateAdded: string;
  rating: number;
  isActive: boolean;
  avatarColor?: string;
}

// Soft colors for rider avatars
const AVATAR_COLORS = [
  'bg-red-100',
  'bg-orange-100',
  'bg-amber-100',
  'bg-yellow-100',
  'bg-lime-100',
  'bg-green-100',
  'bg-emerald-100',
  'bg-teal-100',
  'bg-cyan-100',
  'bg-sky-100',
  'bg-blue-100',
  'bg-indigo-100',
  'bg-violet-100',
  'bg-purple-100',
  'bg-fuchsia-100',
  'bg-pink-100',
  'bg-rose-100'
];

const getRandomColor = (seed: string): string => {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

// Mock riders data
const SAMPLE_RIDERS: Rider[] = [
  {
    id: '1',
    name: 'John Doe',
    phone: '08123456789',
    totalRides: 24,
    dateAdded: '26/12/25',
    rating: 4.6,
    isActive: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    phone: '08098765432',
    totalRides: 18,
    dateAdded: '15/12/25',
    rating: 4.8,
    isActive: true,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    phone: '07012345678',
    totalRides: 32,
    dateAdded: '10/12/25',
    rating: 4.4,
    isActive: false,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    phone: '05011223344',
    totalRides: 15,
    dateAdded: '05/12/25',
    rating: 4.9,
    isActive: true,
  },
  {
    id: '5',
    name: 'David Brown',
    phone: '02455667788',
    totalRides: 27,
    dateAdded: '01/12/25',
    rating: 4.7,
    isActive: true,
  },
];

function App({ goToAddOrders }: AppProps) {
  const [riders] = useState<Rider[]>(SAMPLE_RIDERS);
  const [showAddModal, setShowAddModal] = useState(false);

  const activeRiders = riders.filter(r => r.isActive);
  const inactiveRiders = riders.filter(r => !r.isActive);

  const getInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <>
      <main className='flex flex-col items-center w-full min-h-screen px-4 sm:px-6 md:px-8'>
        {/* Header */}
        <div className='flex items-center justify-between w-full max-w-7xl mx-auto mt-4 sm:mt-6 md:mt-8'>
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

          <div className="h-5 sm:h-6 px-1 sm:px-1.5 py-1.5 sm:py-2.5 bg-orange-400 rounded-[50px] flex items-center justify-center">
            <div className="text-center text-white text-xs">R 👩🏽‍🍳</div>
          </div>
        </div>

        {/* Main Content */}
        <section className='flex flex-col items-start justify-center gap-5 sm:gap-6 w-full max-w-7xl mx-auto mt-6 sm:mt-8'>
          {/* Header with Title and Add Button */}
          <nav className='w-full flex items-center justify-between'>
            <h1 className='text-black text-lg sm:text-xl font-bold'>
              Your Riders
              <span className='text-black/50 font-normal ml-2'>({riders.length})</span>
            </h1>
            
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-green-50 hover:bg-green-100 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M4 8H12" stroke="#16A34A" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M8 12V4" stroke="#16A34A" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-green-700 text-xs sm:text-sm font-medium">Add Rider</span>
            </button>
          </nav>

          {/* Active Riders Section */}
          <div className='w-full'>
            <h2 className='text-sm sm:text-base font-semibold text-black/70 mb-3'>
              Active Riders ({activeRiders.length})
            </h2>
            
            {/* Riders Grid - Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
              {activeRiders.map((rider) => {
                const avatarColor = getRandomColor(rider.id + rider.name);
                
                return (
                  <div
                    key={rider.id}
                    className='w-full flex flex-col gap-3 p-4 sm:p-5 bg-neutral-50 hover:bg-neutral-100 rounded-xl sm:rounded-2xl transition-colors border border-transparent hover:border-green-200'
                  >
                    {/* Avatar and Delete Button Row */}
                    <div className='w-full flex items-start justify-between'>
                      <figure className={`w-12 h-12 sm:w-14 sm:h-14 ${avatarColor} rounded-full flex items-center justify-center`}>
                        <span className="text-black font-semibold text-base sm:text-lg">
                          {getInitials(rider.name)}
                        </span>
                      </figure>

                      <button className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center hover:bg-red-50 transition-colors group">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:opacity-100 opacity-60">
                          <path d="M14.0471 3.48668C12.9738 3.38001 11.9004 3.30001 10.8204 3.24001V3.23334L10.6738 2.36668C10.5738 1.75334 10.4271 0.833344 8.8671 0.833344H7.12043C5.5671 0.833344 5.42043 1.71334 5.31376 2.36001L5.17376 3.21334C4.55376 3.25334 3.93376 3.29334 3.31376 3.35334L1.95376 3.48668C1.67376 3.51334 1.47376 3.76001 1.50043 4.03334C1.5271 4.30668 1.7671 4.50668 2.0471 4.48001L3.4071 4.34668C6.90043 4.00001 10.4204 4.13334 13.9538 4.48668C13.9738 4.48668 13.9871 4.48668 14.0071 4.48668C14.2604 4.48668 14.4804 4.29334 14.5071 4.03334C14.5271 3.76001 14.3271 3.51334 14.0471 3.48668Z" fill="#EF4444" fillOpacity="0.8" />
                          <path d="M12.8202 5.42666C12.6602 5.25999 12.4402 5.16666 12.2135 5.16666H3.78683C3.56016 5.16666 3.33349 5.25999 3.18016 5.42666C3.02683 5.59332 2.94016 5.81999 2.95349 6.05332L3.36683 12.8933C3.44016 13.9067 3.53349 15.1733 5.86016 15.1733H10.1402C12.4668 15.1733 12.5602 13.9133 12.6335 12.8933L13.0468 6.05999C13.0602 5.81999 12.9735 5.59332 12.8202 5.42666ZM9.10683 11.8333H6.88683C6.61349 11.8333 6.38683 11.6067 6.38683 11.3333C6.38683 11.06 6.61349 10.8333 6.88683 10.8333H9.10683C9.38016 10.8333 9.60683 11.06 9.60683 11.3333C9.60683 11.6067 9.38016 11.8333 9.10683 11.8333ZM9.66683 9.16666H6.33349C6.06016 9.16666 5.83349 8.93999 5.83349 8.66666C5.83349 8.39332 6.06016 8.16666 6.33349 8.16666H9.66683C9.94016 8.16666 10.1668 8.39332 10.1668 8.66666C10.1668 8.93999 9.94016 9.16666 9.66683 9.16666Z" fill="#EF4444" fillOpacity="0.8" />
                        </svg>
                      </button>
                    </div>

                    {/* Rider Info */}
                    <section className='w-full flex flex-wrap items-center gap-2'>
                      <p className='text-black text-sm sm:text-base font-semibold'>{rider.name}</p>
                      <div className='w-1 h-1 rounded-full bg-neutral-300' />
                      <p className='text-black/50 text-xs sm:text-sm'>{rider.phone}</p>
                    </section>

                    {/* Stats */}
                    <section className='w-full flex flex-wrap items-center gap-2'>
                      <p className='text-black text-xs sm:text-sm font-medium'>
                        {rider.totalRides} <span className='text-black/50 font-normal'>rides</span>
                      </p>
                      <div className='w-1 h-1 rounded-full bg-neutral-300' />
                      <p className='text-black text-xs sm:text-sm font-medium'>
                        {rider.dateAdded} <span className='text-black/50 font-normal'>added</span>
                      </p>
                      <div className='w-1 h-1 rounded-full bg-neutral-300' />
                      <p className='text-black text-xs sm:text-sm font-medium'>
                        {rider.rating} <span className='text-black/50 font-normal'>★</span>
                      </p>
                    </section>

                    {/* Active Status Badge */}
                    <div className='mt-1'>
                      <span className='inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full'>
                        <span className='w-1.5 h-1.5 bg-green-500 rounded-full mr-1'></span>
                        Active
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inactive Riders Section - Only show if there are inactive riders */}
          {inactiveRiders.length > 0 && (
            <div className='w-full mt-2'>
              <h2 className='text-sm sm:text-base font-semibold text-black/70 mb-3'>
                Inactive Riders ({inactiveRiders.length})
              </h2>
              
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 opacity-75'>
                {inactiveRiders.map((rider) => {
                  const avatarColor = getRandomColor(rider.id + rider.name);
                  
                  return (
                    <div
                      key={rider.id}
                      className='w-full flex flex-col gap-3 p-4 sm:p-5 bg-neutral-50 rounded-xl sm:rounded-2xl border border-dashed border-neutral-200'
                    >
                      {/* Avatar and Restore Button Row */}
                      <div className='w-full flex items-start justify-between'>
                        <figure className={`w-12 h-12 sm:w-14 sm:h-14 ${avatarColor} rounded-full flex items-center justify-center opacity-60`}>
                          <span className="text-black font-semibold text-base sm:text-lg">
                            {getInitials(rider.name)}
                          </span>
                        </figure>

                        <button className="w-8 h-8 sm:w-9 sm:h-9 bg-white rounded-full flex items-center justify-center hover:bg-green-50 transition-colors group">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:opacity-100 opacity-60">
                            <path d="M8 3V13" stroke="#10B981" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M13 8H3" stroke="#10B981" strokeOpacity="0.8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </button>
                      </div>

                      {/* Rider Info */}
                      <section className='w-full flex flex-wrap items-center gap-2'>
                        <p className='text-black text-sm sm:text-base font-semibold opacity-60'>{rider.name}</p>
                        <div className='w-1 h-1 rounded-full bg-neutral-300' />
                        <p className='text-black/50 text-xs sm:text-sm'>{rider.phone}</p>
                      </section>

                      {/* Stats */}
                      <section className='w-full flex flex-wrap items-center gap-2'>
                        <p className='text-black text-xs sm:text-sm font-medium opacity-60'>
                          {rider.totalRides} <span className='text-black/50 font-normal'>rides</span>
                        </p>
                        <div className='w-1 h-1 rounded-full bg-neutral-300' />
                        <p className='text-black text-xs sm:text-sm font-medium opacity-60'>
                          {rider.dateAdded} <span className='text-black/50 font-normal'>added</span>
                        </p>
                        <div className='w-1 h-1 rounded-full bg-neutral-300' />
                        <p className='text-black text-xs sm:text-sm font-medium opacity-60'>
                          {rider.rating} <span className='text-black/50 font-normal'>★</span>
                        </p>
                      </section>

                      {/* Inactive Status Badge */}
                      <div className='mt-1'>
                        <span className='inline-flex items-center px-2 py-1 bg-neutral-200 text-neutral-600 text-xs rounded-full'>
                          <span className='w-1.5 h-1.5 bg-neutral-500 rounded-full mr-1'></span>
                          Inactive
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty State */}
          {riders.length === 0 && (
            <div className="w-full flex flex-col items-center justify-center py-12 sm:py-16 bg-white rounded-xl border border-dashed border-neutral-200">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                  <circle cx="12" cy="8" r="5" />
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                </svg>
              </div>
              <p className="text-neutral-500 text-sm sm:text-base text-center max-w-xs">
                No riders yet.<br />
                Click "Add Rider" to get started.
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Add Rider Modal - To be implemented */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold mb-4">Add New Rider</h3>
            <p className="text-sm text-black/50 mb-4">Modal implementation coming soon...</p>
            <button
              onClick={() => setShowAddModal(false)}
              className="w-full px-4 py-2 bg-orange-400 text-white rounded-full font-medium hover:bg-orange-500 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default App;