import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  User,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import StatusBadge from "../../components/common/StatusBadge";

import {
  getBookById,
  getBookOwner,
  getBookRentals,
  type Book,
  type BookOwner,
  type BookRental,
} from "../../services/bookService";

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

export default function BookDetailsPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();

  const [book, setBook] =
    useState<Book | null>(null);

  const [owner, setOwner] =
    useState<BookOwner | null>(null);

  const [rentals, setRentals] =
    useState<BookRental[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadBook() {
    if (!bookId) {
      setError("Invalid book ID.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const bookData =
        await getBookById(bookId);

      if (!bookData) {
        setError("Book not found.");
        return;
      }

      setBook(bookData);

      const [
        ownerData,
        rentalData,
      ] = await Promise.all([
        getBookOwner(
          bookData.ownerId
        ),
        getBookRentals(bookId),
      ]);

      setOwner(ownerData);
      setRentals(rentalData);
    } catch (error) {
      console.error(
        "Failed to load book:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load book."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBook();
  }, [bookId]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading book...
        </p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="space-y-4 p-4 sm:p-6 lg:p-8">
        <button
          onClick={() =>
            navigate("/admin/books")
          }
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={17} />
          Back to Books
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-700">
            {error || "Book not found."}
          </p>
        </div>
      </div>
    );
  }

  const activeRental =
    rentals.find(
      (rental) =>
        rental.status === "active" ||
        rental.status === "rented"
    );

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* Back */}
      <button
        onClick={() =>
          navigate("/admin/books")
        }
        className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft size={17} />
        Back to Books
      </button>

      {/* Book Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 md:flex-row">

          {/* Image */}
          <div className="shrink-0">
            {book.image ? (
              <img
                src={book.image}
                alt={book.title}
                className="h-64 w-44 rounded-xl object-cover shadow-sm"
              />
            ) : (
              <div className="flex h-64 w-44 items-center justify-center rounded-xl bg-slate-100">
                <BookOpen
                  size={48}
                  className="text-slate-300"
                />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

              <div>
                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {book.title}
                </h1>

                <p className="mt-1 text-slate-500">
                  by {book.author}
                </p>
              </div>

              <StatusBadge
                status={
                  book.isAvailable
                    ? "Available"
                    : "Rented"
                }
              />

            </div>

            <p className="mt-6 text-sm leading-6 text-slate-600">
              {book.description ||
                "No description available."}
            </p>

            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Price
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  ₹{book.price}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Category
                </p>

                <p className="mt-1 capitalize text-slate-700">
                  {book.category || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Condition
                </p>

                <p className="mt-1 capitalize text-slate-700">
                  {book.condition || "—"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Added
                </p>

                <p className="mt-1 text-slate-700">
                  {formatDate(
                    book.createdAt
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Last Rented
                </p>

                <p className="mt-1 text-slate-700">
                  {formatDate(
                    book.rentedAt
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Last Returned
                </p>

                <p className="mt-1 text-slate-700">
                  {formatDate(
                    book.lastReturnedAt
                  )}
                </p>
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Owner */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex items-center gap-2">
          <User
            size={18}
            className="text-slate-500"
          />

          <h2 className="font-semibold text-slate-900">
            Book Owner
          </h2>
        </div>

        {owner ? (
          <div className="mt-5 flex items-center gap-4">

            {owner.photoURL ? (
              <img
                src={owner.photoURL}
                alt={owner.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-600">
                {owner.name
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div>
              <p className="font-medium text-slate-800">
                {owner.name}
              </p>

              <p className="text-sm text-slate-500">
                {owner.email}
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/admin/users/${owner.id}`
                  )
                }
                className="mt-1 text-xs font-medium text-slate-700 hover:underline"
              >
                View user profile →
              </button>
            </div>

          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-400">
            Owner information unavailable.
          </p>
        )}

      </div>

      {/* Current Rental */}
      {activeRental && (
        <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">

          <h2 className="font-semibold text-blue-900">
            Current Rental
          </h2>

          <div className="mt-4 grid gap-5 sm:grid-cols-3">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
                Rented On
              </p>

              <p className="mt-1 text-sm text-blue-900">
                {formatDate(
                  activeRental.rentedAt
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
                Return Date
              </p>

              <p className="mt-1 text-sm text-blue-900">
                {formatDate(
                  activeRental.returnDate
                )}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
                Status
              </p>

              <div className="mt-2">
                <StatusBadge
                  status={
                    activeRental.status
                  }
                />
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Rental History */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center gap-2">
            <CalendarDays
              size={18}
              className="text-slate-500"
            />

            <h2 className="font-semibold text-slate-900">
              Rental History
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            All rentals associated with this book.
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
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

                <th className="px-5 py-3">
                  User
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
                rentals.map(
                  (rental) => (
                    <tr
                      key={rental.id}
                      className="border-t border-slate-100"
                    >

                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(
                          rental.rentedAt
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(
                          rental.returnDate
                        )}
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {formatDate(
                          rental.actualReturnDate
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            rental.status
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/users/${rental.userId}`
                            )
                          }
                          className="font-mono text-xs text-slate-500 hover:text-slate-900 hover:underline"
                        >
                          {rental.userId}
                        </button>
                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Book ID */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          Book ID
        </p>

        <p className="mt-1 break-all font-mono text-xs text-slate-500">
          {book.id}
        </p>

      </div>

    </div>
  );
}