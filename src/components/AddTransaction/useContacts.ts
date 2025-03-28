import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { User } from '../../types';

export const useContacts = () => {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
        }));
        const currentUser = auth.currentUser;
        const filteredUsers = users.filter(user => user.id !== currentUser?.uid);
        setUsers(filteredUsers as User[]);
    };

    return { users };
}; 