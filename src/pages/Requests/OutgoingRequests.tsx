import React, { useState, useEffect } from 'react';
import { List, Card, Badge, Typography, Tag, Spin, Alert, Button } from 'antd';
import { collection, query, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import NoData from '../../components/common/NoData';
import { FormattedTime } from '../../utils/helpers';

const { Text } = Typography;

const NotificationScreen: React.FC = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    setError('Please log in to view notifications');
                    setLoading(false);
                    return;
                }
                const notificationsRef = collection(db, 'alerts', user.uid, 'notifications');
                const querySnapshot = await getDocs(query(notificationsRef));

                const notificationsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));

                notificationsData.sort((a, b) => b.timestamp.seconds - a.timestamp.seconds);
                setAlerts(notificationsData);
            } catch (err) {
                setError('Failed to load notifications');
            } finally {
                setLoading(false);
            }
        };

        fetchAlerts();
    }, []);

    if (loading) {
        return <Spin className="flex justify-center items-center h-screen" />;
    }

    if (error) {
        return <Alert message={error} type="error" showIcon />;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="sticky top-0 bg-white p-4 border-b z-10 flex justify-between">
                <Text strong>Notifications</Text>
                <Button type="link" size="small">Mark all as read</Button>
            </div>

            {alerts.length > 0 ? (
                <List
                    dataSource={alerts}
                    renderItem={(alert) => (
                        <List.Item className={`px-2 py-1 ${alert.read ? 'opacity-70' : 'bg-white'}`}>
                            <Card
                                className="w-full border-none rounded-lg shadow-sm"
                                bodyStyle={{ padding: '12px' }}
                            >
                                <div className="flex items-start gap-3">
                                    <Badge dot={!alert.read} color="blue">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                            <Text strong>{alert.fromUser[0]}</Text>
                                        </div>
                                    </Badge>
                                    <div className="flex-1">
                                        <div className='flex justify-between items-center'>
                                            <div>
                                                <Text strong className="block text-lg">{alert.fromUser}</Text>
                                                <Text className="">{alert.title}</Text>
                                            </div>
                                            <div className='text-xl font-semibold'>
                                            ₹{alert.amount}
                                            </div>
                                        </div>
                                        {/* <Text type="secondary" className="text-sm">{alert.body}</Text> */}
                                        <div className="flex justify-between items-center mt-2">
                                            <Text type="secondary" className="text-xs">{FormattedTime(alert.timestamp)}</Text>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </List.Item>
                    )}
                />
            ) : (
                <NoData description="No notifications yet" />
            )}
        </div>
    );
};

export default NotificationScreen;
