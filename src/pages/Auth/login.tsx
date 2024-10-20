import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import VerifyOTP from './VerifyOTP';
import { Navigate } from 'react-router-dom';
import { ConfirmationResult } from 'firebase/auth';

const LoginPage: React.FC = () => {
    const { signInWithPhone, setupRecaptcha, currentUser } = useAuth();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationId, setVerificationId] = useState<ConfirmationResult | undefined>();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handlePhoneSignIn = async () => {
        setLoading(true);
        try {
            setupRecaptcha('recaptcha-container');
            const confirmationResult = await signInWithPhone(`+91${phoneNumber}`, window.recaptchaVerifier);
            setVerificationId(confirmationResult);
            setStep(2);
        } catch (error) {
            console.error('Error sending OTP:', error);
        } finally {
            setLoading(false);
        }
    };

    console.log('currentUser:', currentUser);

    if (currentUser)
        return <Navigate to='/' />



    return (
        <div className='w-[100vw] p-4 h-[100vh] flex flex-col justify-center'>
            {step === 1 ? (
                <>
                    <h1 className='text-2xl font-bold mb-4'>Login</h1>
                    <Form name="login" initialValues={{ remember: true }} onFinish={handlePhoneSignIn}>
                        <Form.Item
                            name="phone"
                            rules={[
                                { required: true, message: 'Please input your phone number!' },
                                { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number!' }
                            ]}
                        >
                            <Input
                                className='w-full'
                                prefix={<PhoneOutlined />}
                                placeholder="Phone Number"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button loading={loading} type="primary" htmlType="submit" block>
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                    <div id="recaptcha-container"></div>
                </>
            ) : (
                <>
                    {verificationId && <VerifyOTP verificationId={verificationId} setStep={setStep} />}</>
            )}
        </div>
    );
};

export default LoginPage;
