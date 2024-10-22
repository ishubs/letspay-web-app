import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';  // Import Firestore (db) and Firebase auth
import { doc, getDoc } from 'firebase/firestore';
import { ConfirmationResult } from 'firebase/auth';
interface VerifyOTPProps {
    verificationId: ConfirmationResult;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({ verificationId, setStep }) => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();  // Use navigate for redirection

    const verifyOtp = async () => {
        setLoading(true);
        try {
            const result = await verificationId.confirm(otp);
            const user = result.user;
            message.success('User signed in');

            // Check if user exists in Firestore
            const userDocRef = doc(db, 'users', user.uid);  // Firestore reference to users collection
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                // User exists, navigate to the home screen or wherever you want
                message.success('User found, redirecting...');
                navigate('/');  // Redirect to a protected route like Home
            } else {
                // User doesn't exist, navigate to the onboarding screen
                message.info('New user, redirecting to onboarding...');
                navigate('/onboarding');  // Redirect to onboarding screen
            }

        } catch (error) {
            console.error('Error verifying OTP', error);
            message.error('Error verifying OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1 className='text-2xl font-bold mb-4 mt-16'>Verify OTP</h1>
            <ArrowLeftOutlined className='absolute top-8 left-5'
                onClick={() => setStep(1)}
            />
            <Form onFinish={verifyOtp}>
                <Form.Item
                    name="otp"
                    rules={[{ required: true, message: 'Please input your OTP!' }]}
                >
                    <Input
                        type="number" pattern="[0-9]*"
                        value={otp} onChange={(e) => setOtp(e.target.value)} />
                </Form.Item>
                <Form.Item>
                    <Button loading={loading} className='w-full h-[60px]' type="primary" htmlType="submit">
                        Continue
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default VerifyOTP;
