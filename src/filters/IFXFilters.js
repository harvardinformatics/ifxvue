import moment from 'moment'

/**
 * Converts date value to a human-readable datetime
 * @param {date} value datetime
 * @returns {string} a date string
 */
export function humanDatetime(value) {
  let datestr = ''
  if (value) {
    datestr = moment(String(value)).format('M/DD/YYYY h:mm A')
  }
  return datestr
}

/**
 * Converts cents to dollars
 * @param {integer} cents
 * @returns {number} value in dollars
 */
export function centsToDollars(cents) {
  const dollars = cents / 100;
  return dollars.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

/**
 * Capitalizes the first letter
 * @param {any} rawValue
 * @returns {string} a converted string
 */
export function capitalizeFirstLetter(rawValue) {
  let str = ''
  if (rawValue) {
    const value = rawValue.toString()
    if (value) {
      str = value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
  return str
}

/**
 * Generates a friendly display value from an email
 * @param {string} value
 * @returns {string} convereted value
 */
export function emailDisplay(value) {
  let emailstr = ''
  if (value) {
    emailstr = value.replace('@', ' at ')
  }
  return emailstr
}

/**
 * Displays the state in a human-readable way
 * @param {string} value
 * @returns {string} converted value
 */
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

/**
 * Converts value to a date displayed as a column, using Moment
 * @param {date} value
 * @returns {string} datestring
 */
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
