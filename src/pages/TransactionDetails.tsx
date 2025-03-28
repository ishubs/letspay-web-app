// import React, { useEffect } from 'react';
// import { ArrowLeftOutlined, CopyOutlined, ReloadOutlined } from '@ant-design/icons';
// import { Button, Divider, message, Tag } from 'antd';
// import { useLocation } from 'react-router-dom';
// import { FormattedDate } from '../utils/helpers';
// import { CashbackStatus, Timestamp } from '../types';
// import { getCashbackStatus, getUserName } from '../services/userService';
// import { doc, updateDoc } from 'firebase/firestore';
// import { db } from '../firebase';

// interface Participant {
//     id: string;
//     name: string;
//     status: string;
//     requestId: string;
// }

// interface TransactionDetailsProps {
//     description: string;
//     totalAmount: number;
//     createdAt: Timestamp;
//     cashbackStatus: CashbackStatus;
//     participants: Participant[];
//     perPersonAmount: number;
//     transactionId: string;
//     hostName: string;
//     amount: number;
// }

// const TransactionDetails = () => {
//     const { state } = useLocation();
//     const [transactionDetails, setTransactionDetails] = React.useState<TransactionDetailsProps | null>(state.request);

//     useEffect(() => {
//         setTxDetails();
//     }, []);

//     const setTxDetails = async () => {
//         const hostName = await getUserName(state.request.hostId);
//         const cashbackStatus = await getCashbackStatus(state.request.transactionId);
//         setTransactionDetails({
//             ...transactionDetails,
//             hostName,
//             cashbackStatus
//         } as TransactionDetailsProps);
//     };

//     const handleRetry = async (requestId: string) => {
//         try {
//             const requestRef = doc(db, 'requests', requestId);
//             await updateDoc(requestRef, { status: 'pending' });
//             message.success('Request sent successfully');
//         } catch (err) {
//             console.log(err);
//             message.error('Error retrying request');
//         }
//     };

//     const statusColors = {
//         pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//         success: 'bg-green-100 text-green-800 border-green-200',
//         rejected: 'bg-red-100 text-red-800 border-red-200'
//     };

//     return (
//         <div className="min-h-screen bg-gray-50">
//             {/* Header */}
//             <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 p-4">
//                 <ArrowLeftOutlined
//                     onClick={() => window.history.back()}
//                     className="text-white text-xl absolute top-4 left-4"
//                 />
//                 <div className="text-center pt-2 pb-4">
//                     <p className="text-white text-sm opacity-75">Cashback Status</p>
//                     <p className="text-white text-xl font-semibold capitalize">
//                         {transactionDetails?.cashbackStatus}
//                     </p>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="px-4 py-6 -mt-4">
//                 <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
//                     {/* Amount Section */}
//                     <div className="text-center mb-6">
//                         <p className="text-gray-600 text-sm font-medium">Total Amount</p>
//                         <p className="text-3xl font-bold text-gray-800 mt-1">
//                             ₹ {transactionDetails?.amount?.toLocaleString()}
//                         </p>
//                     </div>

//                     {/* Participants Section */}
//                     <div className="mb-6">
//                         <h3 className="text-gray-600 text-sm font-medium mb-3">Participants</h3>
//                         {transactionDetails?.participants.map((participant, index) => (
//                             <div
//                                 key={index}
//                                 className="flex items-center justify-between py-3 border-b last:border-b-0"
//                             >
//                                 <span className="text-gray-800 font-medium">{participant.name}</span>
//                                 <div className="flex items-center gap-2">
//                                     <Tag
//                                         className={`font-medium ${statusColors[participant.status as keyof typeof statusColors]}`}
//                                     >
//                                         {participant.status}
//                                     </Tag>
//                                     {participant.status === 'rejected' && (
//                                         <Button
//                                             onClick={() => handleRetry(participant.requestId)}
//                                             icon={<ReloadOutlined />}
//                                             size="small"
//                                             className="text-blue-600 border-blue-600"
//                                         >
//                                             Retry
//                                         </Button>
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>

//                     {/* Transaction Details */}
//                     <div>
//                         <h3 className="text-gray-600 text-sm font-medium mb-3">Details</h3>
//                         <div className="space-y-3">
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Host</span>
//                                 <span className="text-gray-800 font-medium">
//                                     {transactionDetails?.hostName}
//                                 </span>
//                             </div>
//                             {transactionDetails?.createdAt && (
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-600">Date</span>
//                                     <span className="text-gray-800">
//                                         {FormattedDate(transactionDetails.createdAt)}
//                                     </span>
//                                 </div>
//                             )}
//                             <div className="flex justify-between items-center">
//                                 <span className="text-gray-600">Transaction ID</span>
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-gray-800 text-sm">
//                                         {transactionDetails?.transactionId.slice(0, 8)}...
//                                     </span>
//                                     <CopyOutlined
//                                         className="text-gray-600 hover:text-blue-600"
//                                         onClick={() => {
//                                             navigator.clipboard.writeText(transactionDetails?.transactionId || "");
//                                             message.success('Transaction ID copied');
//                                         }}
//                                     />
//                                 </div>
//                             </div>
//                             <div className="flex justify-between">
//                                 <span className="text-gray-600">Description</span>
//                                 <span className="text-gray-800">
//                                     {transactionDetails?.description}
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TransactionDetails;

