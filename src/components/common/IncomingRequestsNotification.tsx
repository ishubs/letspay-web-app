import React from 'react';
import { Card, Button } from 'antd';
import { BellOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowUp, ArrowUpRightFromSquare } from 'lucide-react';

interface IncomingRequestsNotificationProps {
    count: number;
}

const IncomingRequestsNotification: React.FC<IncomingRequestsNotificationProps> = ({ count }) => {
    const navigate = useNavigate();

    return (
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 shadow-md" 
        onClick={() => navigate('/incoming')}
        >
            <div className='flex justify-between items-center'>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-blue-500 flex items-center justify-center">
                            <BellOutlined className="text-lg sm:text-xl text-white" />
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">New Payment Requests</h3>
                            <p className="text-sm text-gray-600">You have {count} pending request{count > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>
                <div>
                    <ArrowRight />
                </div>
            </div>
        </Card>
    );
};

export default IncomingRequestsNotification; 