import { getAuth } from "firebase/auth";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function incrementQuestionCount() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) throw new Error("Not logged in");
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) throw new Error("User doc not found");

  const data = userSnap.data();
  let { questionsThisMonth, lastReset, extraPacks } = data;
  const now = new Date();
  const lastResetDate = lastReset?.toDate ? lastReset.toDate() : new Date(lastReset);

  // Reset if new month
  if (
    !lastResetDate ||
    now.getFullYear() !== lastResetDate.getFullYear() ||
    now.getMonth() !== lastResetDate.getMonth()
  ) {
    questionsThisMonth = 0;
    extraPacks = 0;
    await updateDoc(userRef, {
      questionsThisMonth: 1,
      lastReset: serverTimestamp(),
      extraPacks: 0,
    });
    return { questionsThisMonth: 1, extraPacks: 0 };
  }

  await updateDoc(userRef, {
    questionsThisMonth: questionsThisMonth + 1,
  });
  return { questionsThisMonth: questionsThisMonth + 1, extraPacks };
}
