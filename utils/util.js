const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

function formatDate(str) {
  var date = new Date(str);
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  let monthStr = month<10?'0':''
  let dayStr = day<10?'0':''

  // return "" + year + "-" + monthStr + month + "-" + dayStr + day
  return "" + year + "-" + monthStr + month + "-" + dayStr + day
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  formatDate
}
