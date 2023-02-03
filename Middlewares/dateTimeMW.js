
module.exports.getDateFormat=(date)=>{
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let currentDate = `${year}-${month}-${day}`;
    return currentDate;
}

module.exports.getTime= (time)=>{
    let day = new Date(time); 
    let timeNow= day.getHours().toString() + ":" +  day.getMinutes().toString() + ":"  +  day.getSeconds().toString();
    return timeNow;
}