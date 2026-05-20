import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { db } from "./db";

// Expiration time: 7 days
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(userId: string): Promise<string> {
  const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MS);
  
  // Clean up any expired sessions for this user to keep db small
  try {
    await db.session.deleteMany({
      where: {
        OR: [
          { userId },
          { expiresAt: { lt: new Date() } }
        ]
      }
    });
  } catch (e) {
    console.error("Error cleaning up sessions", e);
  }

  // Create session in SQLite
  const session = await db.session.create({
    data: {
      userId,
      expiresAt,
    },
  });

  // Set secure, HTTP-only cookie
  const cookieStore = await cookies();
  cookieStore.set("session", session.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });

  return session.id;
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    return null;
  }

  // Fetch session with user
  const session = await db.session.findUnique({
    where: { id: sessionId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  // Check if session is expired
  if (new Date() > session.expiresAt) {
    // Delete expired session
    try {
      await db.session.delete({ where: { id: sessionId } });
      const cookieStore = await cookies();
      cookieStore.delete("session");
    } catch (e) {
      console.error(e);
    }
    return null;
  }

  return session.user;
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  if (sessionId) {
    try {
      await db.session.delete({ where: { id: sessionId } });
    } catch (e) {
      console.error("Error deleting session in database", e);
    }
  }

  cookieStore.delete("session");
}
