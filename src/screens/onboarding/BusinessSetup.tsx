import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../contexts/OnboardingContext';

const BUSINESS_TYPES = ['Retail', 'Wholesale', 'Service'];

const BusinessSetup = () => {
  const navigate = useNavigate();
  const { data, updateData, submit, isSubmitting } = useOnboarding();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateData({ [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[e.target.name];
        return next;
      });
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          updateData({
            location: `${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          });
        },
        () => updateData({ location: 'Unable to get location' })
      );
    } else {
      updateData({ location: 'Geolocation not supported' });
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.businessName.trim()) e.businessName = 'Business name is required';
    if (!data.phoneNumber.trim()) e.phoneNumber = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await submit();
    navigate('/app');
  };

  const inputStyle = (field: string): React.CSSProperties => ({
    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 2vw, 0.75rem)',
    fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
    borderRadius: 12,
    border: errors[field] ? '1.5px solid #ef4444' : '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  });

  return (
    <div
      style={{
        marginBlock: 16,
        marginInline: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 35,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className="w-full max-w-[480px] p-8 bg-white rounded-[32px] shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.10)] flex flex-col items-center gap-8">
        <section className="flex flex-col gap-4 items-center">
          <div className="text-center text-black text-3xl font-medium font-['SF_Pro_Text']">
            Let's Set Up Your Business
          </div>
          <div className="text-center text-black/50 text-base font-normal">
            Let Get You Started
          </div>
        </section>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
          {/* Business Name */}
          <div style={{ margin: '4px 0', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start', width: '100%' }}>
            <label style={{ fontSize: 'clamp(0.875rem, 2vw, 0.875rem)', fontWeight: 500, color: '#333' }}>
              Business Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="businessName"
              placeholder='eg. "Pice"'
              value={data.businessName}
              onChange={handleChange}
              style={inputStyle('businessName')}
            />
            {errors.businessName && <p className="text-red-400 text-xs mt-0.5 ml-1">{errors.businessName}</p>}
          </div>

          {/* Phone Number */}
          <div style={{ margin: '4px 0', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start', width: '100%' }}>
            <label style={{ fontSize: 'clamp(0.875rem, 2vw, 0.875rem)', fontWeight: 500, color: '#333' }}>
              Phone Number <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              name="phoneNumber"
              placeholder="0"
              value={data.phoneNumber}
              onChange={handleChange}
              style={inputStyle('phoneNumber')}
            />
            {errors.phoneNumber && <p className="text-red-400 text-xs mt-0.5 ml-1">{errors.phoneNumber}</p>}
          </div>

          {/* Email (Optional) */}
          <div style={{ margin: '4px 0', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start', width: '100%' }}>
            <label style={{ fontSize: 'clamp(0.875rem, 2vw, 0.875rem)', fontWeight: 500, color: '#333' }}>
              Email<span className="text-black/40">(Optional)</span>
            </label>
            <input
              type="text"
              name="email"
              placeholder="company@gmail.com"
              value={data.email}
              onChange={handleChange}
              style={{ ...inputStyle(''), border: '1px solid #ccc' }}
            />
          </div>

          {/* Business Type */}
          <div style={{ margin: '4px 0', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start', width: '100%' }}>
            <label style={{ fontSize: 'clamp(0.875rem, 2vw, 0.875rem)', fontWeight: 500, color: '#333' }}>
              Business Type
            </label>
            <select
              name="businessType"
              value={data.businessType}
              onChange={handleChange}
              style={{
                padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 2vw, 0.75rem)',
                fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
                borderRadius: 12,
                border: '1px solid #ccc',
                width: '100%',
                boxSizing: 'border-box',
              }}
              defaultValue=""
            >
              <option value="" disabled>Select Business Type</option>
              {BUSINESS_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div style={{ margin: '4px 0', display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'flex-start', width: '100%' }}>
            <label style={{ fontSize: 'clamp(0.875rem, 2vw, 0.875rem)', fontWeight: 500, color: '#333' }}>
              Your Location
            </label>
            <input
              type="text"
              name="location"
              placeholder="Search Location, Hostel, Landmark"
              value={data.location}
              onChange={handleChange}
              style={{ ...inputStyle(''), border: '1px solid #ccc' }}
            />
          </div>

          {/* Use current location */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            className="w-auto p-3 bg-orange-500/5 rounded-3xl inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-orange-500/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M1.46797 8.06377C1.70225 8.29806 1.93654 8.37177 2.39883 8.37177L7.46797 8.39863C7.51482 8.39863 7.55482 8.39863 7.57511 8.4252C7.59511 8.4452 7.60168 8.48549 7.60168 8.52577L7.62168 13.6018C7.62854 14.0638 7.70225 14.2981 7.93654 14.5323C8.2514 14.8538 8.6934 14.8003 9.0214 14.4789C9.19568 14.3046 9.33625 14.0169 9.4634 13.7489L14.5863 2.70006C14.854 2.13777 14.8205 1.72234 14.5463 1.44777C14.278 1.18006 13.8628 1.14663 13.3005 1.41434L2.2514 6.5372C1.9834 6.66434 1.69568 6.80492 1.5214 6.9792C1.19997 7.3072 1.14654 7.74263 1.46797 8.06406" fill="#FC6011" />
            </svg>
            <p className="text-orange-500 text-sm font-medium">Use my current Location</p>
          </button>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-[50px] mt-4 bg-[#FF9933] text-white border-none rounded-3xl text-base font-bold cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Saving...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BusinessSetup;
