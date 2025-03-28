import React from 'react';
import { Card } from 'antd';
import { UserOutlined, TeamOutlined, WalletOutlined } from '@ant-design/icons';

const HowToUse: React.FC = () => {
    const steps = [
        {
            icon: <UserOutlined className="text-2xl md:text-3xl text-blue-500" />,
            title: "Become a Host",
            description: "Pay for your group of friends at restaurants, events, or any shared expenses"
        },
        {
            icon: <TeamOutlined className="text-2xl md:text-3xl text-green-500" />,
            title: "Split with Friends",
            description: "Add the transaction in Letspay, select contacts you want to split with"
        },
        {
            icon: <WalletOutlined className="text-2xl md:text-3xl text-purple-500" />,
            title: "Get Cashback",
            description: "Receive the entire bill amount instantly, while your share is added to your monthly bill"
        }
    ];

    return (
        <Card className="bg-gradient-to-br from-white to-blue-50 shadow-lg">
            <div className="text-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800">How Letspay Works</h2>
                <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">Simple, fast, and hassle-free bill splitting</p>
            </div>
            
            <div className="flex flex-col md:grid md:grid-cols-3 gap-4 md:gap-6">
                {steps.map((step, index) => (
                    <div 
                        key={index}
                        className="flex flex-row md:flex-col items-center text-left md:text-center p-3 md:p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300 relative"
                    >
                        <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-blue-50 flex items-center justify-center mr-4 md:mr-0 md:mb-4 flex-shrink-0">
                            {step.icon}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 md:mb-2">{step.title}</h3>
                            <p className="text-sm md:text-base text-gray-600">{step.description}</p>
                        </div>
                        {index < steps.length - 1 && (
                            <>
                                {/* Mobile line */}
                                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0.5 h-4 bg-gray-300 md:hidden"></div>
                                {/* Desktop line */}
                                <div className="hidden md:block absolute top-1/2 right-20 transform -translate-y-1/2">
                                    <div className="w-8 h-0.5 bg-gray-300"></div>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default HowToUse;