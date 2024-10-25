import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Divider } from 'antd';
import IncomingRequests from '../components/IncomingRequests';
import RecentCashbacks from '../components/RecentCashbacks';
import AddTransaction from '../components/AddTransaction';
import Header from '../components/Header';
import { auth, db } from '../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { messaging } from './../firebase'
import { getToken, onMessage } from 'firebase/messaging'
import AddUPIIDModal from '../components/AddUPIIDModal';

type Limit = {
    availableLimit: number;
    totalLimit: number;
};

const Home: React.FC = () => {

    const [limit, setLimit] = useState<Limit | null>(null);
    // get the doc from limit collection where userId is equal to current user id

    useEffect(() => {
        requestPermission()
    }, [])

    function requestPermission() {

        console.log('Requesting permission...');
        try {
            Notification?.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');

                    resetUI();
                } else {
                    console.log('Unable to get permission to notify.');
                }
            });
        } catch (err) {
            console.log(err)
        }
    }

    function resetUI() {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
        // clearMessages();
        // showToken('loading...');
        // Get registration token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        getToken(messaging, { vapidKey }).then((currentToken) => {
            if (currentToken) {
                console.log('currentToken:', currentToken);
                // sendTokenToServer(currentToken);
                // updateUIForPushEnabled(currentToken);
                // update the user doc in the users collection with the token 
                const user = auth.currentUser;
                if (user) {
                    // updateDoc(doc(db, 'users', user.uid), {
                    //     fcmToken: currentToken
                    // }, { merge: true });

                    updateDoc(doc(db, 'users', user.uid), {
                        fcmToken: currentToken
                    }).then(() => {
                        console.log('Token added to user doc');
                    }).catch((err) => {
                        console.error('Error adding token to user doc:', err);
                    });
                }

            } else {
                // Show permission request.
                console.log('No registration token available. Request permission to generate one.');
                // // Show permission UI.
                // updateUIForPushPermissionRequired();
                // setTokenSentToServer(false);
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
            // showToken('Error retrieving registration token.');
            // setTokenSentToServer(false);
        });

        onMessage(messaging, (payload) => {
            console.log("Message received:", payload);
            // Show the notification in the UI if necessary
        });
    }


    useEffect(() => {
        const unsubscribe = fetchLimit();
        return () => unsubscribe(); // Cleanup the listener on component unmount
    }, []);

    const fetchLimit = () => {
        const user = auth.currentUser;
        if (!user?.uid) {
            console.error('User is not authenticated');
            return () => { }; // Return a no-op function to handle cleanup
        }
        const limitDoc = doc(db, 'limits', user.uid);

        return onSnapshot(limitDoc, (limitSnap) => {
            if (limitSnap.exists()) {
                console.log('Limit data:', limitSnap.data());
                setLimit(limitSnap.data() as Limit);
            } else {
                console.log('No limit data found');
                setLimit(null); // Optionally reset the limit if it doesn't exist
            }
        });
    };

    return (
        <>
            <Header />
            <div className='p-4 flex flex-col gap-4 overflow-hidden'>
                {limit && <Card className='flex flex-col shadow-md '>
                    <div className='flex flex-col'>
                        <p className='font-bold'>Available Limit</p>
                        <h1>₹ {limit?.availableLimit.toFixed(2)}</h1>
                    </div>
                    <Divider />
                    <div className='flex justify-between'>
                        <div className='flex flex-col'>
                            <p className='font-bold'>Your bill</p>
                            <h1>₹ {(Number(limit?.totalLimit) - Number(limit?.availableLimit)).toFixed(2)}</h1>
                        </div>
                        <Button
                            onClick={() => {
                                window.open('https://forms.gle/TcS3muugokV9Mw6Q9', '_blank')
                            }}
                            type='primary'>Pay Now</Button>
                    </div>
                    <Alert className='mt-4' message="Bill will be generated on 5th Nov, 2024" type="warning" />
                </Card>}
                <IncomingRequests />
                <RecentCashbacks />
                <AddTransaction />
                <AddUPIIDModal />
                {/* <RecentTransactions /> */}
            </div>
        </>
    );
};

export default Home;