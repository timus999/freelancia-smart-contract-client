// import LoginWithWallet from "../components/auth/LoginWithWallet.tsx";
import LoginForm from "@/components/auth/Login.tsx";
import NavMin from "@/components/layout/NavMin.tsx";
export default function Login() {

  return (
    <>
    <NavMin/>
    <div className="flex justify-center mt-12">
      <LoginForm/>
      {/* <LoginWithWallet /> */}
    </div>
    </>
  );
}
