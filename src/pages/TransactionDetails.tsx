// fields to show
// description 
// totalAmount
// createdAt
// cashbackStatus - processing / success / error
// participants names 
// perPersonAmount
// status of each participant
// transaction id 
// host name

import React, { useEffect } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Divider, Card } from 'antd';
import { useLocation, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { FormattedDate } from '../utils/helpers';
import { Timestamp } from '../types';

interface Participant {
    name: string;
    status: string;
}

interface TransactionDetailsProps {
    description: string;
    totalAmount: number;
    createdAt: Timestamp;
    cashbackStatus: 'processing' | 'success' | 'error';
    participants: Participant[];
    perPersonAmount: number;
    transactionId: string;
    hostName: string;
    amount: number;
}

// const mock_transaction = {
//     "hostId": "Mr15pVuo2SzJ9aLfGLKBXMKlOTsB",
//         "description": "test transactionid",
//             "participants": [
//                 "R2it0oO6AItEgJeT1pMBlCvWXL4G"
//             ],
//                 "totalAmount": 10,
//                     "perPersonAmount": 5,
//                         "status": "pending",
//                             "cashbackStatus": "pending",
//                                 "createdAt": {
//         "seconds": 1729506357,
//             "nanoseconds": 351000000
//     }
// }

const TransactionDetails = () => {

    const { id } = useParams()
    const { state } = useLocation()

    const [transactionDetails, setTransactionDetails] = React.useState<TransactionDetailsProps | null>(state.request);

    console.log(state, " state")

    useEffect(() => {
        // get the doc with id from the firestore 
        getHostName(state.request.hostId)
    }, [])

    const getTransactionDetails = async (id: string) => {

        await getDoc(doc(db, 'transactions', id)).then((doc) => {
            if (doc.exists()) {
                console.log("Document data:", doc.data());
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        ).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    const getHostName = async (hostId: string) => {
        await getDoc(doc(db, 'users', hostId)).then((doc) => {
            if (doc.exists()) {
                // console.log("Document data:", doc.data());
                const host = doc.data()
                setTransactionDetails({
                    ...transactionDetails,
                    hostName: `${host?.firstName} ${host?.lastName}`
                } as TransactionDetailsProps)
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        ).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    const description = "Dinner at Joe's";
    const totalAmount = 150.00;
    const createdAt = "2023-10-01T18:30:00Z";
    const paidAt = "09:03 PM, 20 Oct 2024"
    const cashbackStatus = 'processing';
    const participants = [
        { name: 'Alice', status: 'accepted' },
        { name: 'Bob', status: 'pending' },
        { name: 'Charlie', status: 'accepted' }
    ];
    const perPersonAmount = totalAmount / participants.length;
    const transactionId = "txn_123456789";
    const hostName = "Shubham Giri";

    return (
        <div>
            <div>
                <div className='flex gap-2 bg-green-500 w-full px-4 py-4'>
                    <ArrowLeftOutlined
                        onClick={() => window.history.back()}
                        style={{
                            color: "white"
                        }} />
                    <p className='font-semibold text-white'>Cashback {cashbackStatus}</p>
                </div>
                <div className='p-4'>
                    <div className='border py-3 px-3 rounded-xl'>
                        <p className='text-xs font-semibold text-gray-600'>Amount</p>

                        <p className='text-2xl my-1 font-semibold'>₹ {transactionDetails?.amount}</p>
                        <Divider />
                        <p className='text-xs font-semibold text-gray-600'>Participants</p>
                        {
                            transactionDetails?.participants.map((participant, index) => (
                                <div key={index} className='flex justify-between items-center mt-2'>
                                    <p className='text-sm'>{participant.name}</p>
                                    <div>

                                        <p className={`text-sm ${participant.status === 'accepted' ? 'text-green-500' : participant.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
                                            {participant.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        }
                        <Divider />
                        <p className='text-xs font-semibold text-gray-600'>Host</p>
                        <p className='text-lg font-semibold'>{transactionDetails?.hostName}</p>
                        {transactionDetails?.createdAt && <p className='text-xs mt-1'>Paid at {FormattedDate(transactionDetails?.createdAt)}</p>}
                        <p className='text-xs mt-1'>Transaction Id: {transactionDetails?.transactionId}</p>
                        <p className='text-xs mt-1'>Description: {transactionDetails?.description}</p>
                        <p className='text-xs mt-1'>Status: {transactionDetails?.cashbackStatus}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;


