import React, { useState, useEffect } from 'react';
import { Input, Button, Form, message, Typography } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { ConfirmationResult } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

const { Title, Text } = Typography;

interface VerifyOTPProps {
  verificationId: ConfirmationResult;
  setStep: React.Dispatch<React.SetStateAction<number>>;
  phoneNumber: string;
}

const VerifyOTP: React.FC<VerifyOTPProps> = ({ verificationId, setStep, phoneNumber }) => {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const verifyOtp = async (values: { otp: string }) => {
    setLoading(true);
    try {
      const result = await verificationId.confirm(values.otp);
      const user = result.user;
      message.success('User signed in');

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        message.success('User found, redirecting...');
        navigate('/');
      } else {
        message.info('New user, redirecting to onboarding...');
        navigate('/onboarding');
      }
    } catch (error) {
      console.error('Error verifying OTP', error);
      if (error instanceof FirebaseError) {
        message.error(`Firebase error: ${error.message}`);
      } else {
        message.error('Error verifying OTP');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = () => {
    setResendLoading(true);
    // TODO: Trigger Firebase resend OTP logic here
    setTimeout(() => {
      message.success('OTP resent successfully');
      setTimer(45);
      setResendLoading(false);
    }, 1000);
  };

  return (
    <div className="relative p-6 mt-10 w-full mx-auto bg-white rounded-2xl shadow-md">
      <ArrowLeftOutlined
        className="text-2xl absolute top-6 left-6 cursor-pointer text-gray-700"
        onClick={() => setStep(1)}
      />

      <Title level={3} className="mt-2 mb-4 text-center">Verify OTP</Title>

      <Text className="block text-gray-600 mb-2 text-center">
        Enter the 6-digit code sent to
      </Text>
      <div className="flex items-center justify-center mb-6">
        <Text strong className="text-lg">{phoneNumber}</Text>
        <EditOutlined className="ml-2 text-blue-500 cursor-pointer" onClick={() => setStep(1)} />
      </div>

      <Form onFinish={verifyOtp} layout="vertical">
        <Form.Item
          name="otp"
          label={<Text strong>OTP Code</Text>}
          rules={[
            { required: true, message: 'Please input your OTP!' },
            { len: 6, message: 'OTP must be 6 digits' },
          ]}
        >
          <Input
            autoFocus
            maxLength={6}
            size="large"
            className="text-center tracking-widest text-xl"
            placeholder="Enter OTP"
            inputMode="numeric"
          />
        </Form.Item>

        <div className="text-center text-gray-500 mb-4">
          {timer > 0 ? (
            <>Resend OTP in <span className="font-semibold">00:{timer < 10 ? `0${timer}` : timer}</span></>
          ) : (
            <Button
              type="link"
              onClick={resendOTP}
              loading={resendLoading}
              className="p-0 text-blue-600"
            >
              Resend OTP
            </Button>
          )}
        </div>

        <Form.Item>
          <Button
            loading={loading}
            className="w-full h-[56px] rounded-xl text-lg"
            type="primary"
            htmlType="submit"
          >
            Verify & Continue
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyOTP;
