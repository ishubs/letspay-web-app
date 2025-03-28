import { Timestamp } from '../types';
import moment from 'moment';

export function FormattedDate(timestamp : Timestamp ) {
    const date = new Date(timestamp.seconds * 1000);
    const formattedDate = moment(date).format('Do MMM YYYY, h:mm A');
    return formattedDate
}

// write a function to format timestamp like 1 jan, 1:30 PM

export const FormattedTime = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};