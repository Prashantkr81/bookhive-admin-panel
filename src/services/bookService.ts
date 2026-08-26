import {
  collection,
  doc,
  getDoc,
  getDocs,
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