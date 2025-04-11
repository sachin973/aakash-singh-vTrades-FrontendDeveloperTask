import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function WorkhiveForgotPassword() {
    const navigate = useNavigate();
    
    // Form states
    const [email, setEmail] = useState('');
    
    // Validation states
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resetStatus, setResetStatus] = useState({ success: false, message: '' });

    // Mock user database
    const mockUsers = [
        { email: 'navnash@workhive.com', password: 'password123' },
        { email: 'demo@workhive.com', password: 'demo1234' },
        { email: 'test@workhive.com', password: 'test1234' }
    ];

    // Validate email format
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email is required');
            return false;
        } else if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email address');
            return false;
        } else {
            // Check if email exists in database
            const emailExists = mockUsers.some(user => 
                user.email.toLowerCase() === email.toLowerCase()
            );
            
            if (!emailExists) {
                setEmailError('Email not found. Please check your email address.');
                return false;
            }
            
            setEmailError('');
            return true;
        }
    };

    // Mock API call - simulates a backend request for password reset
    const mockResetPasswordApi = (userEmail) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                const emailExists = mockUsers.some(user => 
                    user.email.toLowerCase() === userEmail.toLowerCase()
                );

                if (!emailExists) {
                    reject({ success: false, message: 'Email not registered' });
                } else {
                    // In a real app, you would send a reset password email/OTP here
                    resolve({ success: true, message: 'Reset instructions sent to your email!' });
                }
            }, 1000); // 1 second delay to simulate network request
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setResetStatus({ success: false, message: '' });

        // Validate email
        const isEmailValid = validateEmail(email);

        if (isEmailValid) {
            setIsLoading(true);
            try {
                await mockResetPasswordApi(email);
                // Navigate to OTP verification page with email
                navigate("/otpverify", {
                    state: { email: email, type:"FORGOT" },
                });
                
            } catch (error) {
                setResetStatus({ success: false, message: error.message });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 text-left">Forgot Your Password?</h2>
                <p className="text-gray-400 text-left">Enter your email address to receive a verification code.</p>
            </div>

            {/* Status message */}
            {resetStatus.message && (
                <div className={`mb-4 p-3 rounded flex items-center ${resetStatus.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {resetStatus.success ? (
                        <CheckCircle className="mr-2 h-5 w-5" />
                    ) : (
                        <AlertCircle className="mr-2 h-5 w-5" />
                    )}
                    <span>{resetStatus.message}</span>
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) validateEmail(e.target.value);
                        }}
                        onBlur={(e) => validateEmail(e.target.value)}
                        className={`w-full px-4 py-2 rounded-[10px] bg-gray-800 border ${emailError ? 'border-red-500' : 'border-gray-700'} text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                        placeholder="Enter your email address"
                    />
                    {emailError && (
                        <p className="mt-1 text-sm text-red-500 flex items-center">
                            <AlertCircle className="mr-1 h-4 w-4" />
                            {emailError}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Sending...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
}