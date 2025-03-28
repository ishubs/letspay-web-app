import React, { useState } from 'react';
import { Form, Input, Button, message, Typography } from 'antd';
import { PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../../contexts/AuthContext';
import VerifyOTP from './VerifyOTP';
import { ConfirmationResult } from 'firebase/auth';
import logopng from './../../assets/logo.png';

const { Title, Text } = Typography;

const LoginPage: React.FC = () => {
    const { signInWithPhone, setupRecaptcha } = useAuth();
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
            message.error('Error sending OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col justify-center p-6 bg-[#FAFAFA]">
            {step === 1 ? (
                <div>
                    <div className="flex justify-center mb-8">
                        <img src={logopng} alt="LetsPay Logo" className="w-28 h-auto" />
                    </div>

                    <Title level={2} className="text-center mb-2">Welcome to LetsPay</Title>
                    <Text className="block text-center text-gray-600 mb-8">
                        Split bills instantly. Get paid back in real-time.
                    </Text>

                    <Form layout="vertical" onFinish={handlePhoneSignIn}>
                        <Form.Item
                            label="Enter your mobile number"
                            name="phone"
                            rules={[
                                { required: true, message: 'Please input your phone number!' },
                                { pattern: /^\d{10}$/, message: 'Enter a valid 10-digit phone number!' }
                            ]}
                        >
                            <Input
                                type="tel"
                                pattern="[0-9]*"
                                maxLength={10}
                                className="h-[56px] text-lg rounded-lg"
                                size="large"
                                prefix={<PhoneOutlined />}
                                placeholder="Mobile Number"
                                value={phoneNumber}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '');
                                    if (value.length <= 10) setPhoneNumber(value);
                                }}
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                block
                                className="h-[56px] text-lg rounded-lg"
                                loading={loading}
                                disabled={phoneNumber.length !== 10}
                            >
                                Get OTP
                            </Button>
                        </Form.Item>
                    </Form>

                    <div id="recaptcha-container" className="mt-4"></div>
                </div>
            ) : (
                verificationId && (
                    <VerifyOTP 
                        verificationId={verificationId} 
                        setStep={setStep}
                        phoneNumber={phoneNumber}
                        setPhoneNumber={setPhoneNumber}
                    />
                )
            )}
        </div>
    );
};

export default LoginPage;
