import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
    PlusOutlined
} from '@ant-design/icons';
import AddTransaction from '../AddTransaction';
import { Home, Clock, Bell, IndianRupee } from 'lucide-react';

const BottomNav: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const getActiveClass = (path: string) => 
        location.pathname === path ? "text-blue-500" : "text-gray-600";

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe-area">
                <div className="flex justify-between items-center px-4 h-16">
                    <button 
                        onClick={() => navigate('/')} 
                        className={`flex flex-col items-center justify-center w-1/5 hover:text-blue-500 ${getActiveClass('/')}`}
                    >
                        <Home size={24} />
                        <span className="text-xs mt-1">Home</span>
                    </button>

                    <button 
                        onClick={() => navigate('/incoming')} 
                        className={`flex flex-col items-center justify-center w-1/5 hover:text-blue-500 ${getActiveClass('/incoming')}`}
                    >
                        <IndianRupee size={24}  />
                        <span className="text-xs mt-1">Requests</span>
                    </button>

                    <button 
                        onClick={showModal} 
                        className="flex flex-col items-center justify-cente relative -top-4"
                    >
                        <div className="bg-blue-500 p-3 h-[50px] w-[52px]  rounded-full shadow-lg">
                            <PlusOutlined className="text-2xl text-white" />
                        </div>
                        <span className="text-xs mt-1 text-gray-600">Add Bill</span>
                    </button>

                    <button 
                        onClick={() => navigate('/outgoing')} 
                        className={`flex flex-col items-center justify-center w-1/5 hover:text-blue-500 ${getActiveClass('/outgoing')}`}
                    >
                        <Bell size={24} />
                        <span className="text-xs mt-1">Alerts</span>
                    </button>

                    <button 
                        onClick={() => navigate('/history')} 
                        className={`flex flex-col items-center justify-center w-1/5 hover:text-blue-500 ${getActiveClass('/history')}`}
                    >
                        <Clock size={24}  />
                        <span className="text-xs mt-1">History</span>
                    </button>
                </div>
            </div>

            <AddTransaction 
                visible={isModalOpen} 
                onClose={handleClose}
            />
        </>
    );
};

export default BottomNav;
