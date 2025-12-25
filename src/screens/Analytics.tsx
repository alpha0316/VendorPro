
import './../App.css'
import { useState } from 'react';

import RevenueChart from '../components/ExpenseGraph';

interface DropPoint {
  name: string;
  latitude: number;
  longitude: number;
}

interface Location {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  dropPoints: DropPoint[];
}

function App() {


  return (
    <>
      <main className='flex flex-col items-center w-full '>
        <section className='flex flex-col w-full '>
          <div className='flex items-center justify-between w-[1132px] mt-8 '>
            <div
              onClick={() => navigate('/AddOrders')}
              className="justify-center items-center flex-row hidden sm:flex">
              <img src="/logo.png" alt="Logo" className="h-5 w-3" />
              <span className="text-red-600 text-lg font-bold p-0">B</span>
              <span className="text-black/50 text-lg font-bold ">ites.</span>
            </div>

            <div className="h-6 px-1 py-2.5 bg-orange-400 rounded-[50px] inline-flex flex-col justify-center items-center gap-2.5">
              <div className="text-center justify-start text-white text-xs">R 👩🏽‍🍳</div>
            </div>
          </div>
        </section>

        <main className='flex  w-full flex-col items-center justify-center gap-3 mt-8'>
          <p className="text-black text-base font-bold w-full text-left">Analytics</p>

          <section className='flex w-full items-center justify-between gap-4 '>
            <figure>
              <div className="w-64 inline-flex flex-col justify-start items-start gap-6">
                <div className="self-stretch p-1 bg-neutral-50 rounded-lg inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-3.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M11.0833 8.75C9.79417 8.75 8.75 9.79417 8.75 11.0833C8.75 11.5208 8.8725 11.935 9.08833 12.285C9.49083 12.9617 10.2317 13.4167 11.0833 13.4167C11.935 13.4167 12.6758 12.9617 13.0783 12.285C13.2942 11.935 13.4167 11.5208 13.4167 11.0833C13.4167 9.79417 12.3725 8.75 11.0833 8.75ZM12.2908 10.8325L11.0483 11.9817C10.9667 12.0575 10.8558 12.0983 10.7508 12.0983C10.64 12.0983 10.5292 12.0575 10.4417 11.97L9.86417 11.3925C9.695 11.2233 9.695 10.9433 9.86417 10.7742C10.0333 10.605 10.3133 10.605 10.4825 10.7742L10.7625 11.0542L11.6958 10.1908C11.8708 10.0275 12.1508 10.0392 12.3142 10.2142C12.4775 10.3892 12.4658 10.6633 12.2908 10.8325Z" fill="black" fill-opacity="0.5" />
                      <path d="M12.8337 4.40417V4.66667C12.8337 4.9875 12.5712 5.25 12.2503 5.25H1.75033C1.42949 5.25 1.16699 4.9875 1.16699 4.66667V4.39834C1.16699 3.0625 2.24616 1.98334 3.58199 1.98334H10.4128C11.7487 1.98334 12.8337 3.06834 12.8337 4.40417Z" fill="black" fill-opacity="0.5" />
                      <path d="M1.16699 6.70834V9.60167C1.16699 10.9375 2.24616 12.0167 3.58199 12.0167H7.23366C7.57199 12.0167 7.86366 11.7308 7.83449 11.3925C7.75283 10.5 8.03866 9.53167 8.83199 8.76167C9.15866 8.44084 9.56116 8.19584 9.99866 8.05584C10.7278 7.8225 11.4337 7.85167 12.0578 8.06167C12.437 8.19 12.8337 7.91584 12.8337 7.51334V6.7025C12.8337 6.38167 12.5712 6.11917 12.2503 6.11917H1.75033C1.42949 6.125 1.16699 6.3875 1.16699 6.70834ZM4.66699 10.0625H3.50033C3.26116 10.0625 3.06283 9.86417 3.06283 9.625C3.06283 9.38584 3.26116 9.1875 3.50033 9.1875H4.66699C4.90616 9.1875 5.10449 9.38584 5.10449 9.625C5.10449 9.86417 4.90616 10.0625 4.66699 10.0625Z" fill="black" fill-opacity="0.5" />
                    </svg>
                    <div className="justify-start text-black/60 text-sm font-normal">Total Revenue</div>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7.58345 11.6667L6.41678 11.6667L6.41678 4.66667L3.20845 7.875L2.38012 7.04667L7.00012 2.42667L11.6201 7.04667L10.7918 7.875L7.58345 4.66667L7.58345 11.6667Z" fill="#48BB78" />
                    </svg>
                    <div className="justify-start text-green-400 text-xs font-normal ">(+25%)</div>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="justify-start text-black/80 text-2xl font-semibold">₵ 8,201.00</div>
                  <div className="justify-start"><span className="text-black/50 text-sm font-normal ">Total Revenue since </span><span className="text-black/80 text-sm font-normal ">5th Dec 25</span></div>
                </div>
              </div>
            </figure>

            <figure>
              <div className="w-64 inline-flex flex-col justify-start items-start gap-6">
                <div className="self-stretch p-1 bg-blue-600/5  rounded-lg inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-3.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M4.83594 3.66917C4.59094 3.66917 4.39844 3.47084 4.39844 3.23167V1.60417C4.39844 1.36501 4.59094 1.16667 4.83594 1.16667C5.08094 1.16667 5.27344 1.36501 5.27344 1.60417V3.22584C5.27344 3.47084 5.08094 3.66917 4.83594 3.66917Z" fill="#007AFF" />
                      <path d="M9.16406 3.66917C8.91906 3.66917 8.72656 3.47084 8.72656 3.23167V1.60417C8.72656 1.35917 8.9249 1.16667 9.16406 1.16667C9.40906 1.16667 9.60156 1.36501 9.60156 1.60417V3.22584C9.60156 3.47084 9.40906 3.66917 9.16406 3.66917Z" fill="#007AFF" />
                      <path d="M11.4155 2.62501C11.0305 2.33917 10.4763 2.61334 10.4763 3.09751V3.15584C10.4763 3.83834 9.98634 4.46834 9.30384 4.53834C8.51634 4.62001 7.85134 4.00167 7.85134 3.23167V2.62501C7.85134 2.30417 7.58884 2.04167 7.26801 2.04167H6.73134C6.41051 2.04167 6.14801 2.30417 6.14801 2.62501V3.23167C6.14801 3.69251 5.90884 4.10084 5.54717 4.32834C5.49467 4.36334 5.43634 4.39251 5.37801 4.42167C5.32551 4.45084 5.26717 4.47417 5.20301 4.49167C5.13301 4.51501 5.05717 4.53251 4.97551 4.53834C4.88217 4.55001 4.78884 4.55001 4.69551 4.53834C4.61384 4.53251 4.53801 4.51501 4.46801 4.49167C4.40967 4.47417 4.35134 4.45084 4.29301 4.42167C4.23467 4.39251 4.17634 4.36334 4.12384 4.32834C3.75634 4.07167 3.52301 3.62834 3.52301 3.15584V3.09751C3.52301 2.64834 3.04467 2.38001 2.66551 2.57251C2.65967 2.57834 2.65384 2.57834 2.64801 2.58417C2.62467 2.59584 2.60717 2.60751 2.58384 2.62501C2.56634 2.64251 2.54301 2.65417 2.52551 2.67167C2.36217 2.80001 2.21634 2.94584 2.09384 3.10334C2.02967 3.17334 1.97717 3.24917 1.93051 3.32501C1.92467 3.33084 1.91884 3.33667 1.91301 3.34834C1.86051 3.42417 1.81384 3.51167 1.77301 3.59334C1.76134 3.60501 1.75551 3.61084 1.75551 3.62251C1.72051 3.69251 1.68551 3.76251 1.66217 3.83834C1.64467 3.86751 1.63884 3.89084 1.62717 3.92001C1.59217 4.00751 1.56884 4.09501 1.54551 4.18251C1.52217 4.26417 1.50467 4.35167 1.49301 4.43917C1.48134 4.50334 1.47551 4.56751 1.46967 4.63751C1.46384 4.71917 1.45801 4.80084 1.45801 4.88251V9.99251C1.45801 11.5617 2.72967 12.8333 4.29884 12.8333H9.70051C11.2697 12.8333 12.5413 11.5617 12.5413 9.99251V4.88251C12.5413 3.95501 12.098 3.14417 11.4155 2.62501ZM6.99967 10.1617H4.29301C4.05384 10.1617 3.85551 9.96334 3.85551 9.72417C3.85551 9.47917 4.05384 9.28084 4.29301 9.28084H6.99967C7.24467 9.28084 7.43717 9.47917 7.43717 9.72417C7.43717 9.96334 7.24467 10.1617 6.99967 10.1617ZM8.62134 7.99751H4.29301C4.05384 7.99751 3.85551 7.79917 3.85551 7.56001C3.85551 7.31501 4.05384 7.11667 4.29301 7.11667H8.62134C8.86634 7.11667 9.06467 7.31501 9.06467 7.56001C9.06467 7.79917 8.86634 7.99751 8.62134 7.99751Z" fill="#007AFF" />
                    </svg>
                    <div className="justify-start text-black/60 text-sm font-normal">Total Orders</div>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7.58345 11.6667L6.41678 11.6667L6.41678 4.66667L3.20845 7.875L2.38012 7.04667L7.00012 2.42667L11.6201 7.04667L10.7918 7.875L7.58345 4.66667L7.58345 11.6667Z" fill="#48BB78" />
                    </svg>
                    <div className="justify-start text-green-400 text-xs font-normal ">(+25%)</div>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="justify-start"><span className="text-black/80 text-2xl font-semibold ">131 </span><span className="text-black/40 text-base font-normal">Orders</span></div>
                  <div className="justify-start"><span className="text-black/50 text-sm font-normal">All Orders since </span><span className="text-black/80 text-sm font-normal ">5th Dec 25</span></div>
                </div>
              </div>
            </figure>

            <figure>
              <div className="w-64 inline-flex flex-col justify-start items-start gap-6">
                <div className="self-stretch p-1 bg-teal-400/5 rounded-lg inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-3.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M12.577 6.265L11.7837 5.34333C11.632 5.16833 11.5095 4.84167 11.5095 4.60833V3.61667C11.5095 2.99833 11.002 2.49083 10.3837 2.49083H9.39201C9.16451 2.49083 8.832 2.36833 8.657 2.21667L7.73534 1.42333C7.33284 1.07917 6.67367 1.07917 6.26534 1.42333L5.34951 2.2225C5.17451 2.36833 4.842 2.49083 4.6145 2.49083H3.60534C2.98701 2.49083 2.47951 2.99833 2.47951 3.61667V4.61417C2.47951 4.84167 2.35701 5.16833 2.21117 5.34333L1.42367 6.27083C1.08534 6.67333 1.08534 7.32666 1.42367 7.72916L2.21117 8.65666C2.35701 8.83166 2.47951 9.15833 2.47951 9.38583V10.3833C2.47951 11.0017 2.98701 11.5092 3.60534 11.5092H4.6145C4.842 11.5092 5.17451 11.6317 5.34951 11.7833L6.27117 12.5767C6.67367 12.9208 7.33284 12.9208 7.74117 12.5767L8.66284 11.7833C8.83784 11.6317 9.16451 11.5092 9.39784 11.5092H10.3895C11.0078 11.5092 11.5153 11.0017 11.5153 10.3833V9.39166C11.5153 9.16416 11.6378 8.83166 11.7895 8.65666L12.5828 7.735C12.9212 7.3325 12.9212 6.6675 12.577 6.265ZM9.427 5.8975L6.6095 8.715C6.52784 8.79666 6.41701 8.84333 6.30034 8.84333C6.18367 8.84333 6.07284 8.79666 5.99117 8.715L4.5795 7.30333C4.41034 7.13417 4.41034 6.85416 4.5795 6.685C4.74867 6.51583 5.02867 6.51583 5.19784 6.685L6.30034 7.7875L8.80867 5.27917C8.97784 5.11 9.25784 5.11 9.427 5.27917C9.59617 5.44833 9.59617 5.72833 9.427 5.8975Z" fill="#4DB448" />
                    </svg>
                    <div className="justify-start text-black/60 text-sm ">Delivered Orders</div>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7.58345 11.6667L6.41678 11.6667L6.41678 4.66667L3.20845 7.875L2.38012 7.04667L7.00012 2.42667L11.6201 7.04667L10.7918 7.875L7.58345 4.66667L7.58345 11.6667Z" fill="#48BB78" />
                    </svg>
                    <div className="justify-start text-green-400 text-xs font-normal ">(+25%)</div>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="justify-start text-black/80 text-2xl font-semibold">112</div>
                  <div className="justify-start"><span class="text-black/80 text-sm font-normal">19 Orders </span><span class="text-black/40 text-sm font-normal "> Picked Up By Customers</span></div>
                </div>
              </div>
            </figure>

            <figure>
              <div className="w-64 inline-flex flex-col justify-start items-start gap-6">
                <div className="self-stretch p-1 bg-red-500/5rounded-lg inline-flex justify-between items-center">
                  <div className="flex justify-start items-center gap-3.5">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M11.6492 1.02083H9.93417C9.19333 1.02083 8.75 1.46416 8.75 2.20499V3.91999C8.75 4.66083 9.19333 5.10416 9.93417 5.10416H11.6492C12.39 5.10416 12.8333 4.66083 12.8333 3.91999V2.20499C12.8333 1.46416 12.39 1.02083 11.6492 1.02083ZM11.7775 2.95166C11.7075 3.02166 11.6142 3.05666 11.5208 3.05666C11.4275 3.05666 11.3342 3.02166 11.2642 2.95166L11.1592 2.84666V4.15333C11.1592 4.3575 10.9958 4.52083 10.7917 4.52083C10.5875 4.52083 10.4242 4.3575 10.4242 4.15333V2.84666L10.3192 2.95166C10.1792 3.09166 9.94583 3.09166 9.80583 2.95166C9.66583 2.81166 9.66583 2.57833 9.80583 2.43833L10.535 1.70916C10.5642 1.67999 10.605 1.65666 10.6458 1.63916C10.6575 1.63333 10.6692 1.63333 10.6808 1.62749C10.71 1.61583 10.7392 1.60999 10.7742 1.60999C10.7858 1.60999 10.7975 1.60999 10.8092 1.60999C10.85 1.60999 10.885 1.61583 10.9258 1.63333C10.9317 1.63333 10.9317 1.63333 10.9375 1.63333C10.9783 1.65083 11.0133 1.67416 11.0425 1.70333C11.0483 1.70916 11.0483 1.70916 11.0542 1.70916L11.7833 2.43833C11.9233 2.57833 11.9233 2.81166 11.7775 2.95166Z" fill="#FF383C" />
                      <path d="M1.16699 6.68501V9.60167C1.16699 10.9375 2.24616 12.0167 3.58199 12.0167H10.4128C11.7487 12.0167 12.8337 10.9317 12.8337 9.59584V6.68501C12.8337 6.29417 12.5187 5.97917 12.1278 5.97917H1.87283C1.48199 5.97917 1.16699 6.29417 1.16699 6.68501ZM4.66699 10.0625H3.50033C3.26116 10.0625 3.06283 9.86417 3.06283 9.62501C3.06283 9.38584 3.26116 9.18751 3.50033 9.18751H4.66699C4.90616 9.18751 5.10449 9.38584 5.10449 9.62501C5.10449 9.86417 4.90616 10.0625 4.66699 10.0625ZM8.45866 10.0625H6.12533C5.88616 10.0625 5.68783 9.86417 5.68783 9.62501C5.68783 9.38584 5.88616 9.18751 6.12533 9.18751H8.45866C8.69783 9.18751 8.89616 9.38584 8.89616 9.62501C8.89616 9.86417 8.69783 10.0625 8.45866 10.0625Z" fill="#FF383C" />
                      <path d="M7.87533 2.68917V4.39834C7.87533 4.78917 7.56033 5.10417 7.16949 5.10417H1.87283C1.47616 5.10417 1.16699 4.7775 1.16699 4.38667C1.17283 3.7275 1.43533 3.12667 1.87283 2.68917C2.31033 2.25167 2.91699 1.98334 3.58199 1.98334H7.16949C7.56033 1.98334 7.87533 2.29834 7.87533 2.68917Z" fill="#FF383C" />
                    </svg>
                    <div className="justify-start text-black/60 text-sm font-normal">Refund</div>
                  </div>
                  <div className="flex justify-start items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7.58345 11.6667L6.41678 11.6667L6.41678 4.66667L3.20845 7.875L2.38012 7.04667L7.00012 2.42667L11.6201 7.04667L10.7918 7.875L7.58345 4.66667L7.58345 11.6667Z" fill="#48BB78" />
                    </svg>
                    <div className="justify-start text-green-400 text-xs font-normal ">(+25%)</div>
                  </div>
                </div>
                <div className="flex flex-col justify-start items-start gap-2">
                  <div className="justify-start text-black/80 text-2xl font-semibold ">₵ 80.00</div>
                  <div className="justify-start text-black/80 text-sm font-normal">1 Order</div>
                </div>
              </div>
            </figure>


          </section>

          <section className='w-full mt-8 bg-red-50'>
            <RevenueChart />
          </section>

        </main>



      </main>
    </>
  )
}

export default App
