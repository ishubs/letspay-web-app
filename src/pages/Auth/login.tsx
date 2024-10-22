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
        <div className='w-[100vw] p-4 h-full flex flex-col justify-center'>
            {step === 1 ? (
                <>
                    <h1 className='text-2xl font-bold mb-12 mt-8'>Login to Letspay</h1>
                    <h2 className='text-xl my-8 font-semibold'>Enter Mobile Number</h2>
                    <Form name="login" initialValues={{ remember: true }} onFinish={handlePhoneSignIn}>
                        <Form.Item
                            name="phone"
                            rules={[
                                { required: true, message: 'Please input your phone number!' },
                                { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit phone number!' }
                            ]}
                        >
                            <Input
                                type="number" pattern="[0-9]*"
                                className='w-full h-[60px] border-l-0 border-r-0 border-t-0 border-b-1 rounded-none'
                                prefix={<PhoneOutlined />}
                                placeholder="Phone Number"
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button className='h-[60px] text-xl' loading={loading} type="primary" htmlType="submit" block>
                                Proceed
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
