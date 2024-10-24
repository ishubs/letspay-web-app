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