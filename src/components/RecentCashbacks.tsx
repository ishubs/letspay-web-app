import React, { useEffect, useState } from 'react';
import { Alert, Card, Tag } from 'antd';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { SyncOutlined } from '@ant-design/icons';
import { FormattedDate } from '../utils/helpers';
import { CashbackStatus } from '../types';

interface CashbackRequest {
    id: string;
    totalAmount: number;
    cashbackStatus: CashbackStatus; // You can add more statuses as needed
    createdAt: {
        seconds: number;
        nanoseconds: number;
    };
    hostId: string;
    description: string;
    perPersonAmount: number;
    participants: string[];
    status: "pending" | "completed" | "failed"; // Define status options as needed
}

const Home: React.FC = () => {
    const [transactions, setTransactions] = useState<CashbackRequest[]>([]);

    useEffect(() => {
        const unsubscribe = getRecentTransactions();
        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, []);

    const getRecentTransactions = () => {
        const user = auth.currentUser;

        if (user) {
            const transactionsRef = collection(db, 'transactions');
            const q = query(transactionsRef, where('hostId', '==', user.uid));

            return onSnapshot(q, (querySnapshot) => {
                const transactionsData: CashbackRequest[] = querySnapshot.docs.map(doc => ({
                    ...doc.data() as CashbackRequest,
                }));

                console.log(transactionsData, "transactions");
                // the transactionData must be sorted by createdAt in descending order
                transactionsData.sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);
                setTransactions(transactionsData);
            });
        } else {
            console.log('No user is signed in');
            return () => { }; // Return an empty function if no user is logged in
        }
    };


    return (
        <div className='flex flex-col gap-2 mb-[100px]'>
            <h1>Recent cashbacks</h1>
            {
                transactions.map((tx: CashbackRequest) => (
                    <Card>
                        <div className='flex flex-col gap-2 '>
                            <div className='flex justify-between'>
                                <p className='font-semibold'>{tx?.description}</p>
                                <p className='font-semibold'>₹{tx?.totalAmount}</p>
                            </div>
                            <div className='flex justify-between'>
                                <p className='text-gray-400'> {FormattedDate(tx?.createdAt)}</p>
                                {/* <Tag className='m-0' icon={<SyncOutlined spin />} color="processing">
                                    {tx?.cashbackStatus === 'pending' ? 'Processing' : 'Completed'}
                                </Tag> */}
                                {
                                    tx?.cashbackStatus === 'pending' ? (
                                        <Tag className='m-0' icon={<SyncOutlined spin />} color="processing">
                                            Processing
                                        </Tag>
                                    ) : (
                                        <Tag className='m-0' color={tx?.cashbackStatus === 'success' ? 'success' : 'error'}>
                                            {tx?.cashbackStatus === 'success' ? 'Approved' : 'Rejected'}
                                        </Tag>
                                    )
                                }
                            </div>
                        </div>
                    </Card>
                ))
            }
            {
                transactions.length === 0 && <Alert message="No recent cashbacks" type="info" />
            }
        </div>
    );
};

export default Home;



