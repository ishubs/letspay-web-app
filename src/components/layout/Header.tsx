import { BellOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import UserAvatar from './UserAvatar';
import NotificationStatus from './NotificationStatus';
import UserDrawer from './UserDrawer';
import InfoModal from './InfoModal';

interface HeaderProps {
    isNotificationTurnedOn: boolean;
}

const Header: React.FC<HeaderProps> = ({ isNotificationTurnedOn }) => {
    const [visible, setVisible] = useState(false);
    const [upiId, setUpiId] = useState('');
    const [notificationVisible, setNotificationVisible] = useState(false);
    const { logout, currentUser } = useAuth();
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    useEffect(() => {
        getUPIID();
    }, []);

    const getUPIID = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error('User not found');
            }

            const userRef = doc(db, 'users', user.uid);
            const userDoc = await getDoc(userRef);

            if (!userDoc.exists()) {
                throw new Error('User doc not found');
            }

            const userData = userDoc.data();
            if (userData?.upiId) {
                setUpiId(userData.upiId);
            }
        } catch (error) {
            console.error('Error getting UPI ID:', error);
        }
    };

    console.log(currentUser?.displayName)

    return (
        <>
            <div className='flex px-4 justify-between sticky top-0 pt-4 pb-4 z-30 w-full bg-white rounded-lg shadow-sm'>
                <div className='flex gap-2 items-center text-lg'>
                <UserAvatar displayName={currentUser?.displayName || ''} onClick={() => setVisible(true)} />
                    {currentUser?.displayName}
                    </div>
                <div className='flex gap-4 items-center'>
                    <NotificationStatus isNotificationTurnedOn={isNotificationTurnedOn} />
                    <InfoCircleOutlined
                        onClick={() => setIsInfoModalOpen(true)}
                        className='text-2xl cursor-pointer hover:text-blue-500 transition-colors duration-200'
                    />
                    {/* <BellOutlined
                        onClick={() => setNotificationVisible(true)}
                        className='text-2xl cursor-pointer hover:text-blue-500 transition-colors duration-200'
                    /> */}
                </div>
            </div>
            <UserDrawer visible={visible} onClose={() => setVisible(false)} upiId={upiId} onLogout={logout} />
            <InfoModal isOpen={isInfoModalOpen} onOk={() => setIsInfoModalOpen(false)} onCancel={() => setIsInfoModalOpen(false)} onGetHelp={() => {
                const url = `https://wa.me/+919346009605?text=I%20need%20help%20with%20Letspay`;
                window.open(url, '_blank');
            }} />
        </>
    );
};

export default Header;