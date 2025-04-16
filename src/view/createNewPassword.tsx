import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Input from '../common/input';
import Button from '../common/buttons';
import Alert from '../common/alert';
import { useFormValidation } from "../hooks/useFormValidation";
import { toggleState } from "../utils/helpers";

interface Status {
  success: boolean;
  message: string;
}

export default function CreateNewPassword() {
  const navigate = useNavigate();

  // Password states
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  // Validation states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>({ success: false, message: '' });
  const { errors, validatePassword, validateConfirmPassword } = useFormValidation();

  // Mock API call - simulates a backend request
  const mockUpdatePasswordApi = (newPassword: string) => {
    return new Promise<{ success: boolean, message: string }>((resolve, reject) => {
      setTimeout(() => {
        // Simulate network delay
        resolve({ success: true, message: 'Password updated successfully!' });
      }, 1000); // 1 second delay to simulate network request
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ success: false, message: '' });

    // Validate all inputs
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword, password);

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
      } catch (error: any) {
        setStatus({ success: false, message: error.message || 'Failed to update password' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (

    <>
      {/* Status message */}
      <Alert message={status.message} success={status.success} />

      <form className="space-y-6" onSubmit={handleSubmit}>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onBlur={() => validatePassword(password)}
          placeholder="New password"
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

        <Input
          id="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => validateConfirmPassword(confirmPassword, password)}
          placeholder="Confirm new password"
          error={errors.confirmPassword}
          children={
            <button
              type="button"
              onClick={() => toggleState(setShowConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        <Button type="submit" loading={isLoading}>Update Password</Button>
      </form>
    </>

  );
}
