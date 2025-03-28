import React from 'react';
import { CheckOutlined } from '@ant-design/icons';

interface UserInitialsCheckboxProps {
  name: string;
  selected: boolean;
  onClick: () => void;
  className?: string;
}

const UserInitialsCheckbox: React.FC<UserInitialsCheckboxProps> = ({
  name,
  selected,
  onClick,
  className = ''
}) => {
  // Get initials from name (takes first letter of each word)
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      onClick={onClick}
      className={`
        w-10 h-10 rounded-full flex items-center justify-center cursor-pointer
        transition-all duration-200 ease-in-out
        ${selected ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}
        ${className}
      `}
    >
      {selected ? (
        <CheckOutlined className="text-lg" />
      ) : (
        <span className="text-lg font-semibold">{initials}</span>
      )}
    </div>
  );
};

export default UserInitialsCheckbox; 