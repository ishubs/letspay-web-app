import React, { useState, useEffect, useRef } from 'react';
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
    const [inputWidth, setInputWidth] = useState(50);
    const amountInputRef = useRef<InputNumber | null>(null);  // Create a ref for the InputNumber element

    useEffect(() => {
        // Dynamically set width based on the number of digits
        const length = totalAmount?.toString().length || 1;
        // Adjust the multiplier for the width to make the input more responsive
        setInputWidth(Math.max(60, length * 44)); // You can tweak the multiplier for a better fit
       

    }, [totalAmount]);

    useEffect(()=>{

        setTimeout(() => {
            // Focus on the InputNumber when the component is mounted
            if (amountInputRef.current) {
                amountInputRef.current.focus();
            }
        }, 500)
    },[amountInputRef])

    return (
        <div className='flex flex-col justify-center items-center px-4 py-6'>
            <p className='text-sm text-gray-500 mb-2'>Enter Amount</p>
            <div className='relative flex items-center justify-center w-full'>
                <span className='text-3xl text-gray-500'>₹</span>
                <InputNumber
                    ref={amountInputRef}  // Assign the ref to the InputNumber
                    autoFocus
                    className='text-center text-5xl font-semibold tracking-wide outline-none border-none bg-transparent shadow-none'
                    type='number'
                    pattern='[0-9]*'
                    value={totalAmount}
                    controls={false}
                    placeholder='0'
                    variant='borderless'
                    style={{
                        border: 'none',
                        outline: 'none',
                        width: `${inputWidth}px`,
                        minWidth: '50px',  // Ensure minimum width
                        maxWidth: '200px', // Add a max width to prevent it from becoming too large
                        textAlign: 'center'
                    }}
                    onChange={onAmountChange}
                />
            </div>
            <Input
                className='mt-6 text-center text-lg py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder="What's this for?"
                value={description}
                onChange={(e) => onDescriptionChange(e.target.value)}
            />
            <h1 className='mt-6 text-left self-start font-medium text-gray-700'>Split with</h1>
        </div>
    );
};

export default AmountInput;
