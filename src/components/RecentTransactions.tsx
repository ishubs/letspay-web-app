import React, { useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Home: React.FC = () => {

    // const [transactions, setTransactions] = useState<any[]>([]);

    useEffect(() => {
        getRecentTransactions();
    }
        , []);

    const getRecentTransactions = async () => {
        // get the recent transactions from the database




        const user = auth.currentUser;
        if (user) {
            const transactionsRef = collection(db, 'transactions');
            const q = query(transactionsRef, where('hostId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            const transactions = querySnapshot.docs.map(doc => doc.data());
            console.log(transactions, "transactions");
        } else {
            console.log('No user is signed in');
        }
    }


    return (
        <div className='flex flex-col gap-2'>
            <h1>Recent Transactions</h1>
            {/* {
                transactions.map((cashback, index) => (
                    <Card className='flex flex-col gap-2 shadow-md'>
                        <div className='flex justify-between'>
                            <p>Shubham Giri</p>
                            <p>₹1000</p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Request from</p>
                            <p>Oct 5 2024, 12:45 AM</p>
                        </div>
                    </Card>
                ))
            }
            {
                transactions.length === 0 && <Alert message="No recent transactions" type="info" />
            } */}
        </div>
    );
};

export default Home;