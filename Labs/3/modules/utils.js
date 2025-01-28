
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


function getDate(name, messageTemplate) {
    const options = {
        timeZone: 'America/Los_Angeles',
        weekday: 'short',  // "Wed"
        year: 'numeric',  // "2023"
        month: 'short',  // "Sept"
        day: 'numeric',  // "01"
        hour: '2-digit',  // "12"
        minute: '2-digit',  // "52"
        second: '2-digit',  // "14"
        hour12: false,
        timeZoneName: 'long'  // "Pacific Standard Time"
    };
    const currentDate = new Date().toLocaleString('en-US', options);

    // Replace %1 in the message template with the name and append the formatted date
    const message = messageTemplate.replace('%1', name);
    return `<p style="color:blue;">${message} ${currentDate.replace('Pacific Standard Time', 'GMT-0800 (Pacific Standard Time)')}</p>`;
}

module.exports = {
    getDate
};
