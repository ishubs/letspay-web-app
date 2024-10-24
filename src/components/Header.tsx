import profilepic from '../assets/profile-pic.png';
import { BellOutlined, InfoCircleOutlined } from '@ant-design/icons';

import { Drawer, Button, Card, Modal, Alert } from 'antd';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext'

const Header: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [notificationVisible, setNotificationVisible] = useState(false);
    const { logout, currentUser } = useAuth();


    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const showNotificationDrawer = () => {
        setNotificationVisible(true);
    }

    const onCloseNotificationDrawer = () => {
        setNotificationVisible(false);
    }

    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    const handleOk = () => {
        setIsInfoModalOpen(false);
    };

    const handleCancel = () => {
        setIsInfoModalOpen(false);
    };

    const handleGetHelp = () => {
        const url = `https://wa.me/+919346009605?text=I%20need%20help%20with%20Letspay`;
        window.open(url, '_blank');

    }

    return (
        <>
            <div className='flex px-4  justify-between sticky top-0 pt-8 pb-4 z-30 w-full bg-white'>
                <div className='flex justify-center items-center'>
                    <img
                        onClick={showDrawer}
                        src={profilepic} className='rounded-full h-10 w-10' />
                    <p className='ml-2'>{currentUser?.displayName}</p>
                </div>
                <div className='flex gap-2'>
                    <InfoCircleOutlined
                        onClick={() => setIsInfoModalOpen(true)}
                        className='text-2xl'
                    />
                    <BellOutlined
                        onClick={showNotificationDrawer}
                        className='text-2xl' />
                </div>
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
            <Drawer
                placement="right"
                onClose={onCloseNotificationDrawer}
                visible={notificationVisible}
            >
                <div className='flex gap-2 flex-col'>
                    <p>coming soon</p>
                </div>
            </Drawer>
            <Modal title="How it works?" open={isInfoModalOpen} onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <div className='flex flex-col gap-2'>
                        <Button className='w-full' key="submit" type="primary" onClick={handleOk}>
                            OK
                        </Button>
                        <Button className='w-full' key="back" onClick={handleGetHelp}>
                            Get more help
                        </Button>
                    </div>
                ]}
            >
                <div className='p-4'>
                    <ol className='list-decimal flex flex-col gap-2'>
                        <li>You become a host and pay for a group of friends</li>
                        <li>You add the transaction in letspay, select contacts you want to split with</li>
                        <li>Letspay sends you the entire bill amount</li>
                        <li>Your share is added to your monthly bill</li>
                    </ol>

                    <Alert showIcon className='mt-8' message="Rejected amount by participants will be added to your bill" type="info" />
                </div>
            </Modal>
        </>
    );
};

export default Header;