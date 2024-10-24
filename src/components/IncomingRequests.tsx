import React, { useEffect, useState } from 'react';
import { Button, Card, Empty, message } from 'antd';
import { collection, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

import { runTransaction, onSnapshot } from 'firebase/firestore';
import { getDoc, doc } from 'firebase/firestore';
import { FormattedTime } from '../utils/helpers';

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


    const [incomingRequests, setIncomingRequests] = useState<Transaction[]>([]);

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
                const requests = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
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
                }));

                requests.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

                setIncomingRequests(requests as Transaction[]);
            });
        }

        return () => { }; // Return an empty function if user is not logged in
    };

    const handleAccept = async (requestId: string) => {
        try {
            await runTransaction(db, async (transaction) => {
                // Step 1: Directly reference the request document by its ID (requestId)
                const requestRef = doc(db, 'requests', requestId);
                const requestDoc = await transaction.get(requestRef);

                if (!requestDoc.exists()) {
                    throw new Error('Request does not exist!');
                }

                const requestData = requestDoc.data();

                // Step 2: Fetch the user's current limit from the limits collection
                const userId = requestData.userId;

                const limitRef = doc(db, 'limits', userId);
                const limitDoc = await transaction.get(limitRef);

                if (!limitDoc.exists()) {
                    throw new Error('User limit does not exist!');
                }

                const currentLimit = limitDoc.data().availableLimit;
                const amount = requestData.amount;

                // Step 3: Calculate the new limit
                const updatedLimit = currentLimit - amount;

                // Ensure the updated limit is non-negative
                if (updatedLimit < 0) {
                    throw new Error(`Insufficient limit for user ${userId}`);
                }

                // Step 4: Update the request document's status to 'accepted'
                transaction.update(requestRef, { status: 'accepted' });

                // Step 5: Update the user's available limit
                transaction.update(limitRef, { availableLimit: updatedLimit });
            });

            console.log('Request accepted and limit updated successfully!');
        } catch (error: unknown) {
            console.error('Transaction failed: ', error);
            message.error(`Failed to accept request ${error}`);
        }
    };

    return (
        <div className='flex flex-col gap-2'>

            <div className='flex flex-col gap-2'>
                <h1 className='text-lg font-semibold'>Incoming Requests</h1>

                {incomingRequests.length > 0 ? incomingRequests.map((request, index) => (
                    <Card key={index} className='flex flex-col shadow-md'>
                        <div className='flex justify-between'>
                            <p className='text-gray-500'>{request.hostName}</p>
                            <p className='text-gray-500'>{FormattedTime(request.createdAt)}</p>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <p>{request.description}</p>
                            <p>₹{request.amount}</p>
                        </div>
                        <div className='flex justify-between mt-4 gap-3'>
                            <Button className='w-1/2'>Decline</Button>
                            <Button onClick={() => handleAccept(request.id)} className='w-1/2' type='primary'>Accept</Button>
                        </div>
                    </Card>
                )) : <Empty />}
            </div>

        </div>
    );
};

export default Home;
