import React, { useEffect, useState } from 'react';
import { Modal, Button, Input, Alert, message } from 'antd';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';


const AddUPIIDModal: React.FC = () => {
    const [upiId, setUpiId] = useState('');
    const [visible, setVisible] = useState(false);
    const auth = useAuth()

    const onClose = () => {
        setVisible(false);
    };


    useEffect(() => {
        getUPIID()
    }, [])

    // write a function to get the upi id of the current user from the users collection

    const getUPIID = async () => {

        try {
            const user = auth.currentUser;

            if (!user) {
                throw new Error('User not found');
            }

            // get the user doc from the users collection
            const userRef = doc(db, 'users', user.uid)

            const userDoc = await getDoc(userRef)

            if (!userDoc.exists()) {
                throw new Error('User doc not found');
            }

            const userData = userDoc.data()
            if (!userData) {
                throw new Error('User data not found');
            }

            // if upi id is not present set visible to true

            if (!userData.upiId) {
                setVisible(true)
            } else {
                console.log('UPI ID:', userData.upiId);
            }

            console.log('UPI ID:', upiId);
        } catch (error) {
            console.error('Error getting UPI ID:', error);
        }
    }


    // write a function to get the current user from the users collection and add the upiId to the user doc

    const saveUPIID = async () => {

        try {
            const user = auth.currentUser;

            if (!user) {
                throw new Error('User not found');
            }

            // get the user doc from the users collection
            const userRef = doc(db, 'users', user.uid)

            // update the user doc with the upiId
            await updateDoc(userRef, {
                upiId,
            })

            onClose()

            console.log('UPI ID saved successfully');
            message.success('UPI ID saved successfully');
        } catch (error) {
            console.error('Error saving UPI ID:', error);
        }
    }

    return (
        <Modal
            title="Add UPI ID"
            visible={visible}
            onCancel={onClose}
            footer={[

                <Button disabled={upiId.length == 0 ? true : false} className='w-full' key="save" type="primary" onClick={saveUPIID}>
                    Save
                </Button>,
            ]}
        >
            <Alert className='my-4' message="Please enter your UPI ID to receive payments" type="info" />
            <Input
                placeholder="Enter UPI ID"
                value={upiId}
                required
                onChange={(e) => setUpiId(e.target.value)}
            />
        </Modal>
    );
};

export default AddUPIIDModal;