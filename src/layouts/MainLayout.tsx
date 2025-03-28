import React from 'react';
import BottomNav from '../components/Navigation/BottomNav';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen pb-16"> {/* Add padding bottom to account for nav bar */}
            {children}
            <BottomNav />
        </div>
    );
};

export default MainLayout; 