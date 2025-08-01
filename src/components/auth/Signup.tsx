import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Wallet, User, UserCheck, Mail, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import { Checkbox } from '@/components/ui/checkbox.tsx';
import { toast } from 'react-toastify';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWalletAuth } from "@/api/walletAuth.ts"
import { signup } from '@/api/auth.ts';
import { useAuth } from '@/context/AuthContext.tsx';
import { motion } from 'framer-motion';

const SignupForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { handleWalletAuth } = useWalletAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState<'freelancer' | 'client'>('freelancer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (formData.password.length < 6) {
      toast("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast("Passwords do not match");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match. Please try again.")
      return;
    }

    if (!formData.agreeToTerms) {

      toast.error("Please agree to the terms and conditions.")
      return;
    }

    try {

      const response = await signup({
        email: formData.email,
        password: formData.password,
        role: userType,
      });


      navigate('/create-profile');
      toast.success(
        "Registration successful! Please complete your profile.");

      // Navigate to profile creation based on user type
      // if (formData.userType === "freelancer") {
      //   navigate("/create-freelancer-profile");
      // } else {
      //   navigate("/create-client-profile");
      // }
      toast.success(`Welcome to Freelancia, ${userType}!`)
      login(response.token, response.role, false, response.verified_wallet);
      localStorage.setItem('user_id', response.user_id);

    } catch (error) {
      toast.error("Registration failed. Please try again.");
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="min-h-screen bg-background flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-md animate-fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">Create Your Freelancia Account</h1>
            <p className="text-text-secondary">Join the Web3 freelancing revolution</p>
          </div>

          <Card className="bg-surface border-border">
            <CardContent className="p-10">
              {/* User Type Selection */}
              <div className="mb-6">

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant={userType === 'freelancer' ? 'default' : 'outline'}
                    className={`h-12 ${userType === 'freelancer'
                        ? 'bg-primary text-secondary'
                        : 'border-border hover:border-primary'
                      }`}
                    onClick={() => setUserType('freelancer')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Work as Freelancer
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'client' ? 'default' : 'outline'}
                    className={`h-12 ${userType === 'client'
                        ? 'bg-primary text-secondary'
                        : 'border-border hover:border-primary'
                      }`}
                    onClick={() => setUserType('client')}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Hire Freelancers
                  </Button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10 bg-background border-border text-text-primary"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-10 pr-10 bg-background border-border text-text-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-3 h-4 w-4 text-text-secondary" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 pr-10 bg-background border-border text-text-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-text-secondary hover:text-text-primary"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreeToTerms: checked as boolean })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm text-text-secondary leading-relaxed">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary hover:text-primary/80">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-primary hover:text-primary/80">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-secondary h-12 animate-glow"
                >
                  Create Account
                </Button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center">
                <div className="flex-1 border-t border-border"></div>
                <span className="px-4 text-sm text-text-secondary">or continue with</span>
                <div className="flex-1 border-t border-border"></div>
              </div>

              {/* Wallet Connection */}
              <div className="w-full max-w-sm mx-auto mb-4">
                <WalletMultiButton style={{ width: "100%", justifyContent: "center", height: "48px", borderRadius: "8px" }} />
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full border-border hover:border-accent hover:bg-accent/10 h-12"
                onClick={() => handleWalletAuth(userType, "signup")}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Sign up with Wallet
              </Button>

              {/* Sign In Link */}
              <p className="text-center text-sm text-text-secondary mt-6">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:text-primary/80 font-medium underline">
                  Log in
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default SignupForm;
