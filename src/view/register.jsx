import { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export default function WorkhiveSignUp() {
    const navigate = useNavigate();
    // Form states
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(false);

    // Validation states
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [fullNameError, setFullNameError] = useState('');
    const [termsError, setTermsError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [signupStatus, setSignupStatus] = useState({ success: false, message: '' });

    // Mock user database
    const mockUsers = [
        { email: 'navnash@workhive.com', password: 'password123' },
        { email: 'demo@workhive.com', password: 'demo1234' },
        { email: 'test@workhive.com', password: 'test1234' }
    ];

    useEffect(() => {
        // Load the Google Identity script dynamically
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;
        script.onload = () => {
            /* global google */
            if (window.google) {
                window.google.accounts.id.initialize({
                    client_id: "604827577489-tk48n8o38omqvjth3miseod04udcrpvs.apps.googleusercontent.com", // 🔁 Replace with your client ID
                    callback: handleCredentialResponse,
                });
            }
        };
        document.body.appendChild(script);
    }, []);

    const handleCredentialResponse = (response) => {
        const jwt = response.credential;
        console.log("Google JWT Token:", jwt);
        // You can decode it or send it to your backend
    };

    const handleGoogleSignUp = () => {
        if (window.google) {
            window.google.accounts.id.prompt((notification) => {
                if (
                    notification.isNotDisplayed() ||
                    notification.isSkippedMoment()
                ) {
                    console.warn("Google Sign-In not displayed or skipped.");
                }
            });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };


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
            // Check if email already exists
            const emailExists = mockUsers.some(user => 
                user.email.toLowerCase() === email.toLowerCase()
            );
            
            if (emailExists) {
                setEmailError('Email already registered. Please sign in instead.');
                return false;
            }
            
            setEmailError('');
            return true;
        }
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

    // Validate terms agreement
    const validateTerms = (agreed) => {
        if (!agreed) {
            setTermsError('You must agree to the terms and conditions');
            return false;
        } else {
            setTermsError('');
            return true;
        }
    };

    // Mock API call - simulates a backend request
    const mockSignupApi = (userData) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                const emailExists = mockUsers.some(user => 
                    user.email.toLowerCase() === userData.email.toLowerCase()
                );

                if (emailExists) {
                    reject({ success: false, message: 'Email already registered' });
                } else {
                    // In a real app, you would save the user to your database here
                    resolve({ success: true, message: 'Account created successfully!' });
                }
            }, 1000); // 1 second delay to simulate network request
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSignupStatus({ success: false, message: '' });

        // Validate all inputs
        
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
        const isTermsAgreed = validateTerms(agreeTerms);

        if ( isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsAgreed) {
            setIsLoading(true);
            try {
                const userData = {
                
                    email,
                    password
                };
                
                const response = await mockSignupApi(userData);
                navigate("/otpverify", {
                    state: { email: email, type:"SIGNUP" },
                  });
                // setSignupStatus({ success: true, message: response.message });
                
                // Clear form on successful signup
            
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setAgreeTerms(false);
                
                // Redirect would happen here in a real app
                console.log('Signup successful, redirect would happen here');
            } catch (error) {
                setSignupStatus({ success: false, message: error.message });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="w-full max-w-md scale-[0.9]  md:scale-100">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 text-left">Sign Up</h2>
                <p className="text-gray-400 text-left">Create an account to manage your workspace seamlessly.</p>
            </div>

            {/* Status message */}
            {signupStatus.message && (
                <div className={`mb-4 p-3 rounded flex items-center ${signupStatus.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {signupStatus.success ? (
                        <CheckCircle className="mr-2 h-5 w-5" />
                    ) : (
                        <AlertCircle className="mr-2 h-5 w-5" />
                    )}
                    <span>{signupStatus.message}</span>
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

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                        Password
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
                            placeholder="Create a password"
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
                        Confirm Password
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
                            placeholder="Confirm your password"
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

                <div className="flex items-center">
                    <input
                        id="agree-terms"
                        name="agree-terms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={() => {
                            setAgreeTerms(!agreeTerms);
                            if (termsError) validateTerms(!agreeTerms);
                        }}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                    />
                    <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-400">
                        I agree to the <a href="#" className="text-purple-400 hover:text-purple-300">Terms of Service</a> and <a href="#" className="text-purple-400 hover:text-purple-300">Privacy Policy</a>
                    </label>
                </div>
                {termsError && (
                    <p className="mt-1 text-sm text-red-500 flex items-center">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        {termsError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="text-center text-gray-400">
                    <p>or</p>
                </div>

                <button
                    onClick={handleGoogleSignUp}
                    type="button"
                    className="w-full flex items-center justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#4285F4">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign up with Google
                </button>

                <button
                    type="button"
                    className="w-full flex items-center justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 23 23">
                        <path fill="#f3f3f3" d="M21.8,0H1.2C0.5,0,0,0.5,0,1.2v20.7c0,0.6,0.5,1.1,1.2,1.1h20.7c0.6,0,1.1-0.5,1.1-1.1V1.2C23,0.5,22.5,0,21.8,0z" />
                        <path fill="#f35325" d="M10.9,10.9H0V0h10.9V10.9z" />
                        <path fill="#81bc06" d="M23,10.9H12.1V0H23V10.9z" />
                        <path fill="#05a6f0" d="M10.9,23H0V12.1h10.9V23z" />
                        <path fill="#ffba08" d="M23,23H12.1V12.1H23V23z" />
                    </svg>
                    Sign up with Microsoft
                </button>

                <div className="text-center text-sm">
                    <p className="text-gray-400">
                        Already have an account?
                        <a onClick={() => navigate("/")} className="font-medium text-purple-400 hover:text-purple-300 ml-1">
                            Sign In
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}