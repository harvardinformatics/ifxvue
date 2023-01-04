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
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  return formatter.format(cents / 100)
}

/**
 * Display decimal as docllars
 * @param {number} dollars
 * @returns {number} value in dollars
 */
export function dollars(val) {
  const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
  return formatter.format(val)
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
      str = value.charAt(0).toUpperCase() + value.slice(1)
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
      .map((e) => capitalizeFirstLetter(e))
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

/**
 * Converts affiliation value to display name
 * @param {string} value
 * @returns {string} displayValue
 */
export function affiliationRoleDisplay(value) {
  let result = value
  const displayValues = {
    pi: 'PI',
    lab_manager: 'Lab Manager',
    member: 'Member',
    approver: 'Approver',
  }
  if (value && displayValues[value]) {
    result = displayValues[value]
  }
  return result
}

/**
 * Add spaces to a comma-separated list
 */
export function commaSpace(value) {
  let result = value
  if (value) {
    result = value.replaceAll(/,(\S)/g, ', $1')
  }
  return result
}

export function orgNameFromSlug(slug) {
  let result = slug
  if (slug) {
    const match = slug.match(/(.+?) \(a (.+?) (\S+)\)$/)
    if (match) {
      result = match[1]
    }
  }
  return result
}

export default {
  humanDatetime,
  centsToDollars,
  dollars,
  capitalizeFirstLetter,
  emailDisplay,
  stateDisplay,
  columnDate,
  affiliationRoleDisplay,
  commaSpace,
  orgNameFromSlug,
}
