import  { useState, useRef, useEffect } from 'react';
import { ChevronDown, LogOut, User, Menu, X, PenTool } from 'lucide-react';
import { HandleLogout } from '../../ApiService/ApiService';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearUser } from '../../Redux/slices/UserSlice';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = async (e:any) => {
    e.preventDefault();
    try {
      dispatch(clearUser());
      await HandleLogout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSeeDetails = (e:any) => {
    e.preventDefault();
    navigate('/account');
  };

  const handleWrite = (e:any) => {
    e.preventDefault();
    navigate('/write');
  };

  useEffect(() => {
    const handleClickOutside = (event:any) => {
      //@ts-ignore
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/home", label: "Home" },
  ];

  return (
    <nav className="bg-gradient-to-r from-purple-900 to-indigo-800 text-white shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/home" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 hover:from-purple-500 hover:to-pink-500 transition-all duration-300">
              Blog.in
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
            <NavLink href="/write" onClick={handleWrite}>
              <PenTool className="mr-1" size={18} />
              Write
            </NavLink>
            <UserDropdown
              isOpen={isDropdownOpen}
              toggleDropdown={toggleDropdown}
              handleSeeDetails={handleSeeDetails}
              handleLogout={handleLogout}
              dropdownRef={dropdownRef}
            />
          </div>
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-pink-500 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-colors duration-200"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        navLinks={navLinks}
        handleWrite={handleWrite}
        handleLogout={handleLogout}
        closeMenu={() => setIsMobileMenuOpen(false)}
      />
    </nav>
  );
};

const NavLink = ({ href, children, onClick }:any) => (
  <a
    href={href}
    onClick={onClick}
    className="text-white hover:text-pink-500 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
  >
    {children}
  </a>
);

const UserDropdown = ({ isOpen, toggleDropdown, handleSeeDetails, handleLogout, dropdownRef }:any) => (
  <div className="relative" ref={dropdownRef}>
    <button
      onClick={toggleDropdown}
      className="flex items-center text-white hover:text-pink-500 transition-colors duration-200"
      aria-haspopup="true"
      aria-expanded={isOpen}
    >
      <User className="mr-1" size={18} />
      <span>Account</span>
      <ChevronDown className="ml-1" size={18} />
    </button>
    {isOpen && (
      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transition-all duration-200 ease-in-out transform origin-top-right">
        <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
          <DropdownItem onClick={handleSeeDetails} icon={<User size={18} />}>
            Account details
          </DropdownItem>
          <hr className="my-1 border-t border-gray-200" />
          <DropdownItem onClick={handleLogout} icon={<LogOut size={18} />} className="text-red-500 hover:bg-red-100 hover:text-red-700">
            Logout
          </DropdownItem>
        </div>
      </div>
    )}
  </div>
);

const DropdownItem = ({ onClick, icon, children, className = "text-gray-700 hover:bg-gray-200 hover:text-gray-900" }:any) => (
  <a
    href="#"
    className={`flex items-center space-x-2 px-4 py-2 text-sm ${className} rounded-lg transition duration-200 ease-in-out`}
    role="menuitem"
    onClick={onClick}
  >
    <span className="text-gray-500">{icon}</span>
    <span>{children}</span>
  </a>
);

const MobileMenu = ({ isOpen, navLinks, handleWrite, handleLogout, closeMenu }:any) => (
  <div className={`md:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0 overflow-hidden'}`}>
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-purple-800 shadow-inner">
      {navLinks.map((link:any) => (
        <MobileNavLink key={link.href} href={link.href} onClick={closeMenu}>
          {link.label}
        </MobileNavLink>
      ))}
      <MobileNavLink href="/write" onClick={(e:any) => { closeMenu(); handleWrite(e); }}>
        <PenTool className="mr-2" size={18} />
        Write
      </MobileNavLink>
      <button
        onClick={handleLogout}
        className="flex items-center w-full text-left px-3 py-2 rounded-md text-base font-medium text-white hover:text-pink-500 hover:bg-purple-700 focus:outline-none focus:text-white focus:bg-purple-700 transition-colors duration-200"
      >
        <LogOut className="mr-2" size={18} />
        Logout
      </button>
    </div>
  </div>
);

const MobileNavLink = ({ href, onClick, children }:any) => (
  <a
    href={href}
    onClick={onClick}
    className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white hover:text-pink-500 hover:bg-purple-700 focus:outline-none focus:text-white focus:bg-purple-700 transition-colors duration-200"
  >
    {children}
  </a>
);

export default Navbar;