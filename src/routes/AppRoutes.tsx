import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import LoginPage from "../pages/Login/LoginPage";
import DashboardPage from "../pages/Dashboard/DashboardPage";
import UsersPage from "../pages/Users/UsersPage";
import UserDetailsPage from "../pages/Users/UserDetailsPage";

import ProtectedRoute from "./ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import BooksPage from "../pages/Books/BooksPage";
import BookDetailsPage from "../pages/Books/BookDetailsPage";
import RentalsPage from "../pages/Rentals/RentalsPage";
import RentalDetailsPage from "../pages/Rentals/RentalDetailsPage";
import NotificationsPage from "../pages/Notifications/NotificationsPage";
import NotificationsDetailsPage from "../pages/Notifications/NotificationDetailsPage";
import AnalyticsPage from "../pages/Analytics/AnalyticsPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Admin Login */}
        <Route
          path="/admin/login"
          element={<LoginPage />}
        />

        {/* Protected Admin Application */}
        <Route element={<ProtectedRoute />}>

          <Route
            path="/admin"
            element={<AdminLayout />}
          >

            {/* /admin */}
            <Route
              index
              element={
                <Navigate
                  to="/admin/dashboard"
                  replace
                />
              }
            />

            {/* Dashboard */}
            <Route
              path="dashboard"
              element={<DashboardPage />}
            />

            {/* Users */}
            <Route
              path="users"
              element={<UsersPage />}
            />

            {/* User Details */}
            <Route
              path="users/:uid"
              element={<UserDetailsPage />}
            />

            {/* Other modules */}
            <Route
              path="books"
              element={<BooksPage />}
            />

            <Route
              path="books/:bookId"
              element={<BookDetailsPage />}
            />
    
            <Route
              path="rentals"
              element={<RentalsPage />}
            />

            <Route
              path="rentals/:rentalId"
              element={<RentalDetailsPage />}
            />

            <Route
              path="notifications"
              element={< NotificationsPage/>}
            />

            <Route
              path="notifications/:notificationId"
              element={<NotificationsDetailsPage />}
            />

            <Route
              path="analytics"
              element={<AnalyticsPage />}
            />

            <Route
              path="admins"
              element={<div>Admins</div>}
            />

            <Route
              path="audit-logs"
              element={<div>Audit Logs</div>}
            />

            <Route
              path="settings"
              element={<div>Settings</div>}
            />

          </Route>
        </Route>

        {/* Fallback */}
        <Route
          path="*"
          element={
            <Navigate
              to="/admin/login"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}