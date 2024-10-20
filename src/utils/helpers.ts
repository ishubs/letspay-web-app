import { Timestamp } from '../types';
import moment from 'moment';

export function FormattedDate(timestamp : Timestamp ) {
    const date = new Date(timestamp.seconds * 1000);
    const formattedDate = moment(date).format('Do MMM YYYY, h:mm A');
    return formattedDate
}