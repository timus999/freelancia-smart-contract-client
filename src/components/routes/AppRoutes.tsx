import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../../pages/Login.tsx";
import SmartContract from "../../pages/SmartContract.tsx";
import Home from "../layout/Home.tsx";

import Signup from "@/pages/Signup.tsx";
import { ToastContainer } from "react-toastify";
import PrivateRoute from "./PrivateRoute.tsx";
import PublicRoute from "./PublicRoute.tsx";
import ProfilePage from "@/pages/Profile.tsx";
import Dashboard from "@/pages/Dashboard.tsx";
import BaseLayout from "../layout/Base.tsx";
import ConnectWallet from "@/pages/Wallet.tsx";
import { JobDetail } from "../freelancer/JobDetail.tsx";
import NotificationsPage from "@/pages/Notifications.tsx";
import CreateProfilePage from "@/pages/CreateProfile.tsx";
import UserProfile from "@/pages/UserProfile.tsx";
import Messages from "@/pages/Message.tsx";
import WorkSpace from "@/pages/Workspace.tsx";
import JobApplicantsPage from "@/pages/JobApplicants.tsx";
import JobSubmission from "@/pages/JobSubmission.tsx";
import ApproveWork from "@/pages/ApproveWork.tsx";
import EscrowDetailPage from "@/pages/EscrowDetail.tsx";
import NotFound from "@/pages/NotFound.tsx";
import ArbiterResolvePage from "@/pages/ArbiterResolve.tsx";

function AppRoutes() {
  return (
    <>
      <Router>
        <Routes>
          {/* Login and Signup WITHOUT layout */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Routes WITH Navbar + Footer */}
          <Route
            path="/"
            element={
              <PublicRoute>
              <BaseLayout>
                <Home />
              </BaseLayout>
              </PublicRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
              <BaseLayout>
                <Dashboard />
              </BaseLayout>
              </PrivateRoute>
            }
          />
               <Route
            path="/messages"
            element={
              <PrivateRoute>
              <BaseLayout>
                <Messages />
              </BaseLayout>
              </PrivateRoute>
            }
          />
               <Route
            path="/workspace"
            element={
              <PrivateRoute>
              <BaseLayout>
                <WorkSpace />
              </BaseLayout>
              </PrivateRoute>
            }
          />
                      <Route
            path="/my-workspace/:applicationId"
            element={
              <PrivateRoute>
              <BaseLayout>
                <JobSubmission />
              </BaseLayout>
              </PrivateRoute>
            }
          />
                        <Route
            path="/my-jobs/:job_id"
            element={
              <PrivateRoute>
              <BaseLayout>
                <ApproveWork />
              </BaseLayout>
              </PrivateRoute>
            }
          />
                          <Route
            path="/escrow/:escrow_pda"
            element={
              <PrivateRoute>
              <BaseLayout>
                <EscrowDetailPage />
              </BaseLayout>
              </PrivateRoute>
            }
          />
                  <Route
            path="/create-profile"
            element={
              <PrivateRoute>
                <BaseLayout>
                  <CreateProfilePage />
                </BaseLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <BaseLayout>
                  <ProfilePage />
                </BaseLayout>
              </PrivateRoute>
            }
          />
            <Route
            path="/profile/:username"
            element={
              <PrivateRoute>
                <BaseLayout>
                  <UserProfile />
                </BaseLayout>
              </PrivateRoute>
            }
          />
           <Route
            path="/notifications"
            element={
              <PrivateRoute>
                <BaseLayout>
                  <NotificationsPage />
                </BaseLayout>
              </PrivateRoute>
            }
          />
              <Route
            path="/jobs/:id"
            element={
              <PrivateRoute>
                <BaseLayout>
                  <JobDetail />
                </BaseLayout>
              </PrivateRoute>
            }
          />
            <Route
            path="/jobs/:jobId/applicants"
            element={
              <PrivateRoute>
                <BaseLayout>
                  <JobApplicantsPage />
                </BaseLayout>
              </PrivateRoute>
            }
          />
              <Route
            path="/wallet"
            element={
              <PrivateRoute>
              <BaseLayout>
                <ConnectWallet />
              </BaseLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/escrow"
            element={
              <PrivateRoute>
                <BaseLayout>
                  <SmartContract />
                </BaseLayout>
              </PrivateRoute>
            }
          />
               <Route
            path="/resolve"
            element={
              <PrivateRoute>
              <BaseLayout>
                <ArbiterResolvePage />
              </BaseLayout>
              </PrivateRoute>
            }
          />
          <Route 
            path="*"
            element={<NotFound/>}
            />
        </Routes>
      </Router>
      <ToastContainer />
    </>
  );
}

export default AppRoutes;
