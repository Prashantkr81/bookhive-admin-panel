import {
  collection,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface DashboardStats {
  totalUsers: number;
  totalBooks: number;
  availableBooks: number;
  rentedBooks: number;
  activeRentals: number;
  overdueRentals: number;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  createdAt: string | null;
}

export interface RecentRental {
  id: string;
  userId: string;
  ownerId: string;
  bookId: string;
  title: string;
  author: string;
  image: string | null;
  price: number;
  rentedAt: string | null;
  returnDate: string | null;
  actualReturnDate: string | null;
  status: string;
}

function toDate(value: unknown): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const date = new Date(value);

    return Number.isNaN(date.getTime())
      ? null
      : date;
  }

  return null;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const [
    usersSnapshot,
    booksSnapshot,
    rentalsSnapshot,
  ] = await Promise.all([
    getDocs(collection(db, "users")),
    getDocs(collection(db, "books")),
    getDocs(collection(db, "rentals")),
  ]);

  const books = booksSnapshot.docs.map((doc) => doc.data());

  const rentals = rentalsSnapshot.docs.map((doc) => doc.data());

  const availableBooks = books.filter(
    (book) => book.isAvailable === true
  ).length;

  const rentedBooks = books.filter(
    (book) => book.isAvailable === false
  ).length;

  const activeRentals = rentals.filter(
    (rental) =>
      rental.status === "active" ||
      rental.status === "rented"
  ).length;

  const now = new Date();

  const overdueRentals = rentals.filter(
    (rental) => {
      const isActive =
        rental.status === "active" ||
        rental.status === "rented";

      if (!isActive) {
        return false;
      }

      const returnDate =
        toDate(rental.returnDate);

      if (!returnDate) {
        return false;
      }

      return returnDate < now;
    }
  ).length;

  return {
    totalUsers: usersSnapshot.size,
    totalBooks: booksSnapshot.size,
    availableBooks,
    rentedBooks,
    activeRentals,
    overdueRentals,
  };
}

export async function getRecentUsers(
  count = 5
): Promise<RecentUser[]> {
  const snapshot = await getDocs(
    collection(db, "users")
  );

  const users = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name ?? "Unknown",
      email: data.email ?? "—",
      createdAt:
        typeof data.createdAt === "string"
          ? data.createdAt
          : null,
    };
  });

  return users
    .sort((a, b) => {
      const dateA =
        toDate(a.createdAt)?.getTime() ?? 0;

      const dateB =
        toDate(b.createdAt)?.getTime() ?? 0;

      return dateB - dateA;
    })
    .slice(0, count);
}

export async function getRecentRentals(
  count = 5
): Promise<RecentRental[]> {
  const snapshot = await getDocs(
    collection(db, "rentals")
  );

  const rentals = snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      userId: data.userId ?? "",
      ownerId: data.ownerId ?? "",
      bookId: data.bookId ?? "",
      title: data.title ?? "Unknown Book",
      author: data.author ?? "Unknown Author",
      image: data.image ?? null,
      price: Number(data.price ?? 0),
      rentedAt:
        typeof data.rentedAt === "string"
          ? data.rentedAt
          : null,
      returnDate:
        typeof data.returnDate === "string"
          ? data.returnDate
          : null,
      actualReturnDate:
        typeof data.actualReturnDate === "string"
          ? data.actualReturnDate
          : null,
      status: data.status ?? "unknown",
    };
  });

  return rentals
    .sort((a, b) => {
      const dateA =
        toDate(a.rentedAt)?.getTime() ?? 0;

      const dateB =
        toDate(b.rentedAt)?.getTime() ?? 0;

      return dateB - dateA;
    })
    .slice(0, count);
}