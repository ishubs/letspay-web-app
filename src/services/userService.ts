import { getFirestore, collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { CashbackStatus } from "../types";

const db = getFirestore();

export async function isUserPresent(userId: string): Promise<boolean> {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("id", "==", userId));
    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
}


// write a function to get the user from the users collection and return his full name using first and last name, throw error if user doesn't exist , use try and catch

export async function getUserName(userId: string): Promise<string> {
    const usersCollection = collection(db, "users");
    const q = query(usersCollection, where("id", "==", userId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
        throw new Error("User not found");
    }

    const userDoc = querySnapshot.docs[0].data();
    return `${userDoc.firstName} ${userDoc.lastName}`;
}

// write a function to get the doc with id = transactionID from the transactions collection and return its status
export async function getCashbackStatus(transactionId: string): Promise<CashbackStatus> {
    const transactionRef = doc(db, "transactions", transactionId);
    const transactionDoc = await getDoc(transactionRef);

    if (!transactionDoc.exists()) {
        throw new Error("Transaction not found");
    }

    const transactionData = transactionDoc.data();
    return transactionData.cashbackStatus as CashbackStatus;
}