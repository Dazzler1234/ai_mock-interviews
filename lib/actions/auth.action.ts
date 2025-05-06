'use server';

import { db, auth } from "@/firebase/admin";
import { User } from "firebase/auth";
import { cookies } from "next/headers";

interface SignUpParams {
  uid: string;
  name: string;
  email: string;
  password: string;
}

interface SignInParams {
  email: string;
  idToken: string;
}

const ONE_WEEK = 60 * 60 * 24 * 7;

// ✅ Set session cookie securely
export async function setSessionCookie(idToken: string) {
  const cookieStore = cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000,
  });

  (await cookieStore).set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // ✅ secure only in production
    path: "/",
    sameSite: "lax",
  });
}

// ✅ Create user in Firestore
export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection("users").doc(uid).get();
    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in.",
      };
    }

    await db.collection("users").doc(uid).set({ name, email });

    return {
      success: true,
      message: "Account created successfully. Please sign in.",
    };
  } catch (error: any) {
    console.error("Error creating user:", error);

    if (error.code === "auth/email-already-exists") {
      return {
        success: false,
        message: "This email is already in use",
      };
    }

    return {
      success: false,
      message: "Failed to create account. Please try again.",
    };
  }
}

// ✅ Sign in and set session cookie
export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);
    if (!userRecord) {
      return {
        success: false,
        message: "User does not exist. Create an account.",
      };
    }

    await setSessionCookie(idToken);

    return {
      success: true,
      message: "Logged in successfully.",
    };
  } catch (error: any) {
    console.log("Sign in error:", error);

    return {
      success: false,
      message: "Failed to log into account. Please try again.",
    };
  }
}

// ✅ Get user from session cookie
export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = cookies();
  const sessionCookie = (await cookieStore).get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db.collection("users").doc(decodedClaims.uid).get();
    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as unknown as User;
  } catch (error) {
    console.log("Session verification failed:", error);
    return null;
  }
}

// ✅ Export to check auth status
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}
