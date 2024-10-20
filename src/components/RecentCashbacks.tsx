import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Divider } from 'antd';
import { getFirestore, collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { PlusOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FormattedDate } from '../utils/helpers';

const Home: React.FC = () => {
    const [transactions, setTransactions] = useState<any[]>([]);

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
                const transactionsData = querySnapshot.docs.map(doc => ({
                    id: doc.id, // Include the document ID if needed
                    ...doc.data(),
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
        <div className='flex flex-col gap-2'>
            <h1>Recent cashbacks</h1>
            {
                transactions.map((tx, index) => (
                    <Card className='flex flex-col gap-2 shadow-md'>
                        <div className='flex justify-between'>
                            <p>{tx?.description}</p>
                            <p>{tx?.totalAmount}</p>
                        </div>
                        <div className='flex justify-between'>
                            {tx?.createdAt && <p> {FormattedDate(tx.createdAt)}</p>}
                            <p>{tx?.cashbackStatus}</p>
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



