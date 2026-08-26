import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase/config";

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  image: string | null;
  ownerId: string;
  isAvailable: boolean;
  rentedBy: string | null;
  rentedAt: string | null;
  lastReturnedAt: string | null;
  createdAt: string | null;
  category: string | null;
  condition: string | null;
}

export interface BookOwner {
  id: string;
  name: string;
  email: string;
  photoURL: string | null;
}

export interface BookRental {
  id: string;
  userId: string;
  ownerId: string;
  bookId: string;
  title: string;
  author: string;
  price: number;
  rentedAt: string | null;
  returnDate: string | null;
  actualReturnDate: string | null;
  status: string;
}

function mapBook(
  document: any
): Book {
  const data = document.data();

  return {
    id: document.id,
    title: data.title ?? "Untitled",
    author: data.author ?? "Unknown Author",
    description: data.description ?? "",
    price: Number(data.price ?? 0),
    image: data.image ?? null,
    ownerId: data.ownerId ?? "",
    isAvailable:
      data.isAvailable === true,
    rentedBy:
      data.rentedBy ?? null,
    rentedAt:
      typeof data.rentedAt === "string"
        ? data.rentedAt
        : null,
    lastReturnedAt:
      typeof data.lastReturnedAt === "string"
        ? data.lastReturnedAt
        : null,
    createdAt:
      typeof data.createdAt === "string"
        ? data.createdAt
        : null,
    category:
      data.category ?? null,
    condition:
      data.condition ?? null,
  };
}

export async function getAllBooks(): Promise<Book[]> {
  const snapshot = await getDocs(
    collection(db, "books")
  );

  return snapshot.docs
    .map(mapBook)
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

export async function getBookById(
  bookId: string
): Promise<Book | null> {
  const snapshot = await getDoc(
    doc(db, "books", bookId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapBook(snapshot);
}

export async function getBookOwner(
  ownerId: string
): Promise<BookOwner | null> {
  if (!ownerId) {
    return null;
  }

  const snapshot = await getDoc(
    doc(db, "users", ownerId)
  );

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    name: data.name ?? "Unknown User",
    email: data.email ?? "—",
    photoURL:
      data.photoURL ?? null,
  };
}

export async function getBookRentals(
  bookId: string
): Promise<BookRental[]> {
  const rentalsQuery = query(
    collection(db, "rentals"),
    where("bookId", "==", bookId)
  );

  const snapshot = await getDocs(
    rentalsQuery
  );

  return snapshot.docs
    .map((document) => {
      const data = document.data();

      return {
        id: document.id,
        userId: data.userId ?? "",
        ownerId: data.ownerId ?? "",
        bookId: data.bookId ?? "",
        title: data.title ?? "Unknown Book",
        author:
          data.author ?? "Unknown Author",
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