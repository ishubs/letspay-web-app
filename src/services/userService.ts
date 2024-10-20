import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const db = getFirestore();

export async function isUserPresent(userId: string): Promise<boolean> {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("id", "==", userId));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
}