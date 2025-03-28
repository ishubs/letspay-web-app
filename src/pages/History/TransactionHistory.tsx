import React, { useState, useEffect } from 'react';
import { Typography, List, Card, Alert } from 'antd';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import NoData from '../../components/common/NoData';
import TransactionCard from '../../components/TransactionCard';
import { useNavigate } from 'react-router-dom';

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

const TransactionHistory: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        const user = auth.currentUser;
        if (!user) return;

        try {
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
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleTransactionClick = (transaction: Transaction) => {
        navigate(`/tx/${transaction.id}`, {
            state: {
                request : transaction
            }
        }); // Navigate to the transaction details screen
    };

    return (
        <div className='flex flex-col gap-2 p-4'>
            <h1 className='text-lg font-semibold'>Transaction History
                {transactions.length > 0 && <> <span>{" ("}{transactions.length}</span>{")"}</>}
            </h1>

            {transactions.length > 0 ? (
                transactions.map((transaction) => (
                    <TransactionCard 
                        key={transaction.id} 
                        transaction={transaction} 
                        onClick={() => handleTransactionClick(transaction)} 
                    />
                ))
            ) : (
                <NoData description="No transaction history available" />
            )}
        </div>
    );
};

export default TransactionHistory; 