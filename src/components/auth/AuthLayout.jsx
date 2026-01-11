// components/auth/AuthLayout.jsx
import { Link } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

const AuthLayout = ({ children, title, subtitle, type = 'login' }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center">
                    <div className="bg-white p-3 rounded-full shadow-lg">
                        <FaUserCircle className="h-12 w-12 text-primary-600" />
                    </div>
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    {title}
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    {subtitle}{' '}
                    {type === 'login' ? (
                        <Link
                            to="/register"
                            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                        >
                            Create an account
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                        >
                            Sign in to your account
                        </Link>
                    )}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl rounded-lg sm:px-10 border border-gray-100">
                    {children}
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-gray-500">
                    © {new Date().getFullYear()} Employee Portal. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default AuthLayout;