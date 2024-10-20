import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Empty, Tabs } from 'antd';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

import { runTransaction, onSnapshot } from 'firebase/firestore';
import { getDoc, doc } from 'firebase/firestore';
import { FormattedDate } from '../utils/helpers';

const { TabPane } = Tabs;
interface Transaction {
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    amount: number;
    hostId: string;
    userId: string;
    transactionId: string;
    status: "pending" | "approved" | "rejected"; // Define status options as needed
    participantName: string;
    hostName: string;
}



const Home: React.FC = () => {
    const [incomingRequests, setIncomingRequests] = useState<Transaction[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<Transaction[]>([]);

    useEffect(() => {
        const unsubscribeIncoming = fetchIncomingRequests();
        const unsubscribeOutgoing = fetchOutgoingRequests();
        return () => {
            unsubscribeIncoming();
            unsubscribeOutgoing();
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

            console.log(user.uid, "user.uid");

            return onSnapshot(q, async (querySnapshot) => {
                const requests = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
                    const requestData = docSnap.data();
                    const hostId = requestData.hostId;

                    // Fetch the host's name from the users collection
                    const userDocRef = doc(db, 'users', hostId);
                    const userDocSnap = await getDoc(userDocRef);

                    let hostName = '';
                    if (userDocSnap.exists()) {
                        const hostData = userDocSnap.data();
                        hostName = `${hostData.firstName} ${hostData.lastName}`;
                    }

                    // Return the request along with the hostName
                    return { ...requestData, hostName };
                }));

                console.log(requests, "requests"); // Now includes hostName for each request

                setIncomingRequests(requests as Transaction[]);
            });
        }

        return () => { }; // Return an empty function if user is not logged in
    };

    const fetchOutgoingRequests = () => {
        const user = auth.currentUser;

        if (user) {
            const q = query(
                collection(db, 'requests'),
                where('hostId', '==', user.uid),
                where('status', '!=', 'pending') // Outgoing requests are those not pending
            );

            console.log(user.uid, "user.uid");

            return onSnapshot(q, async (querySnapshot) => {
                const requests = await Promise.all(querySnapshot.docs.map(async (docSnap) => {
                    const requestData = docSnap.data();
                    const participantId = requestData.userId;

                    // Fetch the participant's name from the users collection
                    const userDocRef = doc(db, 'users', participantId);
                    const userDocSnap = await getDoc(userDocRef);

                    let participantName = '';
                    if (userDocSnap.exists()) {
                        const participantData = userDocSnap.data();
                        participantName = `${participantData.firstName} ${participantData.lastName}`;
                    }

                    // Return the request along with the participant's name
                    return { ...requestData, participantName };
                }));

                console.log("Outgoing requests: ", requests);

                setOutgoingRequests(requests as Transaction[]);
            });
        }

        return () => { }; // Return an empty function if user is not logged in
    };

    const handleAccept = async (requestId: string) => {
        try {
            await runTransaction(db, async (transaction) => {
                // Step 1: Query the requests collection for the request with the given transactionId
                const requestsRef = collection(db, 'requests');
                const q = query(requestsRef, where('transactionId', '==', requestId));
                const querySnapshot = await getDocs(q);

                if (querySnapshot.empty) {
                    throw new Error('Request does not exist!');
                }

                // Assuming there's only one document with the matching transactionId
                const requestDoc = querySnapshot.docs[0];
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
                transaction.update(requestDoc.ref, { status: 'accepted' });

                // Step 5: Update the user's available limit
                transaction.update(limitRef, { availableLimit: updatedLimit });
            });

            console.log('Request accepted and limit updated successfully!');
        } catch (error) {
            console.error('Transaction failed: ', error);
        }
    };

    return (
        <div className='flex flex-col gap-2'>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Incoming Requests" key="1">
                    {incomingRequests.length > 0 ? incomingRequests.map((request, index) => (
                        <Card key={index} className='flex flex-col gap-2 shadow-md'>
                            <div className='flex justify-between'>
                                <p>Request from</p>
                                <p>{FormattedDate(request.createdAt)}</p>
                            </div>
                            <div className='flex justify-between mt-4'>
                                <p>{request.hostName}</p>
                                <p>₹{request.amount}</p>
                            </div>
                            <div className='flex justify-between mt-4 gap-3'>
                                <Button className='w-1/2'>Decline</Button>
                                <Button onClick={() => handleAccept(request.transactionId)} className='w-1/2' type='primary'>Accept</Button>
                            </div>
                        </Card>
                    )) : <Empty />}
                </TabPane>

                <TabPane className='flex flex-col gap-2 max-h-[300px] overflow-scroll' tab="Outgoing Requests" key="2">
                    <Alert message="Rejected amount will be added to your bill" type="info" />

                    {outgoingRequests.length > 0 ? outgoingRequests.map((request, index) => (
                        <>
                            <Card key={index} className='flex flex-col gap-2 shadow-md'>
                                <div className='flex justify-between'>
                                    <p>Request to</p>
                                    <p>{FormattedDate(request.createdAt)}</p>
                                </div>
                                <div className='flex justify-between mt-4'>
                                    <p>{request.participantName}</p>
                                    <p>₹{request.amount}</p>
                                </div>
                                <div className='flex justify-between mt-4'>
                                    <p>Status: {request.status}</p>
                                </div>
                            </Card>
                        </>
                    )) : <Empty />}
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Home;
