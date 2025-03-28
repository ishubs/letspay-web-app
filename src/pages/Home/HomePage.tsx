import React from 'react';
import { Typography } from 'antd';

const { Title } = Typography;

const HomePage: React.FC = () => {
    return (
        <div className="p-4">
            <Title level={2}>Home</Title>
            {/* Add your home page content here */}
        </div>
    );
};

export default HomePage; 