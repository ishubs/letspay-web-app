import React, { useState, useEffect } from 'react';
import { Typography, List, Card, Tag, Alert } from 'antd';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { FormattedTime } from '../../utils/helpers';

const { Text } = Typography;

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
    status: "pending" | "accepted" | "rejected" | "auto_rejected";
    participantName: string;
    hostName: string;
    description: string;
}

const statusColors = {
    pending: 'orange',
    accepted: 'green',
    rejected: 'red',
    auto_rejected: 'red'
};

const statusText = {
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
    auto_rejected: 'Auto Rejected'
};

const OutgoingRequests: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        getOutgoingRequests();
    }, []);

    const getOutgoingRequests = async () => {
        const user = auth.currentUser;
        if (user) {
            const transactionsRef = collection(db, 'transactions');
            const q = query(transactionsRef, where('hostId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const transactions = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })) as Transaction[];
            
            // Sort by creation date, newest first
            transactions.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
            setTransactions(transactions);
        }
    };

    return (
        <div className='flex flex-col gap-2 p-4'>
            <h1 className='text-lg font-semibold'>Outgoing Requests
                {transactions.length > 0 && <> <span>{" ("}{transactions.length}</span>{")"}</>}
            </h1>

            {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                    <Card key={index} className='flex flex-col shadow-md'>
                        <div className='flex justify-between'>
                            <Text>{transaction.participantName}</Text>
                            <Tag color={statusColors[transaction.status]}>
                                {statusText[transaction.status]}
                            </Tag>
                        </div>
                        <div className='flex justify-between mt-2'>
                            <Text>{transaction.description}</Text>
                            <Text strong>₹{transaction.amount}</Text>
                        </div>
                        <div className='flex justify-between mt-2 text-gray-500 text-sm'>
                            <Text>Request to</Text>
                            <Text>{FormattedTime(transaction.createdAt)}</Text>
                        </div>
                    </Card>
                ))
            ) : (
                <Alert message="No outgoing requests" type="info" />
            )}
        </div>
    );
};

export default OutgoingRequests; 