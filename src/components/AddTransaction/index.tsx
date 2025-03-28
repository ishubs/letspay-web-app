import React from 'react';
import { Button, Drawer } from 'antd';
import AmountInput from './AmountInput';
import ContactList from './ContactList';
import SuccessView from './SuccessView';
import { useAddTransaction } from './useAddTransaction';

interface AddTransactionProps {
    visible: boolean;
    onClose: () => void;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ visible, onClose }) => {
    const {
        step,
        totalAmount,
        description,
        selectedUsers,
        loading,
        isFormValid,
        transactionId,
        whatsappMessageSent,
        url,
        handleAmountChange,
        handleDescriptionChange,
        handleUserSelect,
        handleProceed,
        handleClose,
        setWhatsappMessageSent
    } = useAddTransaction(onClose);

    return (
        <div>
            <Drawer
                title="Add Transaction"
                placement="bottom"
                height={"100%"}
                closable={true}
                onClose={handleClose}
                open={visible}
                styles={{
                    content: {
                        display: 'flex',
                        flexDirection: 'column',
                    },
                    body: {
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                        padding: '8px',
                    }
                }}
            >
                {step === 0 ? (
                    <>
                        <AmountInput
                            totalAmount={totalAmount}
                            description={description}
                            onAmountChange={handleAmountChange}
                            onDescriptionChange={handleDescriptionChange}
                        />
                        <ContactList
                            selectedUsers={selectedUsers}
                            onUserSelect={handleUserSelect}
                        />
                        <Button
                            loading={loading}
                            type='primary'
                            className='w-full my-8'
                            onClick={handleProceed}
                            disabled={!isFormValid}
                        >
                            Proceed
                        </Button>
                    </>
                ) : (
                    <SuccessView
                        transactionId={transactionId}
                        url={url}
                        whatsappMessageSent={whatsappMessageSent}
                        onWhatsappStatusChange={setWhatsappMessageSent}
                        onClose={handleClose}
                    />
                )}
            </Drawer>
        </div>
    );
};

export default AddTransaction; 