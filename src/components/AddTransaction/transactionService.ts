import { doc, collection, runTransaction, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { message } from 'antd';

export const createTransaction = async (
    hostId: string,
    participants: string[],
    totalAmount: number,
    description: string
): Promise<string | null> => {
    const transactionRef = doc(collection(db, 'transactions'));

    try {
        await runTransaction(db, async (transaction) => {
            const limitRef = doc(db, 'limits', hostId);
            const limitDoc = await transaction.get(limitRef);

            if (!limitDoc.exists()) {
                throw new Error(`Limit document for user ${hostId} does not exist.`);
            }

            const currentLimit = limitDoc.data().availableLimit;
            if (currentLimit < totalAmount) {
                message.error(`Insufficient limit, available limit: ${currentLimit}`);
                throw new Error(`Insufficient limit, available limit: ${currentLimit}`);
            }

            const perPersonAmount = totalAmount / (participants.length + 1);
            const updatedLimit = currentLimit - perPersonAmount;

            if (updatedLimit < 0) {
                throw new Error(`Insufficient limit for user ${hostId}`);
            }

            transaction.set(transactionRef, {
                hostId,
                description,
                participants,
                totalAmount,
                perPersonAmount,
                status: 'pending',
                createdAt: serverTimestamp(),
                cashbackStatus: 'pending'
            });

            participants.forEach(participantId => {
                const requestRef = doc(collection(db, 'requests'));
                transaction.set(requestRef, {
                    userId: participantId,
                    transactionId: transactionRef.id,
                    amount: perPersonAmount,
                    description,
                    status: 'pending',
                    hostId,
                    createdAt: serverTimestamp()
                });
            });

            transaction.update(limitRef, {
                availableLimit: updatedLimit
            });
        });

        return transactionRef.id;
    } catch (error) {
        console.error("Transaction failed: ", error);
        return null;
    }
}; 