import React from 'react';
import { InputNumber, Input } from 'antd';

interface AmountInputProps {
    totalAmount: number | null;
    description: string;
    onAmountChange: (value: number | null) => void;
    onDescriptionChange: (value: string) => void;
}

const AmountInput: React.FC<AmountInputProps> = ({
    totalAmount,
    description,
    onAmountChange,
    onDescriptionChange
}) => {
    return (
        <div className='flex flex-col justify-center items-center'>
            <p className='text-base mb-2'>Total amount</p>
            <div className='flex justify-center w-full'>
                <InputNumber
                    autoFocus
                    className='outline-none border-none text-center'
                    prefix={<span className="text-gray-400 text-base">₹</span>}
                    type="number"
                    pattern="[0-9]*"
                    value={totalAmount}
                    style={{
                        fontSize: '2rem',
                        borderRadius: 0,
                        border: 0,
                        width: 'auto',
                        minWidth: '120px',
                    }}
                    controls={false}
                    onChange={onAmountChange}
                />
            </div>
            <Input
                className='mt-4 text-center'
                placeholder="What's this for?"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
            <h1 className='mt-4 text-left self-start'>Split with</h1>
        </div>
    );
};

export default AmountInput; 