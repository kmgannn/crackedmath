import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useQuestionStatus() {
  const [status, setStatus] = useState<{
    questionsThisMonth: number;
    subscriptionStatus: "active" | "inactive";
    extraPacks: number;
    loading: boolean;
    error?: string;
  }>({
    questionsThisMonth: 0,
    subscriptionStatus: "inactive",
    extraPacks: 0,
    loading: true,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setStatus((s) => ({ ...s, loading: false, error: "Not logged in" }));
        return;
      }
      const userRef = doc(db, "users", user.uid);
      let userSnap = await getDoc(userRef);

      // If user doc doesn't exist, create it
      if (!userSnap.exists()) {
        await setDoc(userRef, {
          questionsThisMonth: 0,
          lastReset: serverTimestamp(),
          subscriptionStatus: "inactive",
          extraPacks: 0,
        });
        userSnap = await getDoc(userRef);
      }

      const data = userSnap.data();
      setStatus({
        questionsThisMonth: data?.questionsThisMonth ?? 0,
        subscriptionStatus: data?.subscriptionStatus ?? "inactive",
        extraPacks: data?.extraPacks ?? 0,
        loading: false,
      });
    };

    fetchStatus();
  }, []);

  return status;
}
