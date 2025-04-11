import { useState, useEffect, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function OtpVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email,type } = location.state || {};
  // State for the 6-digit OTP code
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const inputRefs = useRef([]);

  // Email from props or context (mocked here)
  const emailAddress = email;

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Focus the first input on component mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  // Handle input change
  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);

    // Auto-focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key press
  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    
    // Move to next input on right arrow
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
    
    // Move to previous input on left arrow
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event (to paste the entire OTP)
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted content is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtpValues(digits);
      
      // Focus on the last input
      inputRefs.current[5].focus();
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (timeLeft > 0) return;
    
    setIsResending(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset timer and clear inputs
      setTimeLeft(30);
      setOtpValues(['', '', '', '', '', '']);
      inputRefs.current[0].focus();
      
      // Show success message or toast here
    } catch (error) {
      // Show error message
      console.error('Failed to resend OTP:', error);
    } finally {
      setIsResending(false);
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    // Check if all digits are filled
    if (otpValues.some(val => val === '')) {
      setVerificationStatus({ success: false, message: 'Please enter all digits' });
      return;
    }
    
    setIsVerifying(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo: verify if OTP is "123456"
      const enteredOtp = otpValues.join('');
      
      if (enteredOtp === '123456') {
        setVerificationStatus({ success: true, message: 'OTP verified successfully' });
        if(type === "FORGOT"){
          // Navigate to reset password page
          navigate("/create-new-password", {
            state: { email: emailAddress, type:"RESET" },
        });
        }
        else{
          setTimeout(() => {
            navigate("/");
        }, 2000);
        }
        // In a real application, you would redirect to the next page here
        // window.location.href = '/dashboard';
      } else {
        setVerificationStatus({ success: false, message: 'Invalid OTP. Please try again.' });
      }
    } catch (error) {
      setVerificationStatus({ success: false, message: 'Verification failed. Please try again.' });
    } finally {
      setIsVerifying(false);
    }
  };

  // Change email address handler
  const handleChangeEmail = () => {
    // This would typically navigate back to email input screen
    console.log('Change email address requested');
    // window.location.href = '/enter-email';
  };

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
    <div className="w-full max-w-md">
    
        <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 text-left">Enter OTP</h2>
                <p className="text-gray-400 text-left">Enter the OTP that we have sent to your email address {emailAddress}.</p>
            </div>
        <button 
          onClick={handleChangeEmail}
          className="text-purple-500 hover:text-purple-400 text-sm mb-6 block mx-auto"
        >
          Change Email Address
        </button>

        {/* OTP Input Fields */}
        <div className="flex justify-between gap-2 mb-6">
          {otpValues.map((value, index) => (
            <input
              key={index}
              type="text"
              ref={(el) => (inputRefs.current[index] = el)}
              value={value}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              maxLength={1}
              className="w-12 h-12 text-center bg-gray-800 text-white text-xl font-semibold rounded-[10px] border border-gray-700 focus:outline-none focus:border-purple-500"
            />
          ))}
        </div>

        {/* Timer */}
        <div className="flex items-center justify-center mb-6">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-gray-400">
            {timeLeft > 0 ? (
              `${timeLeft} Sec`
            ) : (
              <button 
                onClick={resendOtp} 
                disabled={isResending}
                className="text-purple-500 hover:text-purple-400"
              >
                {isResending ? 'Resending...' : 'Resend OTP'}
              </button>
            )}
          </span>
        </div>

        {/* Verification Status */}
        {verificationStatus && (
          <div className={`mb-4 text-sm text-center ${verificationStatus.success ? 'text-green-400' : 'text-red-400'}`}>
            {verificationStatus.message}
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={verifyOtp}
          disabled={isVerifying || otpValues.some(val => val === '')}
          className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-800 disabled:opacity-70 text-white font-medium rounded-md transition-colors"
        >
          {isVerifying ? 'Verifying...' : 'Continue'}
        </button>
      </div>
    // </div>
  );
}