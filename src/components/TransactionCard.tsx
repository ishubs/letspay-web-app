import React from 'react';
import { Card } from 'antd';
import { ArrowUpRight } from 'lucide-react';
import { FormattedTime } from '../utils/helpers';

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

interface TransactionCardProps {
    transaction: Transaction;
    onClick: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onClick }) => {
    return (
        <div className='flex flex-row border-b p-4 gap-4 cursor-pointer' onClick={onClick}>
            <div className='flex items-center'>
                <div className='bg-blue-100 p-2 rounded-lg'>
                    <ArrowUpRight />
                </div>
            </div>
            <div className='w-4/5 flex-1 flex flex-col'>
                <div className='flex justify-between items-center'>
                    <div className='text-lg'>{transaction.description}</div>
                </div>
                <div className='flex justify-between text-gray-500 text-sm'>
                    <span className='text-sm text-gray-500'>{FormattedTime(transaction.createdAt)}</span>
                </div>
            </div>
            <div className='text-lg flex items-center'>₹{transaction.totalAmount}</div>
        </div>
    );
};

export default TransactionCard; 