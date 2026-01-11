// components/dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import {
    FaUser, FaIdCard, FaCalendarAlt, FaSignOutAlt,
    FaPlus, FaSearch, FaEdit, FaTrash, FaFilter,
    FaDownload, FaUpload, FaSync, FaChartLine,
    FaAmazon, FaShopify, FaStore, FaExternalLinkAlt,
    FaFileExcel, FaClipboardCheck
} from 'react-icons/fa';
import { MdDashboard, MdInventory, MdAttachMoney } from 'react-icons/md';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [activeTab, setActiveTab] = useState('overview');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalStyles: 0,
        totalProducts: 0,
        activeChannels: 0,
        avgPrice: 0
    });
    const [filters, setFilters] = useState({
        styleNumber: '',
        channel: '',
        status: 'active',
        page: 1,
        limit: 10
    });


    // ********************** open image url *********************

    const openProductUrl = (channel, id) => {
        const mappedUrl = {
            ajio: `https://www.ajio.com/qurvii-women-regular-fit-top/p/${id}?`,
            tatacliq: `https://www.tatacliq.com/qurvii-black-plain-jacket/p-${id?.toLowerCase()}`,
            shopify: `https://qurvii.com/products/${id}`,
            nykaa: `https://www.nykaafashion.com/qurvii/p/${id}`,
            myntra: `http://myntra.com/${id}`,
        }
        window.open(mappedUrl[channel?.toLowerCase()], "_blank")
    }


    // Fetch products and stats on load
    useEffect(() => {
        fetchProducts();
    }, [filters.page, filters.channel]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.styleNumber) params.append('styleNumber', filters.styleNumber);
            if (filters.channel) params.append('channel', filters.channel);
            params.append('page', filters.page);
            params.append('limit', filters.limit);

            const response = await api.get(`/products?${params}`);
            setProducts(response.data.data?.products || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };



    const handleBulkUpload = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const jsonData = JSON.parse(e.target.result);

                if (!Array.isArray(jsonData)) {
                    alert('Invalid file format. Expected array of records.');
                    return;
                }

                const response = await api.post('/products/bulk-upsert', {
                    records: jsonData
                });

                alert(response.data.message);
                fetchProducts();
                fetchDashboardStats();
            } catch (error) {
                alert('Upload failed: ' + (error.response?.data?.message || error.message));
            }
        };
        reader.readAsText(file);
    };

    const exportToCSV = () => {
        const csvContent = "data:text/csv;charset=utf-8,"
            + "Style Number,Channel,Product ID,Price,Status\n"
            + products.map(p =>
                p.marketPlaceDetails.map(mp =>
                    `${p.styleNumber},${mp.channel},${mp.product_id},${mp.price},${mp.status}`
                ).join('\n')
            ).join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "styles_export.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getChannelIcon = (channel) => {
        const icons = {
            amazon: <FaAmazon className="text-orange-500" />,
            flipkart: <FaShopify className="text-blue-500" />,
            myntra: <FaStore className="text-pink-500" />,
            shopify: <FaShopify className="text-green-500" />,
            meesho: <FaStore className="text-purple-500" />,
            default: <FaStore className="text-gray-500" />
        };
        return icons[channel?.toLowerCase()] || icons.default;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    };



    return (
        <div className="min-h-screen bg-gray-50">

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'overview' && (
                    <>
                        {/* Welcome Card */}
                        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h2>
                                    <p className="text-blue-100">Manage your fashion styles across all marketplaces efficiently</p>
                                </div>
                                <div className="bg-white/20 p-4 rounded-xl">
                                    <MdInventory className="h-12 w-12" />
                                </div>
                            </div>
                        </div>



                        {/* Recent Styles */}
                        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-medium text-gray-900">Recent Styles</h3>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    View All →
                                </button>
                            </div>

                            {loading ? (
                                <div className="text-center py-8">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-4 text-gray-500">Loading styles...</p>
                                </div>
                            ) : products.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style #</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Channels</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {products.slice(0, 5).map((product) => (
                                                <tr key={product._id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-bold text-lg text-gray-900">{product.styleNumber}</div>
                                                        <div className="text-sm text-gray-500">
                                                            Added: {new Date(product.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex space-x-2">
                                                            {product.marketPlaceDetails.slice(0, 3).map((mp, idx) => (
                                                                <div key={idx} className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded">
                                                                    {getChannelIcon(mp.channel)}
                                                                    <span className="text-xs font-medium">{mp.channel}</span>
                                                                </div>
                                                            ))}
                                                            {product.marketPlaceDetails.length > 3 && (
                                                                <div className="text-xs text-gray-500">
                                                                    +{product.marketPlaceDetails.length - 3} more
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {product.marketPlaceDetails.map((mp, idx) => (
                                                            <div key={idx} className="text-sm">
                                                                <span className="font-medium">{mp.product_id}</span>
                                                                <span className="text-gray-500 ml-2">{formatPrice(mp.price)}</span>
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {product.marketPlaceDetails.some(mp => mp.status?.toLowerCase() === 'active') ? (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                                Inactive
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <FaClipboardCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">No styles found. Start by uploading some!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {activeTab === 'products' && (
                    <ProductsTab
                        products={products}
                        loading={loading}
                        filters={filters}
                        setFilters={setFilters}
                        fetchProducts={fetchProducts}
                        getChannelIcon={getChannelIcon}
                        formatPrice={formatPrice}
                        openProductUrl={openProductUrl}
                    />
                )}



                {activeTab === 'bulk-upload' && (
                    <BulkUploadTab handleBulkUpload={handleBulkUpload} />
                )}
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Style Manager Pro. All rights reserved.
                        </p>
                        <div className="text-sm text-gray-500">
                            Version 1.0.0 • {products.length} styles loaded
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Products Tab Component
const ProductsTab = ({ products, loading, filters, setFilters, fetchProducts, getChannelIcon, formatPrice, openProductUrl }) => (
    <div className="space-y-6">
        <div className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Product Styles</h2>
                <div className="flex space-x-3">
                    <button
                        onClick={fetchProducts}
                        className="inline-flex items-center px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <FaSync className="mr-2" />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Style Number</label>
                    <input
                        type="number"
                        value={filters.styleNumber}
                        onChange={(e) => setFilters({ ...filters, styleNumber: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., 1001"
                    />
                </div>
                <div className="flex items-end">
                    <button
                        onClick={fetchProducts}
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                        <FaSearch className="mr-2" />
                        Search
                    </button>
                </div>
            </div>

            {/* Products Table */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading products...</p>
                </div>
            ) : products.length > 0 ? (
                <div className="overflow-hidden  shadow ring-1 ring-black ring-opacity-5 rounded-lg ">
                    <table className="min-w-full  ">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Style Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marketplace Details</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>

                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                <span className="font-bold text-blue-700">{product.styleNumber}</span>
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">Style #{product.styleNumber}</div>
                                                <div className="text-sm text-gray-500">
                                                    Created: {new Date(product.createdAt).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-2">
                                            {product.marketPlaceDetails.map((mp, idx) => (
                                                <div key={idx} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                                    <div className="flex items-center space-x-2 hover:bg-pink-100 ease-in duration-75 ">
                                                        {getChannelIcon(mp.channel)}
                                                        <span className="font-medium">{mp.channel}</span>
                                                        <span className="text-sm text-gray-500">({mp.product_id})</span>
                                                    </div>
                                                    <div className="flex gap-4 items-center">
                                                        <span className={`px-2 py-1 text-xs rounded-full ${mp.status?.toLowerCase() === 'active'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {mp.status}
                                                        </span>
                                                        <span>
                                                            <button
                                                                onClick={() => openProductUrl(mp.channel, mp.product_id)}
                                                                className='py-2 px-3 rounded-md cursor-pointer text-xs bg-pink-500 text-white hover:bg-pink-600 duration-75 ease-in'> View Product </button>
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            {product.marketPlaceDetails.map((mp, idx) => (
                                                <div key={idx} className="text-center">
                                                    <div className="font-bold text-gray-900">{formatPrice(mp.price)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <FaSearch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No styles found</h3>
                    <p className="text-gray-500">Try changing your filters or add new styles</p>
                </div>
            )}

            {/* Pagination */}
            {products.length > 0 && (
                <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                            disabled={filters.page === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    </div>
);





export default Dashboard;