import { useState, useEffect } from 'react';
import { message } from 'antd';
import { auth } from '../../firebase';
import { createTransaction } from './transactionService';
import { User } from '../../types';

export const useAddTransaction = (onClose: () => void) => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    const [step, setStep] = useState(0);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const [whatsappMessageSent, setWhatsappMessageSent] = useState(false);
    const [url, setUrl] = useState<string | null>(null);

    useEffect(() => {
        setIsFormValid(!!description && !!totalAmount && selectedUsers.length > 0);
    }, [description, totalAmount, selectedUsers]);

    const handleAmountChange = (value: number | null) => setTotalAmount(value);
    const handleDescriptionChange = (value: string) => setDescription(value);

    const handleUserSelect = (userId: string) => {
        setSelectedUsers(prev => 
            prev.includes(userId) 
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleProceed = async () => {
        setLoading(true);
        try {
            const host = auth.currentUser;
            if (!host?.uid) throw new Error('Host ID not found');

            const txId = await createTransaction(
                host.uid, 
                selectedUsers, 
                totalAmount || 0,
                description
            );
            setTransactionId(txId);

            const whatsappMessage = `Cashback ₹${totalAmount} to ${host.displayName} for ${description} with transaction id:${txId}, on ${host.phoneNumber}`;
            const whatsappUrl = `https://wa.me/+919346009605?text=${encodeURIComponent(whatsappMessage)}`;
            setUrl(whatsappUrl);
            window.open(whatsappUrl, '_blank');

            setStep(1);
        } catch (error) {
            console.error("Error adding transaction: ", error);
            message.error('Failed to create transaction');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setTotalAmount(null);
        setDescription("");
        setSelectedUsers([]);
        setStep(0);
        setWhatsappMessageSent(false);
        onClose();
    };

    return {
        step,
        totalAmount,
        description,
        selectedUsers,
        loading,
        isFormValid,
        transactionId,
        whatsappMessageSent,
        url,
        handleAmountChange,
        handleDescriptionChange,
        handleUserSelect,
        handleProceed,
        handleClose,
        setWhatsappMessageSent
    };
}; 