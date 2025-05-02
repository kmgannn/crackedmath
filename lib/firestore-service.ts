import { db } from "./firebase"
import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, type Timestamp } from "firebase/firestore"

export type Problem = {
  id?: string
  userId: string
  question: string
  solution?: string
  topic?: string
  difficulty?: string
  type: "solved" | "generated"
  createdAt: Timestamp | Date
}

// Add a new problem to Firestore
export async function addProblem(problem: Omit<Problem, "createdAt">) {
  try {
    const docRef = await addDoc(collection(db, "problems"), {
      ...problem,
      createdAt: serverTimestamp(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding problem:", error)
    throw error
  }
}

// Get problems for a specific user
export async function getUserProblems(userId: string): Promise<Problem[]> {
  try {
    const q = query(collection(db, "problems"), where("userId", "==", userId), orderBy("createdAt", "desc"))

    const querySnapshot = await getDocs(q)
    const problems: Problem[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      problems.push({
        id: doc.id,
        userId: data.userId,
        question: data.question,
        solution: data.solution,
        topic: data.topic,
        difficulty: data.difficulty,
        type: data.type,
        createdAt: data.createdAt,
      })
    })

    return problems
  } catch (error) {
    console.error("Error getting user problems:", error)
    throw error
  }
}

// Get solved problems for a specific user
export async function getUserSolvedProblems(userId: string): Promise<Problem[]> {
  try {
    const q = query(
      collection(db, "problems"),
      where("userId", "==", userId),
      where("type", "==", "solved"),
      orderBy("createdAt", "desc"),
    )

    const querySnapshot = await getDocs(q)
    const problems: Problem[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      problems.push({
        id: doc.id,
        userId: data.userId,
        question: data.question,
        solution: data.solution,
        type: data.type,
        createdAt: data.createdAt,
      })
    })

    return problems
  } catch (error) {
    console.error("Error getting user solved problems:", error)
    throw error
  }
}

// Get generated problems for a specific user
export async function getUserGeneratedProblems(userId: string): Promise<Problem[]> {
  try {
    const q = query(
      collection(db, "problems"),
      where("userId", "==", userId),
      where("type", "==", "generated"),
      orderBy("createdAt", "desc"),
    )

    const querySnapshot = await getDocs(q)
    const problems: Problem[] = []

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      problems.push({
        id: doc.id,
        userId: data.userId,
        question: data.question,
        solution: data.solution,
        topic: data.topic,
        difficulty: data.difficulty,
        type: data.type,
        createdAt: data.createdAt,
      })
    })

    return problems
  } catch (error) {
    console.error("Error getting user generated problems:", error)
    throw error
  }
}
