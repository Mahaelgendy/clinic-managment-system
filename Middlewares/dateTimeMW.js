module.exports.getDateFormat=(date)=>{
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    return currentDate;
}
module.exports.getDateFromString=(stringdate)=>{
    
}
module.exports.getTime= (time)=>{
    let day = new Date(time); 
    let timeNow= day.getHours().toString() + ":" +  day.getMinutes().toString() + ":"  +  day.getSeconds().toString();
    return timeNow;
}

module.exports.getTimeFromString=(timeAsSting)=>{
    //hh:mm:ss as string
    console.log(timeAsSting);
    let timeAsArr = timeAsSting.split(':');
    let hours = timeAsArr[0];
    let minuts = timeAsArr[1];
    let seconds = timeAsArr[2];
    
    let date = new Date(2022, 0, 1);
    date.setHours(hours, minuts, seconds);
    return date;
}

module.exports.getDateTimeForSpecificDay=(time , dateAsString)=>{
    let day = new Date(dateAsString);
    time = new Date(time);
    return new Date(day.getFullYear(), day.getMonth(), day.getDate(),time.getHours(),time.getMinutes(),time.getSeconds());
}