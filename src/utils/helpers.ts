import { Timestamp } from '../types';
import moment from 'moment';

export function FormattedDate(timestamp : Timestamp ) {
    const date = new Date(timestamp.seconds * 1000);
    const formattedDate = moment(date).format('Do MMM YYYY, h:mm A');
    return formattedDate
}

// write a function to format timestamp like 1 jan, 1:30 PM

export function FormattedTime(timestamp : Timestamp ) {
    const date = new Date(timestamp.seconds * 1000);
    const now = new Date();
    
    if (date.toDateString() === now.toDateString()) {
        return `Today, ${moment(date).format('h:mm A')}`;
    } else {
        return moment(date).format('Do MMM, h:mm A');
    }
}