import React, { useEffect } from 'react';
import { ArrowLeftOutlined, CopyOutlined, ReloadOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Divider, message, Tag, Tooltip } from 'antd';
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
    const { state } = useLocation();
    const [transactionDetails, setTransactionDetails] = React.useState<TransactionDetailsProps | null>(state.request);

    useEffect(() => {
        setTxDetails();
    }, []);

    const setTxDetails = async () => {
        const hostName = await getUserName(state.request.hostId);
        const cashbackStatus = await getCashbackStatus(state.request.transactionId);
        setTransactionDetails({
            ...transactionDetails,
            hostName,
            cashbackStatus
        } as TransactionDetailsProps);
    };

    const handleRetry = async (requestId: string) => {
        try {
            const requestRef = doc(db, 'requests', requestId);
            await updateDoc(requestRef, { status: 'pending' });
            message.success({
                content: 'Request resent successfully',
                duration: 2,
            });
        } catch (err) {
            console.log(err);
            message.error({
                content: 'Failed to retry request',
                duration: 2,
            });
        }
    };

    const statusConfig = {
        pending: { color: '#F59E0B', bg: '#FEF3C7', label: 'Pending' },
       
        success: { color: '#10B981', bg: '#D1FAE5', label: 'Accepted' },
        accepted: { color: '#10B981', bg: '#D1FAE5', label: 'Accepted' },
        rejected: { color: '#EF4444', bg: '#FEE2E2', label: 'Declined' }
    };

    console.log(transactionDetails, )

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="flex items-center justify-between p-4">
                    <Button
                        type="text"
                        icon={<ArrowLeftOutlined />}
                        onClick={() => window.history.back()}
                        className="text-gray-600"
                        aria-label="Go back"
                    />
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-600">Status:</span>
                        <Tag
                            color={statusConfig[transactionDetails?.cashbackStatus as keyof typeof statusConfig]?.color}
                            className="font-medium capitalize"
                        >
                            {statusConfig[transactionDetails?.cashbackStatus as keyof typeof statusConfig]?.label}
                        </Tag>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 pt-4 pb-8">
                {/* Amount Card */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="text-center">
                        <p className="text-4xl font-bold text-gray-900 mb-2">
                            ₹ {transactionDetails?.amount?.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-500">Total Transaction Amount</p>
                        {transactionDetails?.createdAt && (
                            <p className="text-xs text-gray-400 mt-1">
                                {FormattedDate(transactionDetails.createdAt)}
                            </p>
                        )}
                    </div>
                </div>

                {/* Participants Section */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-base font-semibold text-gray-800">Participants</h2>
                        <Tooltip title="Amount split equally among participants">
                            <InfoCircleOutlined className="text-gray-400" />
                        </Tooltip>
                    </div>
                    {transactionDetails?.participants.map((participant, index) => (
                        <div
                            key={index}
                            className="flex items-center justify-between py-3 border-b last:border-b-0"
                        >
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-800">{participant.name}</p>
                                <p className="text-xs text-gray-500">
                                    ₹ {(transactionDetails?.amount / transactionDetails?.participants.length).toLocaleString('en-IN')}
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span
                                    className="text-xs font-medium px-2 py-1 rounded"
                                    style={{
                                        backgroundColor: statusConfig[participant.status as keyof typeof statusConfig]?.bg,
                                        color: statusConfig[participant.status as keyof typeof statusConfig]?.color
                                    }}
                                >
                                    {statusConfig[participant.status as keyof typeof statusConfig]?.label}
                                </span>
                                {participant.status === 'rejected' && (
                                    <Button
                                        type="link"
                                        icon={<ReloadOutlined />}
                                        onClick={() => handleRetry(participant.requestId)}
                                        className="text-blue-600 p-0"
                                        aria-label={`Retry request for ${participant.name}`}
                                    >
                                        Retry
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Transaction Info */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-base font-semibold text-gray-800 mb-4">Transaction Details</h2>
                    <div className="space-y-4 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Host</span>
                            <span className="text-gray-800 font-medium">{transactionDetails?.hostName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Transaction ID</span>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-800 font-mono text-xs">
                                    {transactionDetails?.transactionId.slice(0, 12)}...
                                </span>
                                <Tooltip title="Copy to clipboard">
                                    <CopyOutlined
                                        className="text-gray-500 hover:text-blue-600 cursor-pointer"
                                        onClick={() => {
                                            navigator.clipboard.writeText(transactionDetails?.transactionId || "");
                                            message.success('Transaction ID copied');
                                        }}
                                    />
                                </Tooltip>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Description</span>
                            <span className="text-gray-800 text-right max-w-[60%]">{transactionDetails?.description}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;


