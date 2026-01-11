// components/auth/Login.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaIdCard, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from './AuthLayout';
import Loader from '../common/Loader';
import Toast from '../common/Toast';

const Login = () => {
    const navigate = useNavigate();
    const { login, error, clearError } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        employee_id: '',
        password: '',
        rememberMe: false,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.employee_id || !formData.password) {
            setToast({
                message: 'Please fill in all fields',
                type: 'error',
            });
            return;
        }

        setLoading(true);
        clearError();

        const result = await login({
            employee_id: parseInt(formData.employee_id),
            password: formData.password,
        });

        setLoading(false);

        if (result.success) {
            setToast({
                message: 'Login successful! Redirecting...',
                type: 'success',
            });
            setTimeout(() => navigate('/dashboard'), 1000);
        } else {
            setToast({
                message: result.error || 'Login failed',
                type: 'error',
            });
        }
    };

    return (
        <>
            <AuthLayout
                title="Sign in to your account"
                subtitle="Don't have an account?"
                type="login"
            >
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Employee ID Field */}
                    <div>
                        <label htmlFor="employee_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Employee ID
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaIdCard className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="employee_id"
                                name="employee_id"
                                type="text"
                                autoComplete="username"
                                value={formData.employee_id}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your employee ID"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <Link
                                to="/forgot-password"
                                className="text-sm text-blue-600 hover:text-blue-500 transition-colors"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaLock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                autoComplete="current-password"
                                value={formData.password}
                                onChange={handleChange}
                                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                {showPassword ? (
                                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                ) : (
                                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me Checkbox */}
                    <div className="flex items-center">
                        <input
                            id="rememberMe"
                            name="rememberMe"
                            type="checkbox"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-700">
                            Remember me
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <>
                                    <Loader size="sm" className="mr-2" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </button>
                    </div>

                    {/* Demo Credentials */}
                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials:</h4>
                        <div className="text-xs text-blue-700 space-y-1">
                            <p>Employee ID: <span className="font-mono">1001</span></p>
                            <p>Password: <span className="font-mono">password123</span></p>
                        </div>
                    </div>
                </form>
            </AuthLayout>

            {/* Toast Notifications */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default Login;