import ItemBase from '@/components/item/IFXItemBase'

// TODO: This class is probably redundant with IFXUser.js
export default class Person extends ItemBase {
  constructor(data) {
    super(data)
    // Setting primary email so that when updates are done, the correct Person field is updated
    this.data.primaryEmail = data.email || data.primary_email || ''
    // NOTE: values must be set here explicitly for nested forms to be reactive
    this.addresses = data.addresses || []
    this.contacts = data.contacts || []
  }

  get ifxid() {
    return this.data.ifxid
  }

  get firstName() {
    return this.data.first_name
  }

  set firstName(firstName) {
    this.data.first_name = firstName
  }

  get lastName() {
    return this.data.last_name
  }

  set lastName(lastName) {
    this.data.last_name = lastName
  }

  get fullName() {
    return this.data.full_name
  }

  set fullName(fullName) {
    this.data.full_name = fullName
  }

  get primaryEmail() {
    return this.data.primary_email
  }

  set primaryEmail(primaryEmail) {
    this.data.primary_email = primaryEmail
  }

  get primaryAffiliation() {
    return this.data.primary_affiliation
  }

  set primaryAffiliation(primaryAffiliation) {
    this.data.primary_affiliation = primaryAffiliation
  }

  get title() {
    return this.data.title
  }

  set title(title) {
    this.data.title = title
  }

  get changeComment() {
    return this.data.change_comment
  }

  get addresses() {
    return this.data.addresses
  }

  set addresses(addresses) {
    this.data.addresses = addresses
  }

  get affiliations() {
    return this.data.affiliations
  }

  set affiliations(affiliations) {
    this.data.affiliations = affiliations
  }

  get logins() {
    return this.data.logins
  }

  set logins(logins) {
    this.data.logins = logins
  }

  get contacts() {
    return this.data.contacts
  }

  set contacts(contacts) {
    this.data.contacts = contacts
  }

  get author() {
    return this.data.author
  }

  set author(author) {
    this.data.author = author
  }

  get citizenship() {
    return this.data.citizenship
  }

  set citizenship(citizenship) {
    this.data.citizenship = citizenship
  }

  get disability() {
    return this.data.disability
  }

  set disability(disability) {
    this.data.disability = disability
  }

  get ethnicity() {
    return this.data.ethnicity
  }

  set ethnicity(ethnicity) {
    this.data.ethnicity = ethnicity
  }

  get gender() {
    return this.data.gender
  }

  set gender(gender) {
    this.data.gender = gender
  }

  // get isDisabled() {
  //   return !this.isEnabled
  // }

  // set isDisabled(isDisabled) {
  //   this.data.is_enabled = !isDisabled
  // }

  get isEnabled() {
    return this.data.is_enabled
  }

  set isEnabled(isEnabled) {
    this.data.is_enabled = isEnabled
  }

  get nationalOrigin() {
    return this.data.national_origin
  }

  set nationalOrigin(nationalOrigin) {
    this.data.national_origin = nationalOrigin
  }

  get visaDetails() {
    return this.data.visa_details
  }

  set visaDetails(visaDetails) {
    this.data.visa_details = visaDetails
  }

  get url() {
    return this.data.url
  }

  set url(url) {
    this.data.url = url
  }

  get source() {
    return this.data.source
  }

  set source(source) {
    this.data.source = source
  }

  get race() {
    return this.data.race
  }

  set race(race) {
    this.data.race = race
  }
}
