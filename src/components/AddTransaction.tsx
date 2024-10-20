import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Drawer, Card } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { InputNumber, Input } from 'antd';
import { collection, getDocs, runTransaction } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';
import { addDoc, serverTimestamp } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

const AddTransaction: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false); // New state to track form validity
    const amountInputRef = React.createRef<any>();

    // Validate the form whenever the inputs change
    useEffect(() => {
        if (description && totalAmount && selectedUsers.length > 0) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [description, totalAmount, selectedUsers]);

    useEffect(() => {
        if (visible) {
            setTimeout(() => {
                amountInputRef.current?.focus();
            }, 500);
        }
    }, [visible]);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // remove the current user from the list
        const currentUser = auth.currentUser;
        const filteredUsers = users.filter(user => user.id !== currentUser?.uid);
        setUsers(filteredUsers);
    };

    const handleUserSelect = (userId: string) => {
        setSelectedUsers(prevSelectedUsers => {
            if (prevSelectedUsers.includes(userId)) {
                return prevSelectedUsers.filter(id => id !== userId);
            } else {
                return [...prevSelectedUsers, userId];
            }
        });
    };

    const handleProceed = async () => {
        setLoading(true);
        try {
            const hostId = auth.currentUser?.uid;
            if (!hostId) {
                throw new Error('Host ID not found');
            }

            await createTransaction(hostId, selectedUsers, totalAmount || 0);
            setVisible(false);
            setTotalAmount(null);
            setDescription("");
            setSelectedUsers([]);
        } catch (error) {
            console.error("Error adding transaction: ", error);
        } finally {
            setLoading(false);
        }
    };

    async function createTransaction(hostId: string, participants: string[], totalAmount: number) {
        const transactionRef = doc(collection(db, 'transactions'));

        try {
            await runTransaction(db, async (transaction) => {
                const limitRef = doc(db, 'limits', hostId);
                const limitDoc = await transaction.get(limitRef); // Perform the read first

                if (!limitDoc.exists()) {
                    throw new Error(`Limit document for user ${hostId} does not exist.`);
                }

                const currentLimit = limitDoc.data().availableLimit;
                const perPersonAmount = totalAmount / (participants.length + 1);
                const updatedLimit = currentLimit - perPersonAmount;

                if (updatedLimit < 0) {
                    throw new Error(`Insufficient limit for user ${hostId}`);
                }

                transaction.set(transactionRef, {
                    hostId: hostId,
                    description,
                    participants,
                    totalAmount,
                    perPersonAmount,
                    status: 'pending', // Initially all are pending
                    createdAt: serverTimestamp(),
                    cashbackStatus: 'pending'
                });

                participants.forEach(participantId => {
                    const requestRef = doc(collection(db, 'requests'));
                    transaction.set(requestRef, {
                        userId: participantId,
                        transactionId: transactionRef.id,
                        amount: perPersonAmount,
                        status: 'pending',
                        hostId: hostId,
                        createdAt: serverTimestamp()
                    });
                });

                transaction.update(limitRef, {
                    availableLimit: updatedLimit
                });

                console.log("Transaction, requests, and host limit update created successfully!");
            });
        } catch (error) {
            console.error("Transaction failed: ", error);
        }
    }

    return (
        <div>
            <div className='fixed z-[1000] bottom-8 left-1/2 transform -translate-x-1/2'>
                <Button className='z-[1000]' onClick={showDrawer} type='primary' icon={<PlusOutlined />} />
            </div>
            <Drawer
                title="Add Transaction"
                placement="bottom"
                height={"100%"}
                closable={true}
                onClose={onClose}
                visible={visible}
            >
                <div className='flex flex-col justify-center items-center'>
                    <p className='text-base mb-2'>Total amount</p>
                    <InputNumber
                        autoFocus
                        className='outline-none border-none'
                        prefix="₹"
                        ref={amountInputRef}
                        style={{
                            fontSize: '1.5rem',
                            borderBottom: '1px solid #000',
                            borderRadius: 0,
                        }}
                        onChange={(value) => setTotalAmount(value as number)}
                    />
                    <Input
                        className='mt-4 text-center'
                        placeholder="What's this for?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div className='mt-4'>
                    <h1 className='mb-4'>Split with</h1>
                    {users && (
                        <div className='max-h-[300px] overflow-auto flex flex-col gap-2'>
                            {users.map((contact) => (
                                <Card className='flex justify-between' key={contact.id}>
                                    <Checkbox
                                        checked={selectedUsers.includes(contact.id)}
                                        onChange={() => handleUserSelect(contact.id)}
                                    >
                                        <div>
                                            {contact.firstName} {contact.lastName}
                                        </div>
                                        <div>
                                            {contact.phoneNumber}
                                        </div>
                                    </Checkbox>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
                <Button
                    loading={loading}
                    type='primary'
                    className='w-full mt-4'
                    onClick={handleProceed}
                    disabled={!isFormValid} // Disable button if form is invalid
                >
                    Proceed
                </Button>
            </Drawer>
        </div>
    );
};

export default AddTransaction;
