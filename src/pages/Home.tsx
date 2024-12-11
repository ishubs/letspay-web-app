import React, { useEffect, useState } from 'react';
import { Alert, Button, Card, Divider, message } from 'antd';
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
    const [isNotificationTurnedOn, setIsNotificationTurnedOn] = useState(false);
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
                    message.error('Unable to get permission to notify.');
                }
            });
        } catch (err) {
            console.log(err)
        }
    }

   async function resetUI() {
        const vapidKey = import.meta.env.VITE_FIREBASE_VAPID_KEY
        // clearMessages();
        // showToken('loading...');
        // Get registration token. Initially this makes a network call, once retrieved
        // subsequent calls to getToken will return from cache.
        // const swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        getToken(messaging, { 
            // serviceWorkerRegistration: swRegistration ,
            vapidKey }).then((currentToken) => {
            console.log('Token:', currentToken);
            if (currentToken) {
                console.log('currentToken:', currentToken);
                setIsNotificationTurnedOn(true);
                // sendTokenToServer(currentToken);
                // updateUIForPushEnabled(currentToken);
                // update the user doc in the users collection with the token 
                const user = auth.currentUser;
                console.log('User:', user);
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
            message.error('An error occurred while retrieving token.');
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

    // we need the 15th of every month if the current date is less than 15th, we need the 28th of every month if the current date is greater than 15th
    // we need the date in the format 28th november 2021

    const dateToBill = () => {
        const date = new Date();
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();
        if (day < 15) {
            return `15th ${month} ${year}`;
        } else {
            return `28th ${month} ${year}`;
        }
    }



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
            <Header isNotificationTurnedOn={isNotificationTurnedOn} />
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
                    <Alert className='mt-4' message={`Bill will be generated on ${dateToBill()}`} type="warning" />
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