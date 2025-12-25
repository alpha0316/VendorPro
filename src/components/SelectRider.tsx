import React, { useState } from 'react';

// Rider data interface
interface Rider {
  id: string;
  name: string;
  phone: string;
  totalRides: number;
  dateAdded: string;
  rating: number;
  avatarColor?: string;
}

// Modal component
interface RiderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (riderId: string) => void;
  riders: Rider[];
  selectedRider: string | null;
  onSelectRider: (riderId: string) => void;
}

const RiderModal: React.FC<RiderModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  selectedRider,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md">
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-black text-lg font-semibold">Select Rider</h3>
          <p className="text-black/50 text-sm mt-1">Choose a rider to assign this order to</p>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
           <section className='w-full flex gap-2 items-center justify-start'>
              <p className='text-black text-base font-semibold'>John Doe</p>
              <div className='w-1 h-1 rounded-full bg-neutral-200' />
              <p className='text-black/50 text-sm '>08123456789</p>
            </section>

            <section className='w-full flex gap-2 items-center justify-start'>
              <p className='text-black text-xs font-semibold'>24 <span className='text-black/50 font-normal'>Total Rides</span> </p>
              <div className='w-1 h-1 rounded-full bg-neutral-200' />
              <p className='text-black text-xs font-semibold'>26/12/25<span className='text-black/50 font-normal'> Date Added</span> </p>
              <div className='w-1 h-1 rounded-full bg-neutral-200' />
              <p className='text-black text-xs font-semibold'>4.6<span className='text-black/50 font-normal'> Rating</span> </p>
            </section>
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-neutral-200 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 rounded-xl border border-neutral-300 text-black font-medium hover:bg-neutral-50 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              if (selectedRider) {
                onAssign(selectedRider);
              }
            }}
            disabled={!selectedRider}
            className={`flex-1 px-4 py-3 rounded-xl font-medium transition-colors duration-200 ${
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

// Main component
const RidersSection: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRider, setSelectedRider] = useState<string | null>(null);
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

  const handleSelectRider = (riderId: string) => {
    setSelectedRider(riderId);
  };

  const handleAssign = (riderId: string) => {
    console.log(`Assigned order to rider: ${riderId}`);
    // Here you would typically make an API call to assign the order
    setIsModalOpen(false);
    setSelectedRider(null);
    // Show success message or update state
  };

  return (
    <>
      <main className='w-100 flex flex-col items-start justify-center gap-3'>
        <nav className='w-full flex items-center justify-between'>
          <p className='text-black text-base text-left font-bold flex items-start justify-start'>Your Riders</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex justify-start items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 8H12" stroke="green" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 12V4" stroke="green" strokeOpacity="0.6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <div className="justify-start text-green-600 text-xs font-semibold">Add Driver</div>
          </button>
        </nav>

        {riders.map((rider) => (
          <main 
            key={rider.id}
            className={`w-full flex flex-col gap-3 p-4 bg-neutral-50 rounded-2xl cursor-pointer transition-all duration-200 ${
              selectedRider === rider.id
                ? 'border-orange-400 border-[0.5px]'
                : 'border border-transparent'
            }`}
            onClick={() => handleSelectRider(rider.id)}
          >
            <div className='w-full items-start justify-between flex'>
              <figure className={`w-14 h-14 ${rider.avatarColor} rounded-full flex flex-col items-center justify-center gap-2`}>
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
                  handleSelectRider(rider.id);
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
          </main>
        ))}

        {/* Assign Button (shown when a rider is selected) */}
        {selectedRider && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 bg-orange-400 text-white font-medium rounded-xl hover:bg-orange-500 transition-colors duration-200 mt-4"
          >
            Assign Order to {riders.find(r => r.id === selectedRider)?.name}
          </button>
        )}
      </main>

      {/* Modal */}
      <RiderModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRider(null);
        }}
        onAssign={handleAssign}
        riders={riders}
        selectedRider={selectedRider}
        onSelectRider={handleSelectRider}
      />
    </>
  );
};

export default RidersSection;