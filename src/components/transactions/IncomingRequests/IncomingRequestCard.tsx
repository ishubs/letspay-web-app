import React from 'react';
import { Card, Avatar, Typography, Badge, Button, Space } from 'antd';
import Moment from 'react-moment';

const { Text } = Typography;

type IncomingRequestProps = {
  hostName: string;
  amount: number;
  description?: string;
  status: 'pending' | 'accepted' | 'declined';
  createdAt: { seconds: number; nanoseconds: number };
  onAccept: () => void;
  onDecline: () => void;
};

const IncomingRequestCard: React.FC<IncomingRequestProps> = ({
  hostName,
  amount,
  description,
  status,
  createdAt,
  onAccept,
  onDecline,
}) => {
//   const createdAtDate = new Date(createdAt.seconds * 1000);

  const statusColor =
    status === 'pending' ? 'orange' : status === 'accepted' ? 'green' : 'red';

  return (
    <Card className="shadow-sm rounded-lg w-full max-w-md">
      <Space align="start" className="w-full" direction="vertical">
        <Space align="center" className="w-full justify-between">
          <Space align="center">
            <Avatar>{hostName[0]}</Avatar>
            <div>
              <Text strong>{hostName}</Text>
              <br />
              <Text type="secondary">
                {/* <Moment fromNow>{createdAtDate}</Moment> */}
              </Text>
            </div>
          </Space>
          <Badge color={statusColor} text={status} />
        </Space>

        <div>
          <Text className="text-green-600 text-lg font-semibold">₹{amount}</Text>
          <br />
          <Text type="secondary">{description || 'No description provided'}</Text>
        </div>

        <Space className="w-full" size="middle">
          <Button
            type="primary"
            block
            style={{ backgroundColor: '#52c41a' }}
            onClick={onAccept}
          >
            Accept
          </Button>
          <Button
            danger
            block
            onClick={onDecline}
          >
            Decline
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default IncomingRequestCard;
