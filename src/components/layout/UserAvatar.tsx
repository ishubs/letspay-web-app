import React from 'react';

interface UserAvatarProps {
    displayName?: string;
    onClick: () => void;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ displayName, onClick }) => {
    const getUserInitials = (name: string | undefined) => {
        if (!name) return '';
        return name.split(' ').map(word => word[0]).join('').toUpperCase();
    };

    return (
        <div className='flex items-center cursor-pointer' onClick={onClick}>
            <div className='w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold'>
                {getUserInitials(displayName)}
            </div>
        </div>
    );
};

export default UserAvatar; 