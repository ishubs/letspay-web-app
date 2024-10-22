// // fields to show
// // description 
// // totalAmount
// // createdAt
// // cashbackStatus - processing / success / error
// // participants names 
// // perPersonAmount
// // status of each participant
// // transaction id 
// // host name

// import React, { useEffect } from 'react';
// import { ArrowLeftOutlined } from '@ant-design/icons';
// import { Divider, Card } from 'antd';
// import { useParams } from 'react-router-dom';
// import { getDoc, doc } from 'firebase/firestore';
// import { db } from '../firebase';

// interface Participant {
//     name: string;
//     status: string;
// }

// interface TransactionDetailsProps {
//     description: string;
//     totalAmount: number;
//     createdAt: string;
//     cashbackStatus: 'processing' | 'success' | 'error';
//     participants: Participant[];
//     perPersonAmount: number;
//     transactionId: string;
//     hostName: string;
// }

// // const mock_transaction = {
// //     "hostId": "Mr15pVuo2SzJ9aLfGLKBXMKlOTsB",
// //         "description": "test transactionid",
// //             "participants": [
// //                 "R2it0oO6AItEgJeT1pMBlCvWXL4G"
// //             ],
// //                 "totalAmount": 10,
// //                     "perPersonAmount": 5,
// //                         "status": "pending",
// //                             "cashbackStatus": "pending",
// //                                 "createdAt": {
// //         "seconds": 1729506357,
// //             "nanoseconds": 351000000
// //     }
// // }

// const TransactionDetails = () => {

//     const { id } = useParams()

//     useEffect(() => {
//         // get the doc with id from the firestore 
//         if (id)
//             getTransactionDetails(id)
//     }, [])

//     const getTransactionDetails = async (id: string) => {

//         await getDoc(doc(db, 'transactions', id)).then((doc) => {
//             if (doc.exists()) {
//                 console.log("Document data:", doc.data());
//             } else {
//                 // doc.data() will be undefined in this case
//                 console.log("No such document!");
//             }
//         }
//         ).catch((error) => {
//             console.log("Error getting document:", error);
//         });
//     }

//     const description = "Dinner at Joe's";
//     const totalAmount = 150.00;
//     const createdAt = "2023-10-01T18:30:00Z";
//     const paidAt = "09:03 PM, 20 Oct 2024"
//     const cashbackStatus = 'processing';
//     const participants = [
//         { name: 'Alice', status: 'accepted' },
//         { name: 'Bob', status: 'pending' },
//         { name: 'Charlie', status: 'accepted' }
//     ];
//     const perPersonAmount = totalAmount / participants.length;
//     const transactionId = "txn_123456789";
//     const hostName = "Shubham Giri";

//     return (
//         // <div>
//         //     <h1>Transaction Details</h1>
//         //     <p><strong>Description:</strong> {description}</p>
//         //     <p><strong>Total Amount:</strong> ${totalAmount.toFixed(2)}</p>
//         //     <p><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</p>
//         //     <p><strong>Cashback Status:</strong> {cashbackStatus}</p>
//         //     <p><strong>Transaction ID:</strong> {transactionId}</p>
//         //     <p><strong>Host Name:</strong> {hostName}</p>
//         //     <h2>Participants</h2>
//         //     <ul>
//         //         {participants.map((participant, index) => (
//         //             <li key={index}>
//         //                 <p><strong>Name:</strong> {participant.name}</p>
//         //                 <p><strong>Status:</strong> {participant.status}</p>
//         //                 <p><strong>Per Person Amount:</strong> ${perPersonAmount.toFixed(2)}</p>
//         //             </li>
//         //         ))}
//         //     </ul>
//         // </div>
//         <div>
//             <div>
//                 <div className='flex gap-2 bg-green-500 w-full px-4 py-4'>
//                     <ArrowLeftOutlined style={{
//                         color: "white"
//                     }} />
//                     <p className='font-semibold text-white'>Cashback {cashbackStatus}</p>
//                 </div>
//                 <div className='p-4'>
//                     <div className='border py-3 px-3 rounded-xl'>
//                         <p className='text-xs font-semibold text-gray-600'>Amount</p>

//                         <p className='text-2xl my-1 font-semibold'>₹ {totalAmount}</p>
//                         <Divider />
//                         <p className='text-xs font-semibold text-gray-600'>Participants</p>
//                         {
//                             participants.map((participant, index) => (
//                                 <div key={index} className='flex justify-between items-center mt-2'>
//                                     <p className='text-sm'>{participant.name}</p>
//                                     <div>
//                                         <p className={`text-sm ${participant.status === 'accepted' ? 'text-green-500' : participant.status === 'pending' ? 'text-yellow-500' : 'text-red-500'}`}>
//                                             {participant.status}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))
//                         }
//                         <Divider />
//                         <p className='text-xs font-semibold text-gray-600'>Host</p>
//                         <p className='text-lg font-semibold'>{hostName}</p>
//                         <p className='text-xs mt-1'>Paid at {paidAt}</p>
//                         <p className='text-xs mt-1'>Transaction Id: {transactionId}</p>
//                         <p className='text-xs mt-1'>Description: {description}</p>
//                         <p className='text-xs mt-1'>Status: {cashbackStatus}</p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TransactionDetails;


export default function TransactionDetails() {
    return (
        <></>
    )
}