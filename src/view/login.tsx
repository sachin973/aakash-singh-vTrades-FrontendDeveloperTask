import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Alert from '../common/alert';
import Button from '../common/buttons';
import Input from "../common/input";
import { useFormValidation } from "../hooks/useFormValidation";
import { toggleState } from "../utils/helpers";
import { initializeGoogle, promptGoogleSignIn } from "../utils/googleAuth";
import { GOOGLE_CLIENT_ID } from '../utils/constant';
interface LoginStatus {
    success: boolean;
    message: string;
}

interface User {
    email: string;
    password: string;
}

export default function WorkhiveSignIn() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('navnash@workhive.com');
    const [password, setPassword] = useState<string>('');
    const [rememberMe, setRememberMe] = useState<boolean>(false);

    const [emailError, setEmailError] = useState<string>('');
    const [passwordError, setPasswordError] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loginStatus, setLoginStatus] = useState<LoginStatus>({ success: false, message: '' });

    const { errors, validateEmail, validatePassword } = useFormValidation();

    const mockUsers: User[] = [
        { email: 'navnash@workhive.com', password: 'Password@123' },
        { email: 'demo@workhive.com', password: 'Demo@1234' },
        { email: 'test@workhive.com', password: 'Test@1234' }
    ];

    useEffect(() => {
        initializeGoogle(GOOGLE_CLIENT_ID, (response: any) => {
            const jwt = response.credential;
            console.log("Google JWT:", jwt);
            setLoginStatus({ success: true, message: 'Google Sign-In successful!' });
        });
    }, []);

    const mockLoginApi = (email: string, password: string): Promise<LoginStatus> => {
        return new Promise((resolve, reject) => {
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
            }, 1000);
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoginStatus({ success: false, message: '' });

        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        if (isEmailValid && isPasswordValid) {
            setIsLoading(true);
            try {
                const response = await mockLoginApi(email, password);
                setLoginStatus({ success: true, message: response.message });
                if (rememberMe) {
                    localStorage.setItem('workhiveUser', JSON.stringify({ email }));
                }
                console.log('Login successful, redirect would happen here');
            } catch (error: any) {
                setLoginStatus({ success: false, message: error.message });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <>

            <Alert message={loginStatus.message} success={loginStatus.success} />

            <form className="space-y-6" onSubmit={handleSubmit}>
                <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    onBlur={() => validateEmail(email)}
                    placeholder="Enter email"
                    error={errors.email}
                />
                <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    onBlur={() => validatePassword(password)}
                    placeholder="Enter password"
                    error={errors.password}
                    children={
                        <button
                            type="button"
                            onClick={() => toggleState(setShowPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                />

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
                        <a onClick={() => navigate("/forgot-password")} className="font-medium text-purple-400 hover:text-purple-300 cursor-pointer">
                            Forgot Password?
                        </a>
                    </div>
                </div>

                <Button type="submit" loading={isLoading}>Sign In</Button>

                <div className="text-center text-gray-400">
                    <p>or</p>
                </div>

                <button
                    onClick={promptGoogleSignIn}
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
                        <a onClick={() => navigate("/signup")} className="font-medium text-purple-400 hover:text-purple-300 ml-1 cursor-pointer">
                            Sign Up
                        </a>
                    </p>
                </div>
            </form>
        </>
    );
}
