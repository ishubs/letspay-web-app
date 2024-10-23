import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Empty, Tabs } from 'antd';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

import { runTransaction, onSnapshot } from 'firebase/firestore';
import { getDoc, doc } from 'firebase/firestore';
import { FormattedDate } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

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
    description: string;
}

interface OutgoingTransaction {
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    amount: number;
    hostId: string;
    transactionId: string;
    status: "success" | "partial success" | "failed" | "pending" | "rejected" | "accepted" // Define status options as needed
    description: string;
    noOfAcceptedParticipants: number;
    participants: Participant[];
}



const Home: React.FC = () => {

    const navigate = useNavigate();

    const [incomingRequests, setIncomingRequests] = useState<Transaction[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<OutgoingTransaction[]>([]);

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
                    return { ...requestData, hostName } as Transaction;
                }));

                console.log(requests, "requests"); // Now includes hostName for each request

                requests.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

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
            );

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
                    return { ...requestData, participantName } as Transaction;
                }));

                console.log("Outgoing requests: ", requests);
                requests.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

                // we need to combine requests with same transactionId
                const requestsCopy = [...requests] as Request[];
                console.log(requestsCopy, "requestsCopy");
                // sort the requests by createdAt in descending order
                const combinedRequests = combineRequests(requestsCopy);
                setOutgoingRequests(combinedRequests as OutgoingTransaction[]);
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

    const handleNavigateTxDetail = (request: OutgoingTransaction) => {
        // Navigate to the transaction details page
        navigate(`/tx/${request.transactionId}`, { state: { request } });
    }

    return (
        <div className='flex flex-col gap-2'>
            <Tabs centered defaultActiveKey="1">
                <TabPane tab="Incoming Requests" key="1">
                    <div className='flex flex-col gap-2'>
                        {incomingRequests.length > 0 ? incomingRequests.map((request, index) => (
                            <Card key={index} className='flex flex-col shadow-md'>
                                <div className='flex justify-between'>
                                    <p className='text-gray-500'>Request from</p>
                                    <p className='text-gray-500'>{FormattedDate(request.createdAt)}</p>
                                </div>
                                <div className='flex justify-between mt-2'>
                                    <p>{request.hostName}</p>
                                    <p>₹{request.amount}</p>
                                </div>
                                <div className='flex justify-between mt-4 gap-3'>
                                    <Button className='w-1/2'>Decline</Button>
                                    <Button onClick={() => handleAccept(request.transactionId)} className='w-1/2' type='primary'>Accept</Button>
                                </div>
                            </Card>
                        )) : <Empty />}
                    </div>
                </TabPane>

                <TabPane className='flex flex-col gap-2 max-h-[300px] overflow-scroll' tab="Outgoing Requests" key="2">
                    <Alert message="Rejected amount will be added to your bill" type="info" />

                    {outgoingRequests.length > 0 ? outgoingRequests.map((request, index) => (
                        <>
                            <Card onClick={() => handleNavigateTxDetail(request)} key={index} className='flex flex-col shadow-md'>
                                <div className='flex justify-between'>
                                    <p className='text-gray-500'>Request for</p>
                                    <p className='text-gray-500'>{FormattedDate(request.createdAt)}</p>
                                </div>
                                <div className='flex justify-between mt-2'>
                                    <p>{request.description}</p>
                                    <p>₹{request.amount}</p>
                                </div>
                                <div className='flex justify-between mt-4'>
                                    <p>Status: {request.status}</p>
                                    <p>Accepted: {request.noOfAcceptedParticipants} / {request.participants.length}</p>
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


interface Request {
    userId: string;
    transactionId: string;
    description: string;
    amount: number;
    status: "pending" | "accepted" | "rejected"; // Define possible statuses
    hostId: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    participantName: string;
}

interface Participant {
    id: string;
    name: string;
    accepted: boolean;
    status: "pending" | "accepted" | "rejected"; // Define possible statuses
}

function combineRequests(requests: Request[]): OutgoingTransaction[] {
    const combinedRequests: { [key: string]: OutgoingTransaction } = {};

    requests.forEach(request => {
        const { transactionId, amount, participantName, userId, status } = request;

        // Initialize the combined request if it doesn't exist
        if (!combinedRequests[transactionId]) {
            combinedRequests[transactionId] = {
                transactionId,
                amount,
                description: request.description,
                status,
                hostId: request.hostId,
                createdAt: request.createdAt,
                participants: [{ id: userId, name: participantName, accepted: status === "accepted", status: status }],
                noOfAcceptedParticipants: status === "accepted" ? 1 : 0,
            };
        } else {
            // Combine amounts
            combinedRequests[transactionId].amount += amount;

            // Check if the participant already exists
            const existingParticipant = combinedRequests[transactionId].participants.find(participant => participant.id === userId);
            if (!existingParticipant) {
                combinedRequests[transactionId].participants.push({ id: userId, name: participantName, accepted: status === "accepted", status });
                // Update count of accepted participants
                if (status === "accepted") {
                    combinedRequests[transactionId].noOfAcceptedParticipants += 1;
                }
            } else {
                // Optionally, update the acceptance status if needed
                if (!existingParticipant.accepted && status === "accepted") {
                    existingParticipant.accepted = true;
                    combinedRequests[transactionId].noOfAcceptedParticipants += 1;
                }
            }
        }
    });

    // Determine overall status based on participant acceptance
    Object.values(combinedRequests).forEach(request => {
        const totalParticipants = request.participants.length;
        if (request.noOfAcceptedParticipants === totalParticipants) {
            request.status = "success";
        } else if (request.noOfAcceptedParticipants > 0) {
            request.status = "partial success";
        } else {
            request.status = "pending"; // or whatever default you want for no accepted participants
        }
    });

    // Convert the combinedRequests object back to an array
    return Object.values(combinedRequests);
}

