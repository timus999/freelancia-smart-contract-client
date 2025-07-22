import { Button } from "@/components/ui/button.tsx"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import { Input } from "@/components/ui/input.tsx"
import { Label } from "@/components/ui/label.tsx"
import LoginWithWallet from "./LoginWithWallet.tsx"
import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { login } from "@/api/auth.ts";
import { useAuth } from "@/context/AuthContext.tsx"
import { motion } from "framer-motion"
export default function LoginForm() {


    const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
    const { login: authLogin, walletConnect } = useAuth();

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e : any) => {
    e.preventDefault();

    // Validation
    if (!formData.email || !formData.email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    if (!formData.password) {
      toast.error("Please enter a password");
      return;
    }

    try {
      const response = await login({
        email: formData.email,
        password: formData.password,
      });
      authLogin(response.token, response.role, response.wallet_user, response.verified_wallet);
      if ( response.wallet_user) walletConnect(response.role);
      localStorage.setItem("user_id", response.user_id);
      toast.success("Login successful!");
    } catch (error: any) {
      const message = error.response?.data?.error || "Login failed";
      toast.error(message);
    } 
  };
  return (
        <motion.div
      className="w-full max-w-sm"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Login to Freelancia</CardTitle>
       
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}> 
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password"
               type="password"
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required  />
              <a
                href="#"
                className="m-auto text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-4 pt-4 border-t mt-4">
        <p className="text-sm text-muted-foreground text-center">
          Or continue with wallet
        </p>
        <LoginWithWallet />
      </CardFooter>

       <div className="text-center text-sm mt-8">
        <p className="text-sm text-muted-foreground text-center">
            Don't have an Freelancia account?
         </p>
          <div className="mt-4">
            <Link to="/signup">
          <Button>Sign up</Button>
          </Link>
          </div>
        </div>
    </Card>
    </motion.div>
  )
}
