
// function getDate(name, messageTemplate) {

//     currentDate = new Date().toLocaleString();

//     const message = messageTemplate.replace('%1', name);
//     return `${message} ${currentDate}`;
// }

// module.exports = {
//     getDate
// };

// function getDate(name, messageTemplate) {
//     // Create a new Date object
//     const currentDate = new Date();

//     // Custom format the date as: Day Mon DD YYYY HH:MM:SS GMT-0800 (Pacific Standard Time)
//     const formattedDate = currentDate.toDateString() + ' ' + currentDate.toLocaleTimeString('en-US', {
//         hour12: false,
//         timeZoneName: 'short',
//         timeZone: 'America/Los_Angeles'
//     });

//     // Replace %1 in the message template with the name and append the formatted date
//     const message = messageTemplate.replace('%1', name);
//     return `${message} ${formattedDate}`;
// }

// module.exports = {
//     getDate
// };


// function getDate(name, messageTemplate) {
//     const currentDate = new Date();

//     // Create a date string that includes the required timezone offset for PST
//     const offset = currentDate.getTimezoneOffset() !== 480 ? -480 : currentDate.getTimezoneOffset(); // PST is UTC-8
//     const pstDate = new Date(currentDate.getTime() + offset * 60 * 1000);

//     // Custom format the date as: Day Mon DD YYYY HH:MM:SS GMT-0800 (PST)
//     const formattedDate = pstDate.toDateString() + ' ' + pstDate.toTimeString().split(' ')[0] + ' GMT-0800 (Pacific Standard Time)';

//     // Replace %1 in the message template with the name and append the formatted date
//     const message = messageTemplate.replace('%1', name);
//     return `${message} ${formattedDate}`;
// }

// module.exports = {
//     getDate
// };

function getDate(name, messageTemplate) {
    // Use toLocaleString to format the date directly in PST
    const options = {
        timeZone: 'America/Los_Angeles',
        weekday: 'short', // "Wed"
        year: 'numeric', // "2023"
        month: 'short', // "Sept"
        day: 'numeric', // "01"
        hour: '2-digit', // "12"
        minute: '2-digit', // "52"
        second: '2-digit', // "14"
        hour12: false,
        timeZoneName: 'short' // "PST"
    };
    const currentDate = new Date().toLocaleString('en-US', options);

    // Replace %1 in the message template with the name and append the formatted date
    const message = messageTemplate.replace('%1', name);
    return `${message} ${currentDate}`;
}

module.exports = {
    getDate
};

