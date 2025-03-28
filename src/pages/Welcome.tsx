import React from 'react';
import { Button } from 'antd';
import { ArrowRightOutlined } from '@ant-design/icons';
import welcome from '../assets/welcome.svg';
import { useNavigate } from 'react-router-dom';
const Welcome: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className=' h-[100vh] p-4 flex flex-col justify-between'>
            <div></div>
            <div className='flex flex-col gap-8 text-center'>
                <h1 className='text-3xl text-center font-semibold'>Letspay</h1>
                <img className='h-1/2 w-1/2 mx-auto' src={welcome} />
                <p className='text-2xl font-semibold'>Easy group payments</p>
            </div>
            <Button
                className='w-full h-[50px] self-end mb-8 flex flex-row justify-between'
                type="primary"
                size='large'
                onClick={() => navigate('/login')}
            >
                <div></div>
                <div className='self-center'>    Get Started</div>
                <ArrowRightOutlined className='justify-end' />
            </Button>
        </div>
    );
};

export default Welcome;

// import React, { useState } from 'react';
// import { Card, Button, Progress, Typography } from 'antd';
// import { LeftOutlined, RightOutlined } from '@ant-design/icons';
// import { motion } from 'framer-motion';

// const { Title, Text } = Typography;

// const onboardingData = [
//   {
//     title: 'Welcome to LetsPay',
//     description: 'Effortlessly split payments with friends. No more awkward reminders.',
//     image: '/images/welcome.svg',
//   },
//   {
//     title: 'Split Bills Instantly',
//     description: 'Add expenses, tag friends, and get reimbursed instantly.',
//     image: '/images/split.svg',
//   },
//   {
//     title: 'Secure & Hassle-Free',
//     description: '256-bit secure payments with UPI and bank integration.',
//     image: '/images/security.svg',
//   },
//   {
//     title: 'Join 50,000+ Users',
//     description: 'Loved by groups, roommates, and friends who hang out often.',
//     image: '/images/community.svg',
//   },
//   {
//     title: 'Ready to Get Started?',
//     description: 'Takes less than 30 seconds to sign up.',
//     image: '/images/get-started.svg',
//   },
// ];

// const Onboarding: React.FC = () => {
//   const [current, setCurrent] = useState(0);
//   const isLast = current === onboardingData.length - 1;

//   const next = () => !isLast && setCurrent(current + 1);
//   const prev = () => current > 0 && setCurrent(current - 1);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-white px-4">
//       <Card
//         style={{ maxWidth: 500, width: '100%', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}
//         bodyStyle={{ padding: '32px' }}
//       >
//         <Progress percent={((current) / (onboardingData.length - 1)) * 100} showInfo={false} style={{ marginBottom: 24 }} />

//         <motion.div
//           key={current}
//           initial={{ opacity: 0, x: 100 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -100 }}
//           transition={{ duration: 0.5 }}
//         >
//           <div className="flex flex-col items-center text-center gap-6">
//             <img src={onboardingData[current].image} alt="illustration" style={{ width: 200, height: 200 }} />
//             <Title level={3}>{onboardingData[current].title}</Title>
//             <Text type="secondary">{onboardingData[current].description}</Text>
//           </div>
//         </motion.div>

//         <div className="flex justify-between items-center mt-8">
//           <Button icon={<LeftOutlined />} onClick={prev} disabled={current === 0}>
//             Back
//           </Button>

//           {isLast ? (
//             <div className="flex gap-4">
//               <Button>Explore as Guest</Button>
//               <Button type="primary">Get Started</Button>
//             </div>
//           ) : (
//             <Button type="primary" icon={<RightOutlined />} onClick={next}>
//               Next
//             </Button>
//           )}
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default Onboarding;
