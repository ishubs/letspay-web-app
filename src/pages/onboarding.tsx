import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { setDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';


const Onboarding: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    // const user = auth.currentUser;
    const onFinish = async (values: { firstName: string; lastName: string }) => {
        setLoading(true);
        try {

            await updateProfile(auth.currentUser, { displayName: values.firstName }).catch(
                (err) => console.log(err)
            );

            // create an entry in the limit collection for the user
            // the object should have the following fields
            // - userId: the user's uid
            // - availableLimit: 0
            // - totalLimit: 0

            await setDoc(doc(db, 'limits', JSON.parse(localStorage.getItem('user') || '{}').uid), {
                userId: JSON.parse(localStorage.getItem('user') || '{}').uid,
                availableLimit: 2000,
                totalLimit: 2000,
            });


            const phoneNumber = JSON.parse(localStorage.getItem('user') || '{}').phoneNumber;
            if (!phoneNumber) {
                throw new Error('Phone number not found in localStorage');
            }

            console.log('Phone number:', phoneNumber);

            await setDoc(doc(db, 'users', JSON.parse(localStorage.getItem('user') || '{}').uid), {
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber,
                createdAt: new Date(),
                id: JSON.parse(localStorage.getItem('user') || '{}').uid,
            });

            setLoading(false);
            message.success('User created successfully');
            navigate('/home');
            // Handle success (e.g., navigate to another page or show a success message)
        } catch (error) {
            setLoading(false);
            console.error('Error creating user: ', error);
            // Handle error (e.g., show an error message)
        }
    };

    return (
        <div className='h-[100vh] flex flex-col justify-center w-full p-4'>
            <Form
                name="onboarding"
                onFinish={onFinish}
                layout="vertical"
            >
                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item>
                    <Button className='w-full' type="primary" htmlType="submit" loading={loading}>
                        Continue
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Onboarding;