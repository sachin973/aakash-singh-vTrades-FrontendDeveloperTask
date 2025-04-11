import { useState, useEffect } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
export default function WorkhiveSignIn() {
    const navigate = useNavigate();
    // Form states
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('navnash@workhive.com');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    // Validation states
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [loginStatus, setLoginStatus] = useState({ success: false, message: '' });

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
    const handleGoogleSignIn = () => {
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
            setEmailError('');
            return true;
        }
    };

    // Validate password
    const validatePassword = (password) => {
        if (!password) {
            setPasswordError('Password is required');
            return false;
        } else if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    // Mock API call - simulates a backend request
    const mockLoginApi = (email, password) => {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                const user = mockUsers.find(user =>
                    user.email.toLowerCase() === email.toLowerCase() &&
                    user.password === password
                );

                if (user) {
                    resolve({ success: true, message: 'Login successful!' });
                } else {
                    reject({ success: false, message: 'Invalid email or password' });
                }
            }, 1000); // 1 second delay to simulate network request
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoginStatus({ success: false, message: '' });

        // Validate inputs
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (isEmailValid && isPasswordValid) {
            setIsLoading(true);
            try {
                const response = await mockLoginApi(email, password);
                setLoginStatus({ success: true, message: response.message });
                // Here you would typically save auth token to localStorage/sessionStorage
                if (rememberMe) {
                    localStorage.setItem('workhiveUser', JSON.stringify({ email }));
                }
                // Redirect would happen here in a real app
                console.log('Login successful, redirect would happen here');
            } catch (error) {
                setLoginStatus({ success: false, message: error.message });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (


        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 text-left">Sign In</h2>
                <p className="text-gray-400 text-left">Manage your workspace seamlessly. Sign in to continue.</p>
            </div>

            {/* Status message */}
            {loginStatus.message && (
                <div className={`mb-4 p-3 rounded flex items-center ${loginStatus.success ? 'bg-green-900/50 text-green-300' : 'bg-red-900/50 text-red-300'}`}>
                    {loginStatus.success ? (
                        <CheckCircle className="mr-2 h-5 w-5" />
                    ) : (
                        <AlertCircle className="mr-2 h-5 w-5" />
                    )}
                    <span>{loginStatus.message}</span>
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
                            }}
                            onBlur={(e) => validatePassword(e.target.value)}
                            className={`w-full px-4 py-2 rounded-[10px] bg-gray-800 border ${passwordError ? 'border-red-500' : 'border-gray-700'} text-white focus:outline-none focus:ring-2 focus:ring-purple-500`}
                            placeholder="Enter your password"
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

                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded bg-gray-800"
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                            Remember me
                        </label>
                    </div>
                    <div className="text-sm">
                        <a onClick={() => navigate("/forgot-password")} className="font-medium text-purple-400 hover:text-purple-300">
                            Forgot Password?
                        </a>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="text-center text-gray-400">
                    <p>or</p>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    type="button"
                    className="w-full flex items-center justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="#4285F4">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Sign in with Google
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
                    Sign in with Microsoft
                </button>

                <div className="text-center text-sm">
                    <p className="text-gray-400">
                        Don't have an account?
                        <a onClick={() => navigate("/signup")}  className="font-medium text-purple-400 hover:text-purple-300 ml-1">
                            Sign Up
                        </a>
                    </p>
                </div>
            </form>
        </div>
    );
}