// components/layout/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    FaUser, FaSignInAlt, FaUserPlus, FaUpload,
    FaShoppingBag, FaStore, FaBars, FaTimes,
    FaHome, FaChartLine, FaSignOutAlt, FaCaretDown
} from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUploadDropdownOpen, setIsUploadDropdownOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle logout
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Upload handlers
    const handleUploadOMS = () => {
        console.log('Upload OMS clicked');
        // Add your upload OMS logic here
        setIsUploadDropdownOpen(false);
    };

    const handleUploadNykaa = () => {
        console.log('Upload Nykaa clicked');
        // Add your upload Nykaa logic here
        setIsUploadDropdownOpen(false);
    };

    const handleUploadShopify = () => {
        console.log('Upload Shopify clicked');
        // Add your upload Shopify logic here
        setIsUploadDropdownOpen(false);
    };

    const isActive = (path) => {
        return location.pathname === path ? 'text-blue-600' : 'text-gray-700';
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200'
            : 'bg-white border-b border-gray-100'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">

                    {/* Logo/Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform">
                                <FaShoppingBag className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    StyleSync
                                </h1>
                                <p className="text-xs text-gray-500">Multi-Channel Manager</p>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Center */}
                    <div className="hidden md:flex items-center space-x-1">
                        <Link
                            to="/"
                            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${isActive('/')} hover:text-blue-600 hover:bg-blue-50`}
                        >
                            <FaStore className="h-4 w-4" />
                            <span>Products</span>
                        </Link>

                        {/* <Link
                            to="/products"
                            className={`px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors ${isActive('/products')} hover:text-blue-600 hover:bg-blue-50`}
                        >
                            <FaStore className="h-4 w-4" />
                            <span>Products</span>
                        </Link> */}

                        {/* Upload Dropdown */}
                        {user && (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUploadDropdownOpen(!isUploadDropdownOpen)}
                                    className="px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                                >
                                    <FaUpload className="h-4 w-4" />
                                    <span>Upload</span>
                                    <FaCaretDown className="h-3 w-3" />
                                </button>

                                {isUploadDropdownOpen && (
                                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-900">Upload to Platforms</p>
                                            <p className="text-xs text-gray-500">Select platform to upload</p>
                                        </div>
                                        <Link to="/oms-report">
                                            <button
                                                onClick={() => setIsUploadDropdownOpen(false)}
                                                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 transition-colors text-left group"
                                            >
                                                <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <FaShoppingBag className="h-5 w-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">Upload OMS Listing </p>
                                                    <p className="text-xs text-gray-500">Order Management System</p>
                                                </div>
                                            </button>
                                        </Link>

                                        <Link to="/shopify_report">
                                            <button
                                                onClick={() => setIsUploadDropdownOpen(false)}

                                                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-green-50 transition-colors text-left group"
                                            >
                                                <div className="h-10 w-10 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <FaStore className="h-5 w-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">  Upload Shopify Products </p>
                                                    <p className="text-xs text-gray-500">E-commerce Platform</p>
                                                </div>
                                            </button>
                                        </Link>


                                        <Link to="/nykaa_report">
                                            <button
                                                onClick={() => setIsUploadDropdownOpen(false)}
                                                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-green-50 transition-colors text-left group"
                                            >
                                                <div className="h-10 w-10 bg-gradient-to-br from-pink-100 to--200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <FaShoppingBag className="h-5 w-5 text-pink-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">   Upload Nykaa SKU Master </p>
                                                    <p className="text-xs text-gray-500">Beauty & Cosmetics</p>
                                                </div>
                                            </button>
                                        </Link>

                                        <Link to="/myntra_report">
                                            <button
                                                onClick={() => setIsUploadDropdownOpen(false)}
                                                className="w-full px-4 py-3 flex items-center space-x-3 hover:bg-green-50 transition-colors text-left group"
                                            >
                                                <div className="h-10 w-10 bg-gradient-to-br from-pink-100 to--200 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <FaShoppingBag className="h-5 w-5 text-[hotpink]" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">   Upload Myntra Listing</p>
                                                    <p className="text-xs text-gray-500">E-commerce Platform</p>
                                                </div>
                                            </button>
                                        </Link>


                                        <div className="px-4 py-2 border-t border-gray-100">
                                            <p className="text-xs text-gray-500">All uploads are processed instantly</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Desktop Navigation - Right (Auth) */}
                    <div className="hidden md:flex items-center space-x-3">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-900">{user.username}</p>
                                    <p className="text-xs text-gray-500">ID: {user.employee_id}</p>
                                </div>

                                <div className="relative group">
                                    <div className="h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center cursor-pointer border-2 border-white shadow">
                                        <FaUser className="h-5 w-5 text-blue-600" />
                                    </div>

                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">


                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 mt-2 border-t border-gray-100 pt-2"
                                        >
                                            <FaSignOutAlt className="inline mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className={`px-5 py-2.5 rounded-lg font-medium flex items-center space-x-2 transition-all ${isActive('/login') ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'}`}
                                >
                                    <FaSignInAlt className="h-4 w-4" />
                                    <span>Login</span>
                                </Link>

                                <Link
                                    to="/register"
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium flex items-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                                >
                                    <FaUserPlus className="h-4 w-4" />
                                    <span>Sign Up</span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="h-10 w-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                        >
                            {isMenuOpen ? (
                                <FaTimes className="h-6 w-6 text-gray-700" />
                            ) : (
                                <FaBars className="h-6 w-6 text-gray-700" />
                            )}
                        </button>
                    </div>
                </div>
            </div>



            {/* Backdrop for mobile menu */}
            {
                isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/20 z-40 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )
            }
        </nav >
    );
};

export default Navbar;