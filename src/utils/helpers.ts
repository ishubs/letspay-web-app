import moment from 'moment';

export function FormattedDate(timestamp : any) {

    console.log(timestamp);
    // Convert Firestore timestamp to milliseconds
    const date = new Date(timestamp.seconds * 1000);
    // Format the date using moment's format function
    const formattedDate = moment(date).format('Do MMM YYYY, h:mm A');
    console.log(formattedDate);
    return formattedDate
}