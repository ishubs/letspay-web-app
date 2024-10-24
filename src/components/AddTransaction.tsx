import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Drawer, Card, message, Alert } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { InputNumber, Input } from 'antd';
import { collection, getDocs, runTransaction } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { doc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { User } from '../types';

const AddTransaction: React.FC = () => {
    const [visible, setVisible] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [totalAmount, setTotalAmount] = useState<number | null>(null);
    const [description, setDescription] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false); // New state to track form validity
    const [step, setStep] = useState(0);
    const [transactionId, setTransactionId] = useState<string | null>(null);
    const amountInputRef = React.createRef<HTMLInputElement>();


    // Validate the form whenever the inputs change
    useEffect(() => {
        if (description && totalAmount && selectedUsers.length > 0) {
            setIsFormValid(true);
        } else {
            setIsFormValid(false);
        }
    }, [description, totalAmount, selectedUsers]);

    useEffect(() => {
        if (visible && amountInputRef.current) {
            setTimeout(() => {
                amountInputRef.current?.focus();
                amountInputRef.current?.click();
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
        setUsers(filteredUsers as User[]);
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
            const host = auth.currentUser
            const hostId = auth.currentUser?.uid;
            if (!hostId || !host) {
                throw new Error('Host ID not found');
            }

            const transactionId = await createTransaction(hostId, selectedUsers, totalAmount || 0);
            setTransactionId(transactionId);
            const message = `Cashback ₹${totalAmount} to ${auth.currentUser?.displayName} for ${description} with transaction id:${transactionId}, on ${host.phoneNumber}`;

            // const url = `https://wa.me/${host.phoneNumber}?text=${encodeURIComponent(message)}`;

            // window.open(url, '_blank');
            // const message = `Cashback ₹${totalAmount || 0} to ${displayName} for ${description} with transaction ID: ${transactionId}, on ${host.phoneNumber}`;

            const url = `https://wa.me/+919346009605?text=${encodeURIComponent(message)}`;

            // Create a temporary link element
            const link = document.createElement('a');
            link.href = url;
            link.target = '_blank'; // Open in new tab

            // Append to the body
            document.body.appendChild(link);

            // Programmatically click the link
            link.click();

            // Remove the link from the document
            document.body.removeChild(link);
            setTotalAmount(null);

            setDescription("");
            setSelectedUsers([]);
            // send a message to +91 9346009605 on whatsapp with the transaction details



        } catch (error) {
            console.error("Error adding transaction: ", error);
        } finally {
            setLoading(false);
        }
    };

    async function createTransaction(hostId: string, participants: string[], totalAmount: number): Promise<string | null> {
        const transactionRef = doc(collection(db, 'transactions'));

        try {
            await runTransaction(db, async (transaction) => {
                const limitRef = doc(db, 'limits', hostId);
                const limitDoc = await transaction.get(limitRef); // Perform the read first

                if (!limitDoc.exists()) {
                    throw new Error(`Limit document for user ${hostId} does not exist.`);
                }

                const currentLimit = limitDoc.data().availableLimit;
                // Check if the host has enough limit to create the transaction
                if (currentLimit < totalAmount) {
                    message.error(`Insufficient limit, available limit: ${currentLimit}`);
                    throw new Error(`Insufficient limit, available limit: ${currentLimit}`);
                }

                const perPersonAmount = totalAmount / (participants.length + 1);
                const updatedLimit = currentLimit - perPersonAmount;

                if (updatedLimit < 0) {
                    throw new Error(`Insufficient limit for user ${hostId}`);
                }

                // Set the transaction data
                transaction.set(transactionRef, {
                    hostId: hostId,
                    description,  // Assuming description is available in scope
                    participants,
                    totalAmount,
                    perPersonAmount,
                    status: 'pending', // Initially all are pending
                    createdAt: serverTimestamp(),
                    cashbackStatus: 'pending'
                });

                // Create request entries for each participant
                participants.forEach(participantId => {
                    const requestRef = doc(collection(db, 'requests'));
                    transaction.set(requestRef, {
                        userId: participantId,
                        transactionId: transactionRef.id,
                        amount: perPersonAmount,
                        description,
                        status: 'pending',
                        hostId: hostId,
                        createdAt: serverTimestamp()
                    });
                });

                // Update the host's available limit
                transaction.update(limitRef, {
                    availableLimit: updatedLimit
                });
                setStep(1);

                console.log("Transaction, requests, and host limit update created successfully!");
            });

            // Return the ID of the created transaction document
            return transactionRef.id;

        } catch (error) {
            console.error("Transaction failed: ", error);
            return null;  // In case of error, return null
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
                styles={{
                    content: {
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                    },
                    body: {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                    }
                }}
            >
                {step === 0 ? <>
                    <div className='flex flex-col justify-center items-center'>
                        <p className='text-base mb-2'>Total amount</p>
                        <InputNumber
                            autoFocus
                            className='outline-none border-none'
                            prefix="₹"
                            type="number" pattern="[0-9]*"
                            ref={amountInputRef}
                            value={totalAmount}
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
                    <div className='mt-4 flex flex-1 flex-col overflow-auto'>
                        <h1 className='mb-4'>Split with</h1>
                        {users && (
                            <div className=' flex flex-col gap-2'>
                                {users.map((contact) => (
                                    <Card className='flex justify-between ' key={contact.id}>
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
                </> :
                    <div className='flex flex-col justify-center text-center'>
                        <img className='h-[80px] mx-auto' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQWN-SLzk5eeEuA9zBJKzsM0qbvtLsKDfJ-w&s" />
                        <p className='text-center text-xl'>Transaction Successful</p>
                        <p className='mt-2'>
                            <span className='text-gray-500'>Transaction id: </span>
                            {transactionId}</p>

                        <Alert className='mt-4' message="Complete the whatsapp message step to recieve cashback faster" type="info" />
                        <Button className='mt-6' type='primary' onClick={() => {
                            setVisible(false)
                            setStep(0)
                        }}>Close</Button>
                    </div>}
            </Drawer>
        </div>
    );
};

export default AddTransaction;
