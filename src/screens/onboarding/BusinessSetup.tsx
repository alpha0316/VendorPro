import { useNavigate } from 'react-router-dom';
import { useOnboarding } from '../../contexts/OnboardingContext';

const BUSINESS_TYPES = ['Retail', 'Wholesale', 'Service'];

const BusinessSetup = () => {
  const navigate = useNavigate();
  const { data, updateData } = useOnboarding();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    updateData({ [e.target.name]: e.target.value });
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

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  const inputStyle: React.CSSProperties = {
    padding: 'clamp(0.5rem, 2vw, 0.625rem) clamp(0.75rem, 2vw, 0.75rem)',
    fontSize: 'clamp(0.875rem, 2vw, 0.875rem)',
    borderRadius: 12,
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
  <div className="min-h-screen flex flex-col items-center">
    {/* Logo + User Bar — full width, top of page */}
    <div className="flex items-center justify-between w-full px-4 sm:px-6 md:px-8 mt-4 sm:mt-6 md:mt-8">
      <div className="flex items-center cursor-pointer">
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

    {/* Card Container */}
    <div className="px-4 py-4 flex justify-center w-full">
    <div
      className="
        w-full max-w-120
        flex flex-col items-center gap-8

        /* Mobile: full width, no card styling */
        bg-transparent rounded-none shadow-none p-0 mx-0 

        /* Desktop: card styling */
        sm:bg-white sm:rounded-4xl  sm:p-8
        sm:shadow-[0px_1px_4px_0px_rgba(12,12,13,0.05),0px_1px_4px_0px_rgba(12,12,13,0.10)]
      "
    >

      {/* Header */}
      <section className="flex flex-col gap-4 items-center">
        <div className="text-center text-black text-3xl font-medium font-['SF_Pro_Text']">
          Let's Set Up Your Business
        </div>
        <div className="text-center text-black/50 text-base font-normal">
          Let Get You Started
        </div>
      </section>

      {/* Form */}
      <form onSubmit={handleContinue} className="flex flex-col gap-2 w-full">
        {/* Business Name */}
        <div className="my-1 flex flex-col gap-1 items-start w-full">
          <label className="text-sm font-medium text-[#333]">
            Business Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="businessName"
            placeholder='eg. "Pice"'
            value={data.businessName}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Phone Number */}
        <div className="my-1 flex flex-col gap-1 items-start w-full">
          <label className="text-sm font-medium text-[#333]">
            Phone Number <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            name="phoneNumber"
            placeholder="0"
            value={data.phoneNumber}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div className="my-1 flex flex-col gap-1 items-start w-full">
          <label className="text-sm font-medium text-[#333]">
            Email <span className="text-black/40">(Optional)</span>
          </label>
          <input
            type="text"
            name="email"
            placeholder="company@gmail.com"
            value={data.email}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Business Type */}
        <div className="my-1 flex flex-col gap-1 items-start w-full">
          <label className="text-sm font-medium text-[#333]">
            Business Type
          </label>
          <select
            name="businessType"
            value={data.businessType}
            onChange={handleChange}
            className="w-full box-border rounded-xl border border-[#ccc] px-3 py-2.5 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Select Business Type
            </option>
            {BUSINESS_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Location */}
        <div className="my-1 flex flex-col gap-1 items-start w-full">
          <label className="text-sm font-medium text-[#333]">
            Your Location
          </label>
          <input
            type="text"
            name="location"
            placeholder="Search Location, Hostel, Landmark"
            value={data.location}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        {/* Use Current Location */}
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="w-fit p-3 bg-orange-500/5 rounded-3xl inline-flex justify-start items-center gap-3 cursor-pointer hover:bg-orange-500/10 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M1.46797 8.06377C1.70225 8.29806 1.93654 8.37177 2.39883 8.37177L7.46797 8.39863C7.51482 8.39863 7.55482 8.39863 7.57511 8.4252C7.59511 8.4452 7.60168 8.48549 7.60168 8.52577L7.62168 13.6018C7.62854 14.0638 7.70225 14.2981 7.93654 14.5323C8.2514 14.8538 8.6934 14.8003 9.0214 14.4789C9.19568 14.3046 9.33625 14.0169 9.4634 13.7489L14.5863 2.70006C14.854 2.13777 14.8205 1.72234 14.5463 1.44777C14.278 1.18006 13.8628 1.14663 13.3005 1.41434L2.2514 6.5372C1.9834 6.66434 1.69568 6.80492 1.5214 6.9792C1.19997 7.3072 1.14654 7.74263 1.46797 8.06406"
              fill="#FC6011"
            />
          </svg>
          <p className="text-orange-500 text-sm font-medium">
            Use my current Location
          </p>
        </button>

        {/* Continue Button */}
        <button
          type="submit"
          className="
            w-full h-12.5 mt-4
            bg-[#FF9933] text-white border-none
            rounded-3xl text-base font-bold
            cursor-pointer transition-all
            hover:-translate-y-0.5
            hover:shadow-lg hover:shadow-orange-200
          "
        >
          Continue
        </button>
      </form>
    </div>
  </div>
</div>
);
};

export default BusinessSetup;
