import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import { collection, query, where } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { runTransaction, onSnapshot } from 'firebase/firestore';
import { getDoc, doc } from 'firebase/firestore';
import NoData from '../../components/common/NoData';
import IncomingRequestCard from '../../components/IncomingRequestCard'
import useIncomingRequests from '../../hooks/useIncomingRequests';

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
    status: "pending" | "approved" | "rejected" | "auto_rejected"; // Define status options as needed
    participantName: string;
    hostName: string;
    description: string;
}

const Home: React.FC = () => {
    // const [incomingRequests, setIncomingRequests] = useState<Transaction[]>([]);
    const [loadingTransactionId, setLoadingTransactionId] = useState<string | null>(null); // For tracking loading status
    const {incomingRequests} = useIncomingRequests()

    useEffect(() => {
        const unsubscribeIncoming = fetchIncomingRequests();
        return () => {
            unsubscribeIncoming();
        }; // Cleanup the listeners on component unmount
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
                // setIncomingRequests(requests as Transaction[]);
            });
        }

        return () => { }; // Return an empty function if user is not logged in
    };

    const handleAccept = async (requestId: string) => {
        setLoadingTransactionId(requestId); // Set the loading state to the specific request being accepted
        try {
            await runTransaction(db, async (transaction) => {
                const requestRef = doc(db, 'requests', requestId);
                const requestDoc = await transaction.get(requestRef);

                if (!requestDoc.exists()) {
                    throw new Error('Request does not exist!');
                }

                const requestData = requestDoc.data();

                const userId = requestData.userId;
                const limitRef = doc(db, 'limits', userId);
                const limitDoc = await transaction.get(limitRef);

                if (!limitDoc.exists()) {
                    throw new Error('User limit does not exist!');
                }

                const currentLimit = limitDoc.data().availableLimit;
                const amount = requestData.amount;

                const updatedLimit = currentLimit - amount;

                if (updatedLimit < 0) {
                    throw new Error(`Insufficient limit for user ${userId}`);
                }

                transaction.update(requestRef, { status: 'accepted' });
                transaction.update(limitRef, { availableLimit: updatedLimit });
            });

            message.success('Request accepted and limit updated successfully!');
        } catch (error: unknown) {
            console.error('Transaction failed: ', error);
            message.error(`Failed to accept request ${error}`);
        } finally {
            setLoadingTransactionId(null); // Reset the loading state
        }
    };

    const handleDecline = async (requestId: string) => {
        setLoadingTransactionId(requestId); // Set the loading state to the specific request being declined
        try {
            await runTransaction(db, async (transaction) => {
                // Step 1: Directly reference the request document by its ID (requestId)
                const requestRef = doc(db, 'requests', requestId);
                const requestDoc = await transaction.get(requestRef);

                if (!requestDoc.exists()) {
                    throw new Error('Request does not exist!');
                }

                // Step 2: Update the request document's status to 'declined'
                transaction.update(requestRef, { status: 'rejected' });

                // Optionally, you can add other logic if needed (e.g., sending a notification or adjusting limits).
            });

            message.success('Request declined successfully!');
        } catch (error: unknown) {
            console.error('Transaction failed: ', error);
            message.error(`Failed to decline request: ${error}`);
        } finally {
            setLoadingTransactionId(null); // Reset the loading state
        }
    };


    return (
        <div className='gap-2 p-4'>
            <div className=''>
                <h1 className='text-xl font-semibold mb-4'>Payment Requests
                </h1>
                <div className='flex flex-col gap-3'>
                    {incomingRequests.length > 0 ? (
                        incomingRequests.map((request, index) => (
                          <IncomingRequestCard 
                          request={request}
                          loadingTransactionId={false}
                          handleAccept={handleAccept}
                          handleDecline={handleDecline} />
                        )) 
                    ) : (
                        <NoData description="No pending requests" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
