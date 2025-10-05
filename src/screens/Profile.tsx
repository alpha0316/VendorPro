
import './../App.css'
import { useState } from 'react';

// import ErrorBoundary from './components/ErrorBoundary';
// import { useNavigate } from 'react-router-dom';

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

    // const navigate = useNavigate();

      const locations: Location[]  = [
    { id: '1', name: 'Main Library', description: 'On Campus', latitude: 6.675033566213408, longitude: -1.5723546778455368,
      dropPoints: [ 
        { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
        { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.5675650457295751 },
        { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
        { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
        { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
      ]
    },
    { id: '2', name: 'Brunei', description: 'Hub for student activities', latitude: 6.670465091472612, longitude: -1.5741574445526254, 
      dropPoints: [ 
        { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
        { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
        { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
        { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
        { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 }
      ] 
    },
    { id: '3', name: 'Commercial Area', description: 'On Campus', latitude: 6.682751297721754, longitude: -1.5769726260262382,
      dropPoints: [ 
        { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
        { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.5675650457295751 },
        { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
        { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 },
        { name: 'Hall 7', latitude: 6.679295619563862, longitude: -1.572807677030472 },
        { name: 'Commerical Area', latitude: 6.682751297721754, longitude: -1.5769726260262382, },
      ]
    },

    { id: '4', name: 'Hall 7', description: 'Hub for student activities', latitude: 6.679295619563862, longitude: -1.572807677030472,
      dropPoints: [ 
        { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
        { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
        // { name: 'Commercial Area', latitude: 6.682751297721754, longitude: -1.5769726260262382, },
        { name: 'Hall 7', latitude: 6.679295619563862, longitude: -1.572807677030472 },
        { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308 }
        
      ]
    },
    { id: '5', name: 'Gaza', description: 'Off Campus', latitude: 6.686603046574587, longitude: -1.556854180379707, 
      dropPoints: [ 
        { name: 'Pharmacy Busstop', latitude: 6.67480379472123, longitude: -1.5663873751176354 },
        { name: 'Medical Village', latitude: 6.6800787890749245, longitude: -1.549747261104641 },
        { name: 'Gaza', latitude: 6.686603046574587, longitude: -1.556854180379707 },
        // 6.686603046574587, -1.5565200861528035
      ]
    },
    { id: '6', name: 'Medical Village', description: 'Hub for student activities', latitude: 6.6800787890749245, longitude: -1.549747261104641,   
      dropPoints: [ 
        { name: 'Gaza', latitude: 6.686603046574587, longitude: -1.556854180379707 },
        { name: 'Pharmacy Busstop', latitude: 6.67480379472123, longitude: -1.5663873751176354 },
        { name: 'Medical Village', latitude: 6.6800787890749245, longitude: -1.549747261104641 }
      ] 
    },
    { id: '7', name: 'Pharmacy Busstop', description: 'On Campus', latitude: 6.67480379472123, longitude: -1.5663873751176354,
      dropPoints: [ 
        { name: 'Medical Village', latitude: 6.6800787890749245, longitude: -1.549747261104641 },
        { name: 'Gaza', latitude: 6.686603046574587, longitude: -1.556854180379707 },
        { name: 'Pharmacy Busstop', latitude: 6.67480379472123, longitude: -1.5663873751176354 }
      ] 
    },
    { id: '8', name: 'Pentecost Busstop', description: 'On Campus', latitude: 6.674545299373284, longitude: -1.5675650457295751,
      dropPoints: [ 
        { name: 'Commercial Area', latitude: 6.682751297721754, longitude: -1.5769726260262382, },
        { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
      
        { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
        { name: 'Hall 7', latitude: 6.679295619563862, longitude: -1.572807677030472 },
        { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
          { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
        { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308 }

      ] 
    },
    { id: '9', name: 'SRC Busstop', description: 'On Campus', latitude: 6.675223889340042, longitude: -1.5678831412482812, 
      dropPoints: [ 
        { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
        { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
        { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 },
        { name: 'Commercial Area', latitude: 6.682756553904525, longitude: -1.576990347851461 },
        { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
      ] 
    },
    { id: '10', name: 'KSB', description: 'Hub for student activities', latitude: 6.669314250173885, longitude: -1.567181795001016,
      dropPoints: [ 
        { name: 'Brunei', latitude: 6.670465091472612, longitude: -1.5741574445526254 },
        { name: 'Main Library', latitude: 6.675033566213408, longitude: -1.5723546778455368 },
        { name: 'Commercial Area', latitude: 6.682756553904525, longitude: -1.576990347851461 },
        { name: 'Hall 7', latitude: 6.679295619563862, longitude: -1.572807677030472 },
        { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 },
        { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
        { name: 'Pentecost Busstop', latitude: 6.674545299373284, longitude: -1.567565045729575 },
        { name: 'KSB', latitude: 6.669314250173885, longitude: -1.567181795001016 },
        { name: 'Paa Joe Round About', latitude: 6.675187511866504, longitude: -1.570775090040308 }
      ] 
    },
    { id: '11', name: 'Conti Busstop', description: 'Hub for student activities', latitude: 6.679644223364716, longitude: -1.572967657880401, 
      dropPoints: [ 
        // { name: 'SRC Busstop', latitude: 6.675223889340042, longitude: -1.5678831412482812 },
        { name: 'Commercial Area', latitude: 6.682756553904525, longitude: -1.576990347851461 },
        { name: 'Conti Busstop', latitude: 6.679644223364716, longitude: -1.572967657880401 }
      ]
    },
  ];

    const [searchQuery, setSearchQuery] = useState('');
    const [, setFilteredLocations] = useState<Location[]>(locations);
    const [, setSelectedLocation] = useState<Location | null>(null)
    const [pickUp, setpickUp] =  useState<Location | null>(null)
    const [dropOff, setDropOff] =  useState<Location | null>(null)
    const [isSelectingDropOff, setIsSelectingDropOff] = useState(false)
    const [pickUpDetails, setpickUpDetail] =  useState<Location | null>(null)
    const [, setInputFocused] = useState(false);
    const [dropDown, setDropDown] = useState(true)
    



        const handleClearPickUp = () => {
          setpickUp(null);
          setpickUpDetail(null);
          setFilteredLocations(locations);
          setSearchQuery('');
          setIsSelectingDropOff(false);
          setSelectedLocation(null);
          // setPickUpCoordinates(null);
        }

        const handleClearDropOff = () => {
          setDropOff(null);
          // setdropOffDetail(null);
          setFilteredLocations(locations);
          setSearchQuery('');
          setIsSelectingDropOff(false);
          setSelectedLocation(null);
          // setPickUpCoordinates(null);
        }

        const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
          const searchQuery = event.target.value;
          setSearchQuery(searchQuery);

          if (searchQuery === '') {
            setFilteredLocations(locations);
          } else if (isSelectingDropOff && pickUp) {
            const validDropOffPoints = locations.filter((location) =>
              location.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
              pickUpDetails?.dropPoints.some(dp => dp.name === location.name)
            );
            setFilteredLocations(validDropOffPoints);
          } else {
            const filterData = locations.filter((location) =>
              location.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredLocations(filterData);
          }
        };



          // const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
          //   const searchQuery = event.target.value;
          //   setSearchQuery(searchQuery);

          //   if (searchQuery === '') {
          //     setFilteredLocations(locations);
          //   } else if (isSelectingDropOff && pickUp) {
          //     const validDropOffPoints = locations.filter((location) =>
          //       location.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          //       pickUpDetails?.dropPoints.some(dp => dp.name === location.name)
          //     );
          //     setFilteredLocations(validDropOffPoints);
          //   } else {
          //     const filterData = locations.filter((location) =>
          //       location.name.toLowerCase().includes(searchQuery.toLowerCase())
          //     );
          //     setFilteredLocations(filterData);
          //   }
          // };

          const handleInputFocus = () => {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';

            if (!dropDown) {
              setDropDown(true); 
            }
            setInputFocused(true); 
          };
          
          const handleInputBlur = () => {

            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';

            setInputFocused(false);
            if (!pickUp && !dropOff) {
              setDropDown(true); 
            }
          };

          const handleKeyPress = (event : any) => {
            if (event.key === 'Enter') {
              setInputFocused(false);
              // console.log(inputFocused)
            }
          };







  return (
    <>
      <main className='flex '>
          

          <section className='flex flex-col w-full '>
              <nav className='flex items-center justify-space px-8 h-14 border-b border-black/10 w-full'>
                <nav className='flex items-center px-2 py-1 gap-2 rounded w-full'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                      <path d="M7 7.50002C8.61083 7.50002 9.91666 6.19418 9.91666 4.58335C9.91666 2.97252 8.61083 1.66669 7 1.66669C5.38916 1.66669 4.08333 2.97252 4.08333 4.58335C4.08333 6.19418 5.38916 7.50002 7 7.50002Z" fill="black" fill-opacity="1"/>
                      <path d="M6.99999 8.95831C4.07749 8.95831 1.69749 10.9183 1.69749 13.3333C1.69749 13.4966 1.82583 13.625 1.98916 13.625H12.0108C12.1742 13.625 12.3025 13.4966 12.3025 13.3333C12.3025 10.9183 9.92249 8.95831 6.99999 8.95831Z" fill="black" fill-opacity="1"/>
                    </svg>
                    <p className='text-black text-sm font-normal' >Profile</p>
                  </nav>


                    <aside className='flex items-center gap-4 justify-center'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                        <path d="M19.3399 14.99L18.3399 13.33C18.1299 12.96 17.9399 12.26 17.9399 11.85V9.32C17.9399 6.97 16.5599 4.94 14.5699 3.99C14.0499 3.07 13.0899 2.5 11.9899 2.5C10.8999 2.5 9.91994 3.09 9.39994 4.02C7.44994 4.99 6.09994 7 6.09994 9.32V11.85C6.09994 12.26 5.90994 12.96 5.69994 13.32L4.68994 14.99C4.28994 15.66 4.19994 16.4 4.44994 17.08C4.68994 17.75 5.25994 18.27 5.99994 18.52C7.93994 19.18 9.97994 19.5 12.0199 19.5C14.0599 19.5 16.0999 19.18 18.0399 18.53C18.7399 18.3 19.2799 17.77 19.5399 17.08C19.7999 16.39 19.7299 15.63 19.3399 14.99Z" fill="black" fill-opacity="0.5"/>
                        <path d="M14.8301 20.51C14.4101 21.67 13.3001 22.5 12.0001 22.5C11.2101 22.5 10.4301 22.18 9.88005 21.61C9.56005 21.31 9.32005 20.91 9.18005 20.5C9.31005 20.52 9.44005 20.53 9.58005 20.55C9.81005 20.58 10.0501 20.61 10.2901 20.63C10.8601 20.68 11.4401 20.71 12.0201 20.71C12.5901 20.71 13.1601 20.68 13.7201 20.63C13.9301 20.61 14.1401 20.6 14.3401 20.57C14.5001 20.55 14.6601 20.53 14.8301 20.51Z" fill="black" fill-opacity="0.5"/>
                      </svg>

                      <div className='flex items-center gap-8'>
                          <div className='flex items-center gap-2 '>
                              <div className="w-6 h-6 p-1 bg-green-600 rounded-[40px] inline-flex flex-col justify-center items-center gap-2.5">
                                  <div className="justify-center text-white text-xs font-bold">E</div>
                              </div>
                              <p className='text-black/80 text-xs'>Essandoh</p>
                          </div>

                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="17" viewBox="0 0 16 17" fill="none">
                            <path d="M8 10.5C9.10457 10.5 10 9.60457 10 8.5C10 7.39543 9.10457 6.5 8 6.5C6.89543 6.5 6 7.39543 6 8.5C6 9.60457 6.89543 10.5 8 10.5Z" stroke="black" stroke-opacity="0.6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M1.33337 9.08667V7.91333C1.33337 7.22 1.90004 6.64667 2.60004 6.64667C3.80671 6.64667 4.30004 5.79333 3.69337 4.74667C3.34671 4.14667 3.55337 3.36667 4.16004 3.02L5.31337 2.36C5.84004 2.04666 6.52004 2.23333 6.83337 2.76L6.90671 2.88666C7.50671 3.93333 8.49337 3.93333 9.10004 2.88666L9.17337 2.76C9.48671 2.23333 10.1667 2.04666 10.6934 2.36L11.8467 3.02C12.4534 3.36667 12.66 4.14667 12.3134 4.74667C11.7067 5.79333 12.2 6.64667 13.4067 6.64667C14.1 6.64667 14.6734 7.21333 14.6734 7.91333V9.08667C14.6734 9.78 14.1067 10.3533 13.4067 10.3533C12.2 10.3533 11.7067 11.2067 12.3134 12.2533C12.66 12.86 12.4534 13.6333 11.8467 13.98L10.6934 14.64C10.1667 14.9533 9.48671 14.7667 9.17337 14.24L9.10004 14.1133C8.50004 13.0667 7.51337 13.0667 6.90671 14.1133L6.83337 14.24C6.52004 14.7667 5.84004 14.9533 5.31337 14.64L4.16004 13.98C3.55337 13.6333 3.34671 12.8533 3.69337 12.2533C4.30004 11.2067 3.80671 10.3533 2.60004 10.3533C1.90004 10.3533 1.33337 9.78 1.33337 9.08667Z" stroke="black" stroke-opacity="0.6" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                          </svg>
                          
                      </div>
              </aside>
              </nav>

              <main className='flex'>

                <section className='w-[850px] h-[100%] bg-black/20'>

                </section>

              </main>

            
          </section>

      </main>
    </>
  )
}

export default App
