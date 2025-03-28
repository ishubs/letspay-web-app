import React from 'react';
import { Button, Checkbox } from 'antd';

interface SuccessViewProps {
    transactionId: string | null;
    url: string | null;
    whatsappMessageSent: boolean;
    onWhatsappStatusChange: (checked: boolean) => void;
    onClose: () => void;
}

const SuccessView: React.FC<SuccessViewProps> = ({
    transactionId,
    url,
    whatsappMessageSent,
    onWhatsappStatusChange,
    onClose
}) => {
    return (
        <div className='flex flex-col justify-center text-center'>
            <img 
                className='h-[80px] mx-auto' 
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQWN-SLzk5eeEuA9zBJKzsM0qbvtLsKDfJ-w&s" 
                alt="Success"
            />
            <p className='text-center text-xl'>Transaction Successful</p>
            <p className='mt-2'>
                <span className='text-gray-500'>Transaction id: </span>
                {transactionId}
            </p>

            {url && (
                <div className='my-4'>
                    <Button
                        onClick={() => window.open(url, '_blank')}
                        className='m-0 p-0'
                        type='link'
                    >
                        Click here
                    </Button>
                    {' '}if you have not completed the whatsapp message step
                </div>
            )}

            <div>
                <Checkbox
                    checked={whatsappMessageSent}
                    onChange={(e) => onWhatsappStatusChange(e.target.checked)}
                    className='mt-4'
                >
                    I have completed the whatsapp message step
                </Checkbox>
            </div>
            <Button
                disabled={!whatsappMessageSent}
                className='mt-6'
                type='primary'
                onClick={onClose}
            >
                Close
            </Button>
        </div>
    );
};

export default SuccessView; 