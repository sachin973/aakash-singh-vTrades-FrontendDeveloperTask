import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function CreateNewPassword() {
    const navigate = useNavigate();
    
    // Password states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Validation states
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ success: false, message: '' });

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    // Validate password
    const validatePassword = (password) => {
        if (!password) {
            setPasswordError('Password is required');
            return false;
        } else if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return false;
        } else if (!/(?=.*[A-Z])/.test(password)) {
            setPasswordError('Password must include at least one uppercase letter');
            return false;
        } else if (!/(?=.*[0-9])/.test(password)) {
            setPasswordError('Password must include at least one number');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    // Validate confirm password
    const validateConfirmPassword = (confirmPwd) => {
        if (!confirmPwd) {
            setConfirmPasswordError('Please confirm your password');
            return false;
        } else if (confirmPwd !== password) {
            setConfirmPasswordError('Passwords do not match');
            return false;
        } else {
            setConfirmPasswordError('');
            return true;
        }
    };

    // Mock API call - simulates a backend request
    const mockUpdatePasswordApi = (newPassword) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                // In a real app, you would update the user's password in your database here
                resolve({ success: true, message: 'Password updated successfully!' });
            }, 1000); // 1 second delay to simulate network request
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ success: false, message: '' });

        // Validate all inputs
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);

        if (isPasswordValid && isConfirmPasswordValid) {
            setIsLoading(true);
            try {
                const response = await mockUpdatePasswordApi(password);
                setStatus({ success: true, message: response.message });
                
                // Clear form on successful password update
                setPassword('');
                setConfirmPassword('');
                
                // Redirect to login page after successful password update
                setTimeout(() => {
                    navigate("/");
                }, 2000);
                
                console.log('Password updated successfully');
            } catch (error) {
                setStatus({ success: false, message: error.message || 'Failed to update password' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 text-left">Create New Password</h2>
                <p className="text-gray-400 text-left">Choose a strong and secure password to keep your account safe. Make sure it's easy for you to remember, but hard for others to guess!</p>
            </div>

            {/* Status message */}
            {status.message && (
                <div className={`mb-4 p-3 rounded flex items-center ${status.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {status.success ? (
                        <CheckCircle className="mr-2 h-5 w-5" />
                    ) : (
                        <AlertCircle className="mr-2 h-5 w-5" />
                    )}
                    <span>{status.message}</span>
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                if (passwordError) validatePassword(e.target.value);
                                if (confirmPassword) validateConfirmPassword(confirmPassword);
                            }}
                            onBlur={(e) => validatePassword(e.target.value)}
                            className={`w-full px-4 py-2 rounded-[10px] bg-gray-800 border ${passwordError ? 'border-red-500' : 'border-gray-700'} text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="Enter your new password"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {passwordError && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {passwordError}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                        Confirm New Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(e.target.value);
                                if (confirmPasswordError) validateConfirmPassword(e.target.value);
                            }}
                            onBlur={(e) => validateConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-2 rounded-[10px] bg-gray-800 border ${confirmPasswordError ? 'border-red-500' : 'border-gray-700'} text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="Confirm your new password"
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {confirmPasswordError && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {confirmPasswordError}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Updating Password...' : 'Update Password'}
                </button>
            </form>
        </div>
    );
}