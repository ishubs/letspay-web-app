import React from 'react';

interface NotificationStatusProps {
    isNotificationTurnedOn: boolean;
}

const NotificationStatus: React.FC<NotificationStatusProps> = ({ isNotificationTurnedOn }) => {
    return (
        <div className='flex items-center text-gray-600'>
            Notifications: <span className={`ml-1 font-semibold ${isNotificationTurnedOn ? 'text-green-500' : 'text-red-500'}`}>
                {isNotificationTurnedOn ? "on" : "off"}
            </span>
        </div>
    );
};

export default NotificationStatus; 