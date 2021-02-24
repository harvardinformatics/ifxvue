import moment from 'moment'

export function humanDatetime(value) {
  let datestr = ''
  if (value) {
    datestr = moment(String(value)).format('M/DD/YYYY')
  }
  return datestr
}
export function centsToDollars(cents) {
  const dollars = cents / 100;
  return dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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

export function stateDisplay(value) {
  if (value) {
    const result = value
      .split('_')
      .map(e => capitalizeFirstLetter(e))
      .join(' ')
      .trim()
    return result
  }
  return ''
}

export function columnDate(value) {
  let datestr = ''
  if (value) {
    datestr = moment(String(value)).format('M/DD/YYYY')
  }
  return datestr
}

export default {
  humanDatetime,
  centsToDollars,
  capitalizeFirstLetter,
  emailDisplay,
  stateDisplay,
  columnDate
}
