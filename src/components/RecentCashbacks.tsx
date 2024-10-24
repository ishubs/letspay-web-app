import React, { useEffect, useState } from 'react';
import { Alert, Card, Empty } from 'antd';
import { collection, query, where } from 'firebase/firestore';
import { auth, db } from '../firebase';

import { onSnapshot } from 'firebase/firestore';
import { getDoc, doc } from 'firebase/firestore';
import { FormattedTime } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';
import { getCashbackStatus } from '../services/userService';

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
    status: "pending" | "approved" | "rejected"; // Define status options as needed
    participantName: string;
    hostName: string;
    description: string;
    cashbackStatus: string;
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
    cashbackStatus: string;
}



const Home: React.FC = () => {

    const navigate = useNavigate();

    const [outgoingRequests, setOutgoingRequests] = useState<OutgoingTransaction[]>([]);

    useEffect(() => {
        const unsubscribeOutgoing = fetchOutgoingRequests();
        return () => {
            unsubscribeOutgoing();
        }; // Cleanup the listeners on component unmount
    }, []);

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
                    const cashbackStatus = await getCashbackStatus(requestData.transactionId);
                    let participantName = '';
                    if (userDocSnap.exists()) {
                        const participantData = userDocSnap.data();
                        participantName = `${participantData.firstName} ${participantData.lastName}`;
                    }

                    // Return the request along with the participant's name
                    return { ...requestData, participantName, cashbackStatus } as Transaction;
                }));

                requests.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

                const requestsCopy = [...requests] as Request[];
                const combinedRequests = combineRequests(requestsCopy);
                setOutgoingRequests(combinedRequests as OutgoingTransaction[]);
            });
        }

        return () => { }; // Return an empty function if user is not logged in
    };



    const handleNavigateTxDetail = (request: OutgoingTransaction) => {
        // Navigate to the transaction details page
        navigate(`/tx/${request.transactionId}`, { state: { request } });
    }

    return (
        <div className='flex flex-col gap-2'>
            <h1 className='text-lg font-semibold'>Recent Transactions</h1>
            <Alert message="Rejected amount will be added to your bill" type="info" />
            {outgoingRequests.length > 0 ? outgoingRequests.map((request, index) => (
                <>
                    <Card onClick={() => handleNavigateTxDetail(request)} key={index} className='flex flex-col shadow-md'>
                        <div className='flex justify-end text-xs'>
                            {/* <p className='text-gray-500'>Request for</p> */}
                        </div>
                        <div className='flex justify-between '>
                            <p className=''>{request.description}</p>
                            <p>₹{request.amount}</p>
                        </div>
                        <div className='flex justify-between mt-1 text-xs'>
                            <p> <span className='text-gray-500'>Cashback:</span> {request.cashbackStatus}</p>
                            <p><span className='text-gray-500'>Accepted:</span> {request.noOfAcceptedParticipants} / {request.participants.length}</p>
                        </div>
                        <p className='text-gray-500 mt-1 text-xs'>{FormattedTime(request.createdAt)}</p>

                    </Card>
                </>
            )) : <Empty />}
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
    cashbackStatus: string;
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
        const { transactionId, amount, participantName, userId, status, cashbackStatus } = request;

        // Initialize the combined request if it doesn't exist
        if (!combinedRequests[transactionId]) {
            combinedRequests[transactionId] = {
                transactionId,
                amount,
                description: request.description,
                status,
                cashbackStatus,
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

