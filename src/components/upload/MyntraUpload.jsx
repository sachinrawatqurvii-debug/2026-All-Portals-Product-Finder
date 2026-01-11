// components/uploads/oms/OMSUpload.jsx
import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
    FaCloudUploadAlt, FaSpinner, FaCheckCircle,
    FaFilter, FaDatabase, FaExclamationTriangle,
    FaArrowRight, FaTimes
} from 'react-icons/fa';
import axios from 'axios';

const MyntraUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        ajio: 0,
        tatacliq: 0,
        other: 0,
        duplicates: 0
    });

    // Extract 5-digit style number
    const extractStyleNumber = (sku = "") => {
        return sku.match(/\d{5}/)?.[0] || null;
    };

    // Handle CSV file upload
    const handleCSV = (e) => {
        const uploadedFile = e.target.files[0];
        if (!uploadedFile) return;

        setFile(uploadedFile);
        setRecords([]);
        setFilteredRecords([]);
        setUploadStatus(null);
        setUploadProgress(0);

        Papa.parse(uploadedFile, {
            header: true,
            skipEmptyLines: true,
            complete: ({ data, errors }) => {
                if (errors.length > 0) {
                    console.error('CSV parsing errors:', errors);
                    setUploadStatus({
                        type: 'error',
                        message: 'Error parsing CSV file',
                        details: errors
                    });
                    return;
                }
                processCSVData(data);
            },
            error: (error) => {
                console.error('CSV parsing error:', error);
                setUploadStatus({
                    type: 'error',
                    message: 'Failed to parse CSV file'
                });
            }
        });
    };

    // Process CSV data
    const processCSVData = (rows) => {
        const uniqueMap = new Map(); // key = styleNumber + channel
        const processedRecords = [];
        let otherCount = 0;

        rows.forEach((row) => {
            let raw = row["seller sku code"];

            const styleNumber = parseInt(raw.trim().slice(0, 5), 10);
            const channel = "Myntra";
            const productId = row["style id"]?.trim() || 'not defined';
            const price = row["mrp"] || 44444;

            // Create unique key to avoid duplicates
            const key = `${styleNumber}-${channel.toLowerCase()}`;

            if (!uniqueMap.has(key)) {
                uniqueMap.set(key, true);

                processedRecords.push({
                    styleNumber: Number(styleNumber),
                    channel: channel,
                    product_id: productId,
                    price: price,
                    status: row["style status description"] || "active"
                });
                otherCount++;
                console.log("processed data", processedRecords)

            }
        });

        setRecords(processedRecords);
        setFilteredRecords(processedRecords.slice(0, 10)); // Show only first 10

        setStats({
            total: rows.length,
            other: otherCount,
            duplicates: rows.length - processedRecords.length - otherCount
        });
    };

    // Upload to server
    const uploadToServer = async () => {
        if (records.length === 0) {
            setUploadStatus({
                type: 'warning',
                message: 'No valid Nykaa records found to upload'
            });
            return;
        }

        setLoading(true);
        setUploadProgress(10);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 300);

            // Make API call
            const response = await axios.post("http://localhost:5000/api/products/bulk", { records }, { withCredentials: true });

            clearInterval(progressInterval);
            setUploadProgress(100);

            setUploadStatus({
                type: 'success',
                message: 'Upload completed successfully!',
                data: response.data.data
            });

            // Reset after success
            setTimeout(() => {
                setFile(null);
                setRecords([]);
                setFilteredRecords([]);
                setUploadProgress(0);
            }, 3000);

        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus({
                type: 'error',
                message: error.response?.data?.message || 'Upload failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    // Clear all data
    const clearAll = () => {
        setFile(null);
        setRecords([]);
        setFilteredRecords([]);
        setUploadStatus(null);
        setUploadProgress(0);
    };

    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl shadow-xs border border-gray-200 p-8 ">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">OMS File Upload</h2>
                        <p className="text-gray-600">Upload OMS CSV File</p>
                    </div>

                </div>

                {/* File Upload Zone */}
                <div className={`border-3 border-dashed rounded-2xl p-10 text-center transition-all ${file
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                    }`}>
                    <FaCloudUploadAlt className={`h-20 w-20 mx-auto mb-4 ${file ? 'text-blue-500' : 'text-gray-400'
                        }`} />

                    <div className="mb-6">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">
                            {file ? 'File Selected ✓' : 'Drop Myntra CSV file here'}
                        </h3>
                        <p className="text-gray-500">
                            {file
                                ? file.name
                                : 'or click to browse Myntra file'
                            }
                        </p>
                        {file && (
                            <p className="text-sm text-gray-500 mt-2">
                                {(file.size / 1024).toFixed(2)} KB • {stats.total} rows found
                            </p>
                        )}
                    </div>

                    <label className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl">
                        <FaCloudUploadAlt className="mr-3" />
                        {file ? 'Change File' : 'Select CSV File'}
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleCSV}
                            className="hidden"
                        />
                    </label>
                </div>

                {/* Progress Bar */}
                {uploadProgress > 0 && (
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                            <span className="text-sm font-medium text-blue-600">{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            ></div>
                        </div>
                        {uploadProgress === 100 && (
                            <p className="text-sm text-green-600 mt-2 text-center">
                                <FaCheckCircle className="inline mr-2" />
                                Upload complete!
                            </p>
                        )}
                    </div>
                )}

                {/* Statistics */}
                {stats.total > 0 && (
                    <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                            <FaFilter className="mr-2 text-blue-600" />
                            File Analysis Results
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            <div className="bg-white p-4 rounded-lg text-center shadow-sm">
                                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                <p className="text-sm text-gray-500">Total Rows</p>
                            </div>
                        </div>
                    </div>
                )}
                {/* Action Buttons */}
                <div className="mt-8 flex justify-between">
                    <button
                        onClick={clearAll}
                        disabled={loading}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                    >
                        Clear All
                    </button>

                    <div className="flex space-x-4">
                        <button
                            onClick={() => {
                                // Download filtered records as CSV
                                const csvContent = "data:text/csv;charset=utf-8,"
                                    + "Style Number,Channel,Product ID,Price,Status\n"
                                    + records.map(r =>
                                        `${r.styleNumber},${r.channel},${r.product_id},${r.price},${r.status}`
                                    ).join('\n');

                                const encodedUri = encodeURI(csvContent);
                                const link = document.createElement("a");
                                link.setAttribute("href", encodedUri);
                                link.setAttribute("download", "filtered_records.csv");
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            }}
                            disabled={records.length === 0 || loading}
                            className="px-6 py-3 border border-blue-300 text-blue-700 rounded-xl font-medium hover:bg-blue-50 disabled:opacity-50 transition-colors"
                        >
                            Export Filtered
                        </button>

                        <button
                            onClick={uploadToServer}
                            disabled={records.length === 0 || loading}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center"
                        >
                            {loading ? (
                                <>
                                    <FaSpinner className="animate-spin mr-3" />
                                    Uploading...
                                </>
                            ) : (
                                <>
                                    Upload {records.length} Records
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Preview Table - Show only 10 records */}
                {filteredRecords.length > 0 && (
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center">
                                <FaDatabase className="mr-2 text-blue-600" />
                                Preview (First 10 Records)
                            </h3>
                            <div className="text-sm text-gray-500">
                                Showing 10 of {records.length} filtered records
                            </div>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Style #
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Channel
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price (₹)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredRecords.map((record, index) => (
                                        <tr
                                            key={index}
                                            className={`hover:bg-gray-50 ${record.channel === 'ajio' ? 'bg-blue-50/30' : 'bg-purple-50/30'
                                                }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{record.styleNumber}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.channel === 'ajio'
                                                    ? 'bg-blue-100 text-blue-800'
                                                    : 'bg-purple-100 text-purple-800'
                                                    }`}>
                                                    {record.channel}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-mono text-gray-900">{record.product_id}</div>
                                                {record.channel === 'ajio' && (
                                                    <div className="text-xs text-gray-500">(First 9 digits only)</div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    ₹{record.price.toLocaleString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {records.length > 10 && (
                            <div className="mt-3 text-center text-sm text-gray-500">
                                <FaArrowRight className="inline mr-2" />
                                {records.length - 10} more records will be uploaded but not shown in preview
                            </div>
                        )}
                    </div>
                )}

                {/* Status Messages */}
                {uploadStatus && (
                    <div className={`mt-6 p-4 rounded-xl ${uploadStatus.type === 'success'
                        ? 'bg-green-50 border border-green-200'
                        : uploadStatus.type === 'error'
                            ? 'bg-red-50 border border-red-200'
                            : 'bg-yellow-50 border border-yellow-200'
                        }`}>
                        <div className="flex items-start">
                            {uploadStatus.type === 'success' ? (
                                <FaCheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                            ) : uploadStatus.type === 'error' ? (
                                <FaTimes className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                            ) : (
                                <FaExclamationTriangle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
                            )}
                            <div className="flex-1">
                                <p className={`font-medium ${uploadStatus.type === 'success' ? 'text-green-800' :
                                    uploadStatus.type === 'error' ? 'text-red-800' :
                                        'text-yellow-800'
                                    }`}>
                                    {uploadStatus.message}
                                </p>
                                {uploadStatus.data && (
                                    <div className="mt-2 grid grid-cols-3 gap-2">
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-gray-900">{uploadStatus.data.inserted || 0}</p>
                                            <p className="text-xs text-gray-600">New Styles</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-gray-900">{uploadStatus.data.updated || 0}</p>
                                            <p className="text-xs text-gray-600">Updated</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-lg font-bold text-gray-900">{records.length}</p>
                                            <p className="text-xs text-gray-600">Total Processed</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
};

export default MyntraUpload;