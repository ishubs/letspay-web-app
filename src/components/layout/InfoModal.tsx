import React from 'react';
import { Modal, Button, Alert } from 'antd';

interface InfoModalProps {
    isOpen: boolean;
    onOk: () => void;
    onCancel: () => void;
    onGetHelp: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onOk, onCancel, onGetHelp }) => {
    return (
        <Modal title="How it works?" open={isOpen} onOk={onOk} onCancel={onCancel}
            footer={[
                <div className='flex flex-col gap-2'>
                    <Button className='w-full' key="submit" type="primary" onClick={onOk}>
                        OK
                    </Button>
                    <Button className='w-full' key="back" onClick={onGetHelp}>
                        Get more help
                    </Button>
                </div>
            ]}
        >
            <div className='p-4'>
                <ol className='list-decimal flex flex-col gap-2'>
                    <li>You become a host and pay for a group of friends</li>
                    <li>You add the transaction in Letspay, select contacts you want to split with</li>
                    <li>Letspay sends you the entire bill amount</li>
                    <li>Your share is added to your monthly bill</li>
                </ol>
                <Alert showIcon className='mt-8' message="Rejected amount by participants will be added to your bill" type="info" />
            </div>
        </Modal>
    );
};

export default InfoModal; 