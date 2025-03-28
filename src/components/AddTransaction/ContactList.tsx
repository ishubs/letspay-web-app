import React from 'react';
import { Card } from 'antd';
import NoData from '../common/NoData';
import UserInitialsCheckbox from '../common/UserInitialsCheckbox';
import { useContacts } from './useContacts';

interface ContactListProps {
    selectedUsers: string[];
    onUserSelect: (userId: string) => void;
}

const ContactList: React.FC<ContactListProps> = ({ selectedUsers, onUserSelect }) => {
    const { users } = useContacts();

    return (
        <div className='mt-4 flex flex-1 flex-col overflow-auto'>
            {users.length === 0 && (
                <NoData description="No contacts found to split with" />
            )}
            {users && (
                <div className='flex flex-col gap-2'>
                    {users.map((contact) => (
                        <Card 
                            className='flex justify-between items-center cursor-pointer' 
                            key={contact.id}
                            onClick={() => onUserSelect(contact.id)}
                        >
                            <div className='flex items-center gap-4 w-full'>
                                <UserInitialsCheckbox
                                    name={`${contact.firstName} ${contact.lastName}`}
                                    selected={selectedUsers.includes(contact.id)}
                                    onClick={(e: Event) => {
                                        e.stopPropagation();
                                        onUserSelect(contact.id);
                                    }}
                                />
                                <div className='flex flex-col'>
                                    <div className='font-medium'>
                                        {contact.firstName} {contact.lastName}
                                    </div>
                                    <div className='text-gray-500 text-sm'>
                                        {contact.phoneNumber}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ContactList; 