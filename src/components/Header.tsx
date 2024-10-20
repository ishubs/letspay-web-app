import profilepic from '../assets/profile-pic.png';
import { BellOutlined } from '@ant-design/icons';

import { Drawer, Button, Card } from 'antd';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const { logout, currentUser } = useAuth();


    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    return (
        <>
            <div className='flex px-4  justify-between sticky top-0 pt-8 pb-4 z-30 w-full bg-white'>
                <div className='flex justify-center items-center'>
                    <img
                        onClick={showDrawer}
                        src={profilepic} className='rounded-full h-10 w-10' />
                    <p className='ml-2'>{currentUser?.displayName}</p>
                </div>
                <BellOutlined className='text-2xl' />

            </div>
            <Drawer
                placement="left"
                onClose={onClose}
                visible={visible}
            >
                <div className='flex gap-2 flex-col'>
                    <div className='border p-2 rounded-md'>
                        {currentUser?.displayName}
                    </div>
                    <div className='border p-2 rounded-md'>
                        {currentUser?.phoneNumber}
                    </div>
                    <Button
                        onClick={logout}
                    >Logout</Button>
                    <Card className='mt-4' title="Upcoming features">
                        <ol className='list-decimal'>
                            <li>View accepted requests in recent transactions</li>
                            <li>Get real-time notifications</li>
                            <li>Faster cashbacks</li>
                        </ol>
                    </Card>
                    <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center w-full'>v0.0.1.MVP</div>
                </div>
            </Drawer>
        </>
    );
};

export default Header;