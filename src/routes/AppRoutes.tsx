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
              element={<div>Rentals</div>}
            />

            <Route
              path="notifications"
              element={<div>Notifications</div>}
            />

            <Route
              path="analytics"
              element={<div>Analytics</div>}
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