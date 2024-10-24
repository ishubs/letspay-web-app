import React, { useEffect } from 'react';
import { ArrowLeftOutlined, CopyOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Divider, message } from 'antd';
import { useLocation } from 'react-router-dom';
import { FormattedDate } from '../utils/helpers';
import { CashbackStatus, Timestamp } from '../types';
import { getCashbackStatus, getUserName } from '../services/userService';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface Participant {
    id: string;
    name: string;
    status: string;
    requestId: string;
}

interface TransactionDetailsProps {
    description: string;
    totalAmount: number;
    createdAt: Timestamp;
    cashbackStatus: CashbackStatus;
    participants: Participant[];
    perPersonAmount: number;
    transactionId: string;
    hostName: string;
    amount: number;
}


const TransactionDetails = () => {

    const { state } = useLocation()

    const [transactionDetails, setTransactionDetails] = React.useState<TransactionDetailsProps | null>(state.request);

    useEffect(() => {
        setTxDetails()
    }, [])


    const setTxDetails = async () => {

        const hostName = await getUserName(state.request.hostId)
        const cashbackStatus = await getCashbackStatus(state.request.transactionId)
        setTransactionDetails({
            ...transactionDetails,
            hostName,
            cashbackStatus
        } as TransactionDetailsProps)
    }


    const handleRetry = async (requestId: string) => {

        try {

            const requestRef = doc(db, 'requests', requestId);

            await updateDoc(requestRef, {
                status: 'pending'
            })

            message.success('Request sent successfully');
        } catch (err) {
            console.log(err)
            message.error('Error retrying request')
        }
    }

    console.log(transactionDetails, "transactionDetails")

    return (
        <div>
            <div>
                <div className={`flex gap-2 w-full px-4 py-4 ${transactionDetails?.cashbackStatus === 'pending' ? 'bg-yellow-500' : transactionDetails?.cashbackStatus === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                    <ArrowLeftOutlined
                        onClick={() => window.history.back()}
                        style={{
                            color: "white"
                        }} />
                    <p className='font-semibold text-white'>Cashback {transactionDetails?.cashbackStatus}</p>
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
                                    {participant.status === 'rejected' && <Button
                                        onClick={() => handleRetry(participant.requestId)}
                                        icon={<ReloadOutlined className='text-xs' />}
                                        className='h-[30px] text-sm'>Retry</Button>}
                                </div>
                            ))
                        }
                        <Divider />
                        <p className='text-xs font-semibold text-gray-600'>Host</p>
                        <p className='text-lg font-semibold'>{transactionDetails?.hostName}</p>
                        {transactionDetails?.createdAt && <p className='text-xs mt-1'>Paid at {FormattedDate(transactionDetails?.createdAt)}</p>}
                        <p className='text-xs mt-1 flex gap-2'>Transaction Id: {transactionDetails?.transactionId}

                            <CopyOutlined className='text-base' onClick={() => {
                                navigator.clipboard.writeText(transactionDetails?.transactionId || "")
                                message.success('Transaction ID copied')
                            }} />
                        </p>
                        <p className='text-xs mt-1'>Description: {transactionDetails?.description}</p>
                        <p className='text-xs mt-1'>Status: {transactionDetails?.cashbackStatus}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;




// {
//     "transactionId": "0LTHBCA92JN3derDOGy9",
//         "amount": 15,
//             "description": "test rejected",
//                 "status": "pending",
//                     "cashbackStatus": "pending",
//                         "hostId": "i159G5kdK8xDScYIl5zDmOIv69j1",
//                             "createdAt": {
//         "seconds": 1729770393,
//             "nanoseconds": 718000000
//     },
//     "participants": [
//         {
//             "id": "yjnTtq3Iv5NqO1nlsVhKJDhVDItt",
//             "name": "Shubham Test",
//             "accepted": false,
//             "status": "rejected",
//         }
//     ],
//         "noOfAcceptedParticipants": 0,
//             "hostName": "new User"
// }