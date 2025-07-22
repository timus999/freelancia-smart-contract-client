
import SignupForm from "@/components/auth/Signup.tsx";
import NavMin from "@/components/layout/NavMin.tsx";

export default function Signup() {
  return (
    <>
    <NavMin />
    <div className="flex justify-center">
      <SignupForm/>
      {/* <LoginWithWallet /> */}
    </div>
    </>
  );
}