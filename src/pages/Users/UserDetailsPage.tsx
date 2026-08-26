import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Mail,
  User as UserIcon,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import {
  getUserById,
  getUserBooks,
  getUserRentals,
  type User,
  type UserBook,
  type UserRental,
} from "../../services/userService";

import StatusBadge from "../../components/common/StatusBadge";

function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function UserDetailsPage() {
  const { uid } = useParams();
  const navigate = useNavigate();

  const [user, setUser] =
    useState<User | null>(null);

  const [books, setBooks] =
    useState<UserBook[]>([]);

  const [rentals, setRentals] =
    useState<UserRental[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadUser() {
    if (!uid) {
      setError("Invalid user ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [
        userData,
        userBooks,
        userRentals,
      ] = await Promise.all([
        getUserById(uid),
        getUserBooks(uid),
        getUserRentals(uid),
      ]);

      if (!userData) {
        setError("User not found.");
        return;
      }

      setUser(userData);
      setBooks(userBooks);
      setRentals(userRentals);
    } catch (error) {
      console.error(
        "Failed to load user:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load user."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, [uid]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading user...
        </p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <button
          onClick={() =>
            navigate("/admin/users")
          }
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Users
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            {error || "User not found."}
          </p>
        </div>
      </div>
    );
  }

  const activeRentals =
    rentals.filter(
      (rental) =>
        rental.status === "active" ||
        rental.status === "rented"
    ).length;

  const returnedRentals =
    rentals.filter(
      (rental) =>
        rental.status === "returned"
    ).length;

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* Back */}
      <button
        onClick={() =>
          navigate("/admin/users")
        }
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={17} />
        Back to Users
      </button>

      {/* Profile */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl font-bold text-slate-600">
              {user.name
                .charAt(0)
                .toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-900">
              {user.name}
            </h1>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <Mail size={16} />
                {user.email}
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays size={16} />
                Joined {formatDate(user.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Books Listed
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {books.length}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Active Rentals
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {activeRentals}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Completed Rentals
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {returnedRentals}
          </p>
        </div>

      </div>

      {/* Account Information */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="font-semibold text-slate-900">
          Account Information
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              User ID
            </p>

            <p className="mt-1 break-all font-mono text-sm text-slate-700">
              {user.id}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Email
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Name
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Registered
            </p>

            <p className="mt-1 text-sm text-slate-700">
              {formatDate(user.createdAt)}
            </p>
          </div>

        </div>
      </div>

      {/* Listed Books */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2">
            <BookOpen
              size={18}
              className="text-slate-500"
            />

            <h2 className="font-semibold text-slate-900">
              Listed Books
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">
                  Book
                </th>

                <th className="px-5 py-3">
                  Category
                </th>

                <th className="px-5 py-3">
                  Condition
                </th>

                <th className="px-5 py-3">
                  Price
                </th>

                <th className="px-5 py-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    This user hasn't listed any books.
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr
                    key={book.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">

                        {book.image ? (
                          <img
                            src={book.image}
                            alt={book.title}
                            className="h-12 w-9 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-9 items-center justify-center rounded bg-slate-100">
                            <BookOpen
                              size={16}
                              className="text-slate-400"
                            />
                          </div>
                        )}

                        <div>
                          <p className="font-medium text-slate-800">
                            {book.title}
                          </p>

                          <p className="text-xs text-slate-400">
                            {book.author}
                          </p>
                        </div>

                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {book.category || "—"}
                    </td>

                    <td className="px-5 py-4 capitalize text-slate-500">
                      {book.condition || "—"}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      ₹{book.price}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={
                          book.isAvailable
                            ? "Available"
                            : "Rented"
                        }
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Rental History */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-900">
            Rental History
          </h2>

          <p className="mt-0.5 text-xs text-slate-400">
            Books rented by this user
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3">
                  Book
                </th>

                <th className="px-5 py-3">
                  Rented
                </th>

                <th className="px-5 py-3">
                  Return Date
                </th>

                <th className="px-5 py-3">
                  Actual Return
                </th>

                <th className="px-5 py-3">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {rentals.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-slate-400"
                  >
                    No rental history found.
                  </td>
                </tr>
              ) : (
                rentals.map((rental) => (
                  <tr
                    key={rental.id}
                    className="border-t border-slate-100"
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-800">
                        {rental.title}
                      </p>

                      <p className="text-xs text-slate-400">
                        {rental.author}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(
                        rental.rentedAt
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(
                        rental.returnDate
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-500">
                      {formatDate(
                        rental.actualReturnDate
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge
                        status={rental.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

    </div>
  );
}