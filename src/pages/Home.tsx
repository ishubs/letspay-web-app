import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Divider, FloatButton } from 'antd';
import IncomingRequests from '../components/IncomingRequests';
import RecentCashbacks from '../components/RecentCashbacks';
import RecentTransactions from '../components/RecentTransactions';
import AddTransaction from '../components/AddTransaction';
import Header from '../components/Header';
import { auth, db } from '../firebase';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
const Home: React.FC = () => {

    const [limit, setLimit] = useState(null);
    // get the doc from limit collection where userId is equal to current user id

    useEffect(() => {
        const unsubscribe = fetchLimit();
        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, []);

    const fetchLimit = () => {
        const user = auth.currentUser;
        const limitDoc = doc(db, 'limits', user?.uid);

        return onSnapshot(limitDoc, (limitSnap) => {
            if (limitSnap.exists()) {
                console.log('Limit data:', limitSnap.data());
                setLimit(limitSnap.data());
            } else {
                console.log('No limit data found');
                setLimit(null); // Optionally reset the limit if it doesn't exist
            }
        });
    };

    return (
        <>
            <Header />

            <div className='h-[100vh] p-4 flex flex-col gap-4 pb-[100px] overflow-scroll'>
                <Card className='flex flex-col shadow-md '>
                    <div className='flex flex-col'>
                        <p className='font-bold'>Available Limit</p>
                        <h1>₹ {limit?.availableLimit}</h1>
                    </div>
                    <Divider />
                    <div className='flex justify-between'>
                        <div className='flex flex-col'>
                            <p className='font-bold'>Your bill</p>
                            <h1>₹ {Number(limit?.totalLimit) - Number(limit?.availableLimit)}</h1>
                        </div>
                        <Button type='primary'>Pay Now</Button>
                    </div>
                    <Alert className='mt-4' message="Bill will be generated on 5th Oct, 2024" type="warning" />
                </Card>
                <IncomingRequests />
                <RecentCashbacks />
                <AddTransaction />
                {/* <RecentTransactions /> */}
            </div>
        </>
    );
};

export default Home;