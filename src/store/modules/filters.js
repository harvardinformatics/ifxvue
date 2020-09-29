import moment from 'moment'

export function humanDatetime(value) {
  let datestr = ''
  if (value) {
    datestr = moment(String(value)).format('M/DD/YYYY')
  }
  return datestr
}
export function centsToDollars(value) {
  let num = 0
  if (value) {
    num = `$${value / 100}`
  } else {
    num = `$${num}.00`
  }
  return num
}
export function capitalizeFirstLetter(rawValue) {
  const value = rawValue.toString()
  let str = ''
  if (value) {
    str = value.charAt(0).toUpperCase() + value.slice(1);
  }
  return str
}

export function emailDisplay(value) {
  let emailstr = ''
  if (value) {
    emailstr = value.replace('@', ' at ')
  }
  return emailstr
}
