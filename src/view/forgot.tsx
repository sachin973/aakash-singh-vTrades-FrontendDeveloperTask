import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Input from '../common/input';
import Button from '../common/buttons';
import Alert from '../common/alert';
import { useFormValidation } from "../hooks/useFormValidation";
import { emailExistsInMockUsers } from "../utils/helpers";

interface MockUser {
  email: string;
  password: string;
}

interface ResetStatus {
  success: boolean;
  message: string;
}

export default function WorkhiveForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [resetStatus, setResetStatus] = useState<ResetStatus>({ success: false, message: '' });

  const { errors, validateEmail } = useFormValidation();

  const mockUsers: MockUser[] = [
    { email: 'navnash@workhive.com', password: 'password123' },
    { email: 'demo@workhive.com', password: 'demo1234' },
    { email: 'test@workhive.com', password: 'test1234' }
  ];

  const mockResetPasswordApi = (userEmail: string): Promise<ResetStatus> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const emailExists = mockUsers.some(user =>
          user.email.toLowerCase() === userEmail.toLowerCase()
        );

        if (!emailExists) {
          reject({ success: false, message: 'Email not registered' });
        } else {
          resolve({ success: true, message: 'Reset instructions sent to your email!' });
        }
      }, 1000);
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetStatus({ success: false, message: '' });

    const isEmailValid = validateEmail(email, (val: string) => !emailExistsInMockUsers(val, mockUsers));

    if (isEmailValid) {
      setIsLoading(true);
      try {
        await mockResetPasswordApi(email);
        navigate("/otpverify", {
          state: { email: email, type: "FORGOT" },
        });
      } catch (error: any) {
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

      <Alert message={resetStatus.message} success={resetStatus.success} />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateEmail(email, (val: string) => !emailExistsInMockUsers(val, mockUsers))}
          placeholder="Enter your email"
          error={errors.email}
        />

        <Button type="submit" loading={isLoading}>Reset Password</Button>
      </form>
    </div>
  );
}
