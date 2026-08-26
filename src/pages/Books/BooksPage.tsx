import {
  BookOpen,
  Eye,
  Search,
} from "lucide-react";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
  getAllBooks,
  type Book,
} from "../../services/bookService";

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

export default function BooksPage() {
  const navigate = useNavigate();

  const [books, setBooks] =
    useState<Book[]>([]);

  const [search, setSearch] =
    useState("");

  const [availability, setAvailability] =
    useState("all");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  async function loadBooks() {
    try {
      setLoading(true);
      setError("");

      const data =
        await getAllBooks();

      setBooks(data);
    } catch (error) {
      console.error(
        "Failed to load books:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load books."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  const filteredBooks =
    useMemo(() => {
      const value =
        search.toLowerCase().trim();

      return books.filter((book) => {
        const matchesSearch =
          !value ||
          book.title
            .toLowerCase()
            .includes(value) ||
          book.author
            .toLowerCase()
            .includes(value);

        const matchesAvailability =
          availability === "all" ||
          (availability === "available" &&
            book.isAvailable) ||
          (availability === "rented" &&
            !book.isAvailable);

        return (
          matchesSearch &&
          matchesAvailability
        );
      });
    }, [
      books,
      search,
      availability,
    ]);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-sm text-slate-500">
          Loading books...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Books
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage all books listed on BookHive.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-sm ring-1 ring-slate-200">
          <BookOpen
            size={18}
            className="text-slate-500"
          />

          <span className="text-sm font-medium text-slate-700">
            {books.length.toLocaleString()} Books
          </span>
        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">
            {error}
          </p>

          <button
            onClick={loadBooks}
            className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}
          <div className="relative max-w-md flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by title or author..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-slate-400 focus:bg-white"
            />
          </div>

          {/* Availability */}
          <select
            value={availability}
            onChange={(e) =>
              setAvailability(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-slate-400"
          >
            <option value="all">
              All Books
            </option>

            <option value="available">
              Available
            </option>

            <option value="rented">
              Rented
            </option>
          </select>

        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] text-left text-sm">

            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4">
                  Book
                </th>

                <th className="px-5 py-4">
                  Category
                </th>

                <th className="px-5 py-4">
                  Condition
                </th>

                <th className="px-5 py-4">
                  Price
                </th>

                <th className="px-5 py-4">
                  Status
                </th>

                <th className="px-5 py-4">
                  Added
                </th>

                <th className="px-5 py-4 text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredBooks.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">

                      <BookOpen
                        size={32}
                        className="text-slate-300"
                      />

                      <p className="mt-3 font-medium text-slate-600">
                        No books found
                      </p>

                      <p className="mt-1 text-sm text-slate-400">
                        Try changing your filters.
                      </p>

                    </div>
                  </td>
                </tr>
              ) : (
                filteredBooks.map(
                  (book) => (
                    <tr
                      key={book.id}
                      className="border-t border-slate-100 transition hover:bg-slate-50"
                    >

                      {/* Book */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">

                          {book.image ? (
                            <img
                              src={book.image}
                              alt={book.title}
                              className="h-14 w-10 rounded object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-10 items-center justify-center rounded bg-slate-100">
                              <BookOpen
                                size={17}
                                className="text-slate-400"
                              />
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate font-medium text-slate-800">
                              {book.title}
                            </p>

                            <p className="text-xs text-slate-400">
                              {book.author}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 text-slate-500">
                        {book.category || "—"}
                      </td>

                      {/* Condition */}
                      <td className="px-5 py-4 capitalize text-slate-500">
                        {book.condition || "—"}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-medium text-slate-700">
                        ₹{book.price}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <StatusBadge
                          status={
                            book.isAvailable
                              ? "Available"
                              : "Rented"
                          }
                        />
                      </td>

                      {/* Created */}
                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(
                          book.createdAt
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(
                              `/admin/books/${book.id}`
                            )
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>
        </div>

        {/* Footer */}
        {filteredBooks.length > 0 && (
          <div className="border-t border-slate-200 px-5 py-3">
            <p className="text-xs text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-700">
                {filteredBooks.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-700">
                {books.length}
              </span>{" "}
              books
            </p>
          </div>
        )}

      </div>

    </div>
  );
}