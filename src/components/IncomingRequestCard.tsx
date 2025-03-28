// src/components/IncomingRequestCard.tsx

import React from 'react';
import { Avatar, Button, Card } from 'antd';
import { FormattedTime } from '../utils/helpers';
interface IncomingRequestCardProps {
  request: any; // Changed from Transaction to any to resolve the error
  loadingTransactionId: string | null;
  handleAccept: (requestId: string) => void;
  handleDecline: (requestId: string) => void;
}

const IncomingRequestCard: React.FC<IncomingRequestCardProps> = ({
  request,
  loadingTransactionId,
  handleAccept,
  handleDecline,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card
      className="shadow-sm hover:shadow-md transition-shadow duration-200"
      styles={{
        body: {
          padding: '16px',
          borderRadius: '12px',
          border: '1px solid #F3F4F6',
        },
      }}
    >
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar
          size={48}
          style={{
            backgroundColor: '#E5E7EB',
            color: '#374151',
            fontWeight: '600',
            flexShrink: 0,
          }}
        >
          {getInitials(request.hostName)}
        </Avatar>

        {/* Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-gray-900 m-0">
              {request.hostName}
            </h3>
            <span className="text-xl font-bold text-gray-900">
              ₹{request.amount.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Description */}
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-1" title={request.description}>
              {request.description}
            </p>
            <span className="text-xs text-gray-500">
              {FormattedTime(request.createdAt)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="default"
              onClick={() => handleDecline(request.id)}
              className="flex-1 text-gray-700 border-gray-300 hover:border-red-500 hover:text-red-500"
              disabled={loadingTransactionId === request.id}
              aria-label={`Decline request from ${request.hostName}`}
            >
              Decline
            </Button>
            <Button
              type="primary"
              onClick={() => handleAccept(request.id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              loading={loadingTransactionId === request.id}
              disabled={loadingTransactionId === request.id}
              aria-label={`Accept request from ${request.hostName}`}
            >
              Accept
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default IncomingRequestCard;