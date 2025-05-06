import { db } from "@/firebase/admin";  // adjust this if your file path is different

export async function GET() {
  try {
    const docRef = await db.collection("test").add({
      message: "Hello from test route",
      createdAt: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ success: true, id: docRef.id }),
      { status: 200 }
    );
} catch (error: unknown) {
    console.error("Firestore write test failed:", error);
  
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
  
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500 }
    );
  }
}
