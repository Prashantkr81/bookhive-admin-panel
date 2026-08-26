import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string | null;
  photoURL: string | null;
}

export interface UserBook {
  id: string;
  title: string;
  author: string;
  image: string | null;
  price: number;
  isAvailable: boolean;
  category: string | null;
  condition: string | null;
  createdAt: string | null;
}

export interface UserRental {
  id: string;
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

export async function getAllUsers(): Promise<User[]> {
  const snapshot = await getDocs(
    collection(db, "users")
  );

  return snapshot.docs
    .map((document) => {
      const data = document.data();

      return {
        id: document.id,
        name: data.name ?? "Unknown",
        email: data.email ?? "—",
        createdAt:
          typeof data.createdAt === "string"
            ? data.createdAt
            : null,
        photoURL:
          typeof data.photoURL === "string"
            ? data.photoURL
            : null,
      };
    })
    .sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return dateB - dateA;
    });
}

export async function getUserById(
  uid: string
): Promise<User | null> {
  const snapshot = await getDoc(
    doc(db, "users", uid)
  );

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: data.name ?? "Unknown",
    email: data.email ?? "—",
    createdAt:
      typeof data.createdAt === "string"
        ? data.createdAt
        : null,
    photoURL:
      typeof data.photoURL === "string"
        ? data.photoURL
        : null,
  };
}

export async function getUserBooks(
  uid: string
): Promise<UserBook[]> {
  const booksQuery = query(
    collection(db, "books"),
    where("ownerId", "==", uid)
  );

  const snapshot = await getDocs(
    booksQuery
  );

  return snapshot.docs
    .map((document) => {
      const data = document.data();

      return {
        id: document.id,
        title: data.title ?? "Untitled",
        author: data.author ?? "Unknown Author",
        image: data.image ?? null,
        price: Number(data.price ?? 0),
        isAvailable:
          data.isAvailable === true,
        category:
          data.category ?? null,
        condition:
          data.condition ?? null,
        createdAt:
          typeof data.createdAt === "string"
            ? data.createdAt
            : null,
      };
    })
    .sort((a, b) => {
      const dateA = a.createdAt
        ? new Date(a.createdAt).getTime()
        : 0;

      const dateB = b.createdAt
        ? new Date(b.createdAt).getTime()
        : 0;

      return dateB - dateA;
    });
}

export async function getUserRentals(
  uid: string
): Promise<UserRental[]> {
  const rentalsQuery = query(
    collection(db, "rentals"),
    where("userId", "==", uid)
  );

  const snapshot = await getDocs(
    rentalsQuery
  );

  return snapshot.docs
    .map((document) => {
      const data = document.data();

      return {
        id: document.id,
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
          typeof data.actualReturnDate ===
          "string"
            ? data.actualReturnDate
            : null,
        status:
          data.status ?? "unknown",
      };
    })
    .sort((a, b) => {
      const dateA = a.rentedAt
        ? new Date(a.rentedAt).getTime()
        : 0;

      const dateB = b.rentedAt
        ? new Date(b.rentedAt).getTime()
        : 0;

      return dateB - dateA;
    });
}