
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Role } from '../../types';
import ChangePasswordModal from '../Dashboard/ChangePasswordModal';

const BellIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 00-5-5.917V5a1 1 0 00-2 0v.083A6 6 0 006 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
    </svg>
);

const ChevronDownIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
);

const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGfUExURQAAANqcRsGgT7yYR7ucSLGSRquNR6aJR6aJR6aJR6WIRqWERJ+DER9JDRw/CxU0CNyjSMGlUrOiTbifS7WgS7GbSrGYSKyRSKqPSKeKR6GHR56FRZ2ERZqDRZiBRZeBRJWARJSAQ5F/QpB+Qot6PId3PId2PIZ2PIV1PIV1O4N0OoNzOn9xOX1wOYFsM3hpH3JmHHFkG29hGG5fF2xeFnFbE3VaE3pbE3xbFHtcEn5cEIBcDoNaD4RZD4laEIlbEYtcEo1eE49fFJFgFZJiFpVkF5hmGZpoGpxqG59tHZ9tHaFuHqNyIKRzIadyIKh1Ia56JKt5I697JbB+J7J/KLWAKbaCK7iELb+IাবলীরKbOULrGUrjEVrXBUK/ASavASajASqi/SaW9SKG6R523RpuzRJixQ5KwQY+uP4yoPoenPIWjNoGgMoCgMoCgM4SjNX+eMHybLXqYLXCWK3GVKnOSKHGSJ2+PHWyOGWuNGGeLFl+JFVyHE1uGEFeFEVSEEFOAEVGAEVCAEFJ/D058Dk17DEs5Ckk3CUIvB0ArBj8oBjwmBjsoBjopBTkoBTgnBTgmBSAgAP///y1a+yYAAAAhdFJOUwABAgMEBQYHCQwPEhQVFxgZGhweHyAiKCkqKywtLi8xMjQ1/bJ3AAAE/UlEQVR4Xu2cW3uqPBCAQ+fGAhAFRUTQo1jwouA13v//3xMt07Z7d5KcmQd9ns/JdJo7d2Z2EwAAAAAAAAAAAAAAAAAAAAA/LkmS5HFJkvyUu5zkeSRpSZI8m+5y2jQ0Q/I4JUlSaZp+l82UJJ/X3bW0L/3oTUn+q45Kkr/m6qY25C+l/yF/yH+R/2p/5C+lP6Z/TP/3V/1p+xP2/yr7F/ZH2H+0P8D+Eftn7C+xf0h/wP4R+4fsB9kfst9gf5T9Q/ZD7I/YD7I/ZD/A/hH7h+wH2R+y32B/lP1D9kPsj9gPsj9kP8D+EfuH7AfZH7LfYH+U/UP2Q+yP2A+yP2Q/wP4R+4fsB9kfst9gf5T9Q/ZD7A+xN7eN9UfYE1s/YJ+S/1l/zP5j+tP+9/Sv/f/R/pf94fpT/wD8M/kP85/yP/Zf3S/zv9p/9T/k/+n/lP9T/hP+0/7j/lf+o/7b/mv+x/zf+w/5T/uf8r/33/M/8p/zP/af8r/33/c/9h/xP/S/4L/uf87/kv+i/6L/ov8R/0X/S/5b/gv+S/5H/kv+5/wP+B/wP+B/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/2P+x/yP+R/yP+R/yH+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8h/yP+Q/yP+R/yP+R/yP+Q/yH/Y/7H/I/5H/I/5H/If5D/If9j/sf8j/kf8j/kf8j/kP8r/o//D9K/9/9H/lf2h+3P+h/z3/K/1P+U/6r/tP+S/7b/mP+3/yH/K/9z/n/97/mv/J/5D/pf9L/kv+5/wf87/kP+1/wP+B/yv/L/8g/5L/m/8n/y/9T/qv+l/z//H//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADz4P/4M/ANuY37z0+R8aAAAAAElFTSuQmCC";

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const dashboardPath = user?.role === Role.Admin ? '/admin' : '/staff';
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setIsDropdownOpen(false); // Close dropdown when modal opens
  };

  return (
    <>
      <header className="bg-gray-900 bg-opacity-70 backdrop-blur-sm shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to={dashboardPath} className="flex items-center space-x-3">
                  <img src={logoBase64} alt="AMIN TOUCH Logo" className="h-12 w-auto"/>
                  <span className="hidden sm:block text-white text-xl font-bold">AMIN TOUCH</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none">
                  <span className="sr-only">View notifications</span>
                  <BellIcon />
              </button>
              
              <div className="relative" ref={dropdownRef}>
                  <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center p-2 rounded-md text-white font-medium hover:bg-gray-700 focus:outline-none"
                  >
                      <span className="hidden sm:block">{user?.name}</span>
                      <span className="sm:hidden">Menu</span>
                      <ChevronDownIcon />
                  </button>
                  {isDropdownOpen && (
                      <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <div className="py-1">
                                <div className="px-4 py-2 text-sm text-gray-400 sm:hidden border-b border-gray-700">{user?.name}</div>
                              <button
                                  onClick={handleOpenPasswordModal}
                                  className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                              >
                                  Change Password
                              </button>
                              <button
                                  onClick={logout}
                                  className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                              >
                                  Logout
                              </button>
                          </div>
                      </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {user && (
         <ChangePasswordModal
            isOpen={isPasswordModalOpen}
            onClose={() => setIsPasswordModalOpen(false)}
            currentUser={user}
          />
      )}
    </>
  );
};

export default Header;
