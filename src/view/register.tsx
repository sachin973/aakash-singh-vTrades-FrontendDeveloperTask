import { useState, useEffect, FormEvent } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Alert from '../common/alert';
import Button from '../common/buttons';
import Input from '../common/input';
import { useFormValidation } from "../hooks/useFormValidation";
import { emailExistsInMockUsers, toggleState } from "../utils/helpers";
import { initializeGoogle, promptGoogleSignIn } from "../utils/googleAuth";
import { GOOGLE_CLIENT_ID } from '../utils/constant';
interface SignupStatus {
  success: boolean;
  message: string;
}

interface MockUser {
  email: string;
  password: string;
}

export default function WorkhiveSignUp() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const [termsError, setTermsError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [signupStatus, setSignupStatus] = useState<SignupStatus>({ success: false, message: '' });

  const { errors, validateEmail, validatePassword, validateConfirmPassword } = useFormValidation();

  const mockUsers: MockUser[] = [
    { email: 'navnash@workhive.com', password: 'password123' },
    { email: 'demo@workhive.com', password: 'demo1234' },
    { email: 'test@workhive.com', password: 'test1234' }
  ];

  useEffect(() => {
    initializeGoogle(GOOGLE_CLIENT_ID, (response) => {
      const jwt = response.credential;
      console.log("Google JWT:", jwt);
      setSignupStatus({ success: true, message: 'Google Sign-In successful!' });
    });
  }, []);

  const validateTerms = (agreed: boolean): boolean => {
    if (!agreed) {
      setTermsError('You must agree to the terms and conditions');
      return false;
    } else {
      setTermsError('');
      return true;
    }
  };

  const mockSignupApi = (userData: { email: string; password: string; }): Promise<SignupStatus> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emailExists = mockUsers.some(user =>
          user.email.toLowerCase() === userData.email.toLowerCase()
        );
        if (emailExists) {
          reject({ success: false, message: 'Email already registered' });
        } else {
          resolve({ success: true, message: 'Account created successfully!' });
        }
      }, 1000);
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSignupStatus({ success: false, message: '' });

    const isEmailValid = validateEmail(email, (val) => emailExistsInMockUsers(val, mockUsers));
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);
    const isTermsAgreed = validateTerms(agreeTerms);

    if (isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsAgreed) {
      setIsLoading(true);
      try {
        const userData = { email, password };
        await mockSignupApi(userData);
        navigate("/otpverify", { state: { email: email, type: "SIGNUP" } });

        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setAgreeTerms(false);
        console.log('Signup successful, redirect would happen here');
      } catch (error: any) {
        setSignupStatus({ success: false, message: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md scale-[0.9] md:scale-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2 text-left">Sign Up</h2>
        <p className="text-gray-400 text-left">Create an account to manage your workspace seamlessly.</p>
      </div>

      <Alert message={signupStatus.message} success={signupStatus.success} />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input id="email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateEmail(email, (val) => emailExistsInMockUsers(val, mockUsers))}
          placeholder="Enter email" error={errors.email}
        />

        <Input id="password" type={showPassword ? "text" : "password"} value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validatePassword(password)}
          placeholder="Enter password" error={errors.password}
          children={
            <button
              type="button"
              onClick={() => toggleState(setShowPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>}
        />

        <Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => validateConfirmPassword(confirmPassword, password)}
          placeholder="Confirm password" error={errors.confirmPassword}
          children={
            <button
              type="button"
              onClick={() => toggleState(setShowConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>}
        />

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

        <Button type="submit" loading={isLoading}>Create Account</Button>

        <div className="text-center text-gray-400">
          <p>or</p>
        </div>

        <button
          onClick={promptGoogleSignIn}
          type="button"
          className="w-full flex items-center justify-center py-2 px-4 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          {/* Google Icon */}
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
          {/* Microsoft Icon */}
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