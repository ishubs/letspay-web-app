import React from 'react';
import { Drawer, Button, Card } from 'antd';
import { auth } from '../../firebase';

interface UserDrawerProps {
    visible: boolean;
    onClose: () => void;
    upiId: string;
    onLogout: () => void;
}

const UserDrawer: React.FC<UserDrawerProps> = ({ visible, onClose, upiId, onLogout }) => {
    const currentUser = auth.currentUser;

    return (
        <Drawer placement="left" onClose={onClose} visible={visible}>
            <div className='flex flex-col gap-4 p-4'>
                <div className='border p-2 rounded-md'>{currentUser?.displayName}</div>
                <div className='border p-2 rounded-md'>{currentUser?.phoneNumber}</div>
                <div className='border p-2 rounded-md'>{upiId ? upiId : 'Add UPI ID'}</div>
                <Button onClick={onLogout} type="primary" className="bg-red-500 hover:bg-red-600">Logout</Button>
                <Card className='mt-4' title="Upcoming features">
                    <ol className='list-decimal'>
                        <li>View accepted requests in recent transactions</li>
                        <li>Retry rejected requests</li>
                        <li>Faster cashbacks</li>
                    </ol>
                </Card>
                <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center w-full'>v0.0.1.MVP</div>
            </div>
        </Drawer>
    );
};

export default UserDrawer; 