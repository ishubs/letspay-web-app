import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';

interface Transaction {
    id: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    amount: number;
    hostId: string;
    userId: string;
    transactionId: string;
    status: "pending" | "approved" | "rejected" | "auto_rejected";
    participantName: string;
    hostName: string;
    description: string;
}

const useIncomingRequests = () => {
    const [incomingRequests, setIncomingRequests] = useState<Transaction[]>([]);
    const [incomingRequestsCount, setIncomingRequestsCount] = useState<number>(0);

    useEffect(() => {
        const unsubscribeIncoming = fetchIncomingRequests();
        return () => {
            unsubscribeIncoming();
        };
    }, []);

    const fetchIncomingRequests = () => {
        const user = auth.currentUser;

        if (user) {
            const q = query(
                collection(db, 'requests'),
                where('userId', '==', user.uid),
                where('status', '==', 'pending')
            );

            return onSnapshot(q, async (querySnapshot) => {
                const requests = await Promise.all(
                    querySnapshot.docs.map(async (docSnap) => {
                        const requestData = docSnap.data();
                        const id = docSnap.id;

                        const hostId = requestData.hostId;
                        const userDocRef = doc(db, 'users', hostId);
                        const userDocSnap = await getDoc(userDocRef);

                        let hostName = '';
                        if (userDocSnap.exists()) {
                            const hostData = userDocSnap.data();
                            hostName = `${hostData.firstName} ${hostData.lastName}`;
                        }

                        return { ...requestData, hostName, id } as Transaction;
                    })
                );

                requests.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
                setIncomingRequests(requests);
                setIncomingRequestsCount(requests.length);
            });
        }

        return () => { }; // Return an empty function if user is not logged in
    };

    return { incomingRequests, incomingRequestsCount };
};

export default useIncomingRequests; 