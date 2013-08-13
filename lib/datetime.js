function timeFormat(date){
  var str = date.toTimeString()
  return str.slice(0, str.indexOf(' '))
}
function dateFormat(date){
  return date.getFullYear() + '-' + (date.getMonth()+1) + '-'  + date.getDate()
}
function dateMinutes(date){
  return (date.getHours() * 60) + date.getMinutes()
}
function dateTimeFormat(date){
  return dateFormat(date) + ' ' + timeFormat(date)
}

exports.timeFormat = timeFormat
exports.dateFormat = dateFormat
exports.dateMinutes = dateMinutes
exports.dateTimeFormat = dateTimeFormat