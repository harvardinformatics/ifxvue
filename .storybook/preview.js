import { setup } from '@storybook/vue3'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import IFXMixin from '../src/mixins/IFXMixin'
import IFXFilters from '../src/filters/IFXFilters'
import { createStore } from 'vuex'
import IFXDataTableCell from '../src/components/IFXDataTableCell.vue'
import IFXButton from '../src/components/IFXButton.vue'
import IFXPageHeader from '../src/components/page/IFXPageHeader.vue'
import IFXItemDataTable from '../src/components/item/IFXItemDataTable.vue'
import IFXSearchField from '../src/components/IFXSearchField.vue'
import IFXContactCard from '../src/components/contact/IFXContactCard.vue'


const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
  },
})

// Create a mock Vuex store for Storybook
const store = createStore({
  state: {
    message: '',
    isMessageActive: false,
    isActionRequired: false,
  },
  getters: {
    message: (state) => state.message,
    isMessageActive: (state) => state.isMessageActive,
    isActionRequired: (state) => state.isActionRequired,
  },
  mutations: {
    SHOW_MESSAGE(state, payload) {
      state.message = payload.message
      state.isMessageActive = true
      state.isActionRequired = payload.isActionRequired || false
    },
    DEACTIVATE_MESSAGE(state) {
      state.isMessageActive = false
      state.message = ''
      state.isActionRequired = false
    },
  },
  actions: {
    showMessage({ commit }, payload) {
      commit('SHOW_MESSAGE', payload)
    },
    deactivateMessage({ commit }) {
      commit('DEACTIVATE_MESSAGE')
    },
  },
})

// Mock storage
const mockStorage = {
  getItem: (key) => {
    return localStorage.getItem(key) ? parseInt(localStorage.getItem(key)) : null
  },
  setItem: (key, value) => {
    localStorage.setItem(key, value.toString())
  },
}

const mockAPI = {
  user: {
    canEditField: () => false,
    getList: async () => {
      console.log('user.getList() called')
      return [
        { id: 1, fullName: 'John Doe', email: 'john.doe@harvard.edu' },
        { id: 2, fullName: 'Jane Smith', email: 'jane.smith@harvard.edu' },
      ]
    },
    userRoles: [
      { text: 'Administrator', value: 'admin' },
      { text: 'Member', value: 'member' },
      { text: 'Viewer', value: 'viewer' },
    ]
  },
  authUser: {
    id: 1,
    fullName: 'Test User',
    email: 'test@harvard.edu',
  },
  auth: {
    isAdmin: false,
    can: (ability, user) => {
      // Mock permission check - for Storybook, return true to show all features
      console.log('Checking permission:', ability, user)
      return true // or false to test disabled state
    },
    getCurrentUserRecord: async () => ({
      id: 1,
      fullName: 'Test User',
      email: 'test@harvard.edu'
    })
  },
  account: {
    getByID: async (id) => {
      console.log('account.getByID called with:', id)
      const accounts = {
        '1': {
          id: 1,
          name: 'Harvard Research Grant',
          account_type: 'Grant Account',
          code: 'HRG-2024-001',
          organization: 'Harvard University',
          valid_from: '2024-01-01T00:00:00Z',
          expiration_date: '2025-12-31T00:00:00Z',
          active: true,
          created: '2024-01-01T10:00:00Z',
          created_by: { full_name: 'Admin User' },
          modified: '2024-06-15T14:30:00Z',
          modified_by: { full_name: 'Admin User' },
          user_accounts: [
            { id: 1, is_valid: true, user: { full_name: 'John Smith' } },
            { id: 2, is_valid: true, user: { full_name: 'Sarah Johnson' } }
          ],
          user_product_accounts: [
            { id: 1, is_valid: true, user: { full_name: 'Michael Chen' }, product: 'MRI Scanner', percent: 100 },
            { id: 2, is_valid: true, user: { full_name: 'Emily Davis' }, product: 'fMRI Analysis', percent: 50 }
          ]
        },
        '2': {
          id: 2,
          name: 'Expired Research Fund',
          account_type: 'Expense Code',
          code: 'EXP-2023-042',
          organization: 'MIT',
          valid_from: '2023-01-01T00:00:00Z',
          expiration_date: '2023-12-31T00:00:00Z',
          active: false,
          created: '2023-01-01T10:00:00Z',
          created_by: { full_name: 'Admin User' },
          modified: '2023-12-31T23:59:00Z',
          modified_by: { full_name: 'Admin User' },
          user_accounts: [
            { id: 3, is_valid: false, user: { full_name: 'Old User' } }
          ],
          user_product_accounts: []
        },
        '3': {
          id: 3,
          name: 'Permanent Department Fund',
          account_type: 'PO',
          code: 'PO-PERM-001',
          organization: 'Harvard CBS',
          valid_from: '2020-01-01T00:00:00Z',
          expiration_date: null,
          active: true,
          created: '2020-01-01T10:00:00Z',
          created_by: { full_name: 'Admin User' },
          modified: '2024-01-15T09:00:00Z',
          modified_by: { full_name: 'Finance Admin' },
          user_accounts: [],
          user_product_accounts: [
            { id: 4, is_valid: true, user: { full_name: 'Department Head' }, product: 'All Equipment', percent: 100 }
          ]
        }
      }
      return accounts[id] || accounts['1']
    },
    getList: async () => {
      console.log('account.getList() called')
      return [
        {
          id: 1,
          name: 'Harvard Research Grant',
          accountType: 'Grant Account',
          code: 'HRG-2024-001',
          organization: 'harvard',
          expirationDate: '2024-01-01T00:00:00Z',
          expiration_date: '2025-12-31T00:00:00Z',
          active: true,
          created: '2024-01-01T10:00:00Z',
          updated: '2024-06-15T14:30:00Z',
        },
        {
          id: 2,
          name: 'Expired Research Fund',
          accountType: 'Expense Code',
          code: 'EXP-2023-042',
          organization: 'mit',
          validFrom: '2023-01-01T00:00:00Z',
          expirationDate: '2023-12-31T00:00:00Z',
          active: false,
          created: '2023-01-01T10:00:00Z',
          updated: '2023-12-31T23:59:00Z',
        },
        {
          id: 3,
          name: 'Permanent Department Fund',
          accountType: 'PO',
          code: 'PO-PERM-001',
          organization: 'harvard',
          validFrom: '2020-01-01T00:00:00Z',
          expirationDate: null,
          active: true,
          created: '2020-01-01T10:00:00Z',
          updated: '2024-01-15T09:00:00Z',
        },
        {
          id: 4,
          name: 'Q4 Equipment Budget',
          accountType: 'Expense Code',
          code: 'EQ-Q4-2024',
          organization: 'stanford',
          validFrom: '2024-10-01T00:00:00Z',
          expirationDate: '2024-12-31T00:00:00Z',
          active: true,
          created: '2024-09-15T08:00:00Z',
          updated: '2024-11-20T16:45:00Z',
        }
      ]
    },
  },
  vars: {
    appName: 'ifxvue',
    appNameFormatted: 'IFXVue',
  },
  organization: {
    getValidRankByValue: (rank) => {
      // Mock organization ranks
      const ranks = {
        university: { text: 'University', value: 'university' },
        faculty: { text: 'Faculty', value: 'faculty' },
        department: { text: 'Department', value: 'department' },
        lab: { text: 'Lab', value: 'lab' },
      }
      return ranks[rank] || { text: rank, value: rank }
    },
    create: (data = {}) => ({
      name: '',
      rank: '',
      orgTree: 'Harvard',
      users: [],
      contacts: [],
      ...data
    }),
    getByID: async (id) => ({
      id: parseInt(id),
      name: 'Neuroscience Department',
      rank: 'Department',
      orgTree: 'Harvard',
      slug: 'neuroscience',
      created: '2024-01-01T10:00:00Z',
      created_by: { full_name: 'Admin User' },
      modified: '2024-06-15T14:30:00Z',
      modified_by: { full_name: 'Admin User' },
      users: [],
      contacts: []
    }),
    save: async (org) => {
      console.log('Saving organization:', org)
      return { data: { ...org, id: Date.now() } }
    },
    update: async (org) => {
      console.log('Updating organization:', org)
      return { data: org }
    },
    decompose: (org) => {
      // Return a plain object without computed properties
      return { ...org }
    },
    validRanks: [
      { text: 'University', value: 'University' },
      { text: 'School', value: 'School' },
      { text: 'Department', value: 'Department' },
      { text: 'Lab', value: 'Lab' },
      { text: 'Center', value: 'Center' },
    ],
    parseSlug: (slug) => {
      const orgs = {
        'harvard': { name: 'Harvard University', slug: 'harvard' },
        'mit': { name: 'MIT', slug: 'mit' },
        'stanford': { name: 'Stanford University', slug: 'stanford' },
      }
      return orgs[slug] || { name: slug, slug }
    }
  },
  organizationUser: {
    create: (data = {}) => ({
      user: null,
      role: '',
      ...data
    })
  },
  organizationContact: {
    create: (data = {}) => ({
      contact: null,
      role: '',
      type: null,
      detail: '',
      ...data
    }),
  },
  billingSummary: {
    getList: async () => [
      { id: 1, organization: 'Neuroscience Lab', totalDecimalCharge: 15000, usageHours: 50 },
      { id: 2, organization: 'Psychology Department', totalDecimalCharge: 8500, usageHours: 28 },
    ]
  },
  mailing: {
    getList: async () => [
      {
        id: 1,
        sent: '2024-12-10 14:30:00',
        subject: 'Monthly Lab Newsletter - December 2024',
        fromstr: 'admin@cbsn.harvard.edu',
        tostr: 'lab-members@cbsn.harvard.edu, students@cbsn.harvard.edu',
        ccstr: 'faculty@cbsn.harvard.edu',
        bccstr: '',
        message: '<p>Dear lab members,<br><br>This month we have exciting updates about our new MRI protocols...</p>',
        status: 'Sent',
      },
      {
        id: 2,
        sent: '2024-12-08 09:15:00',
        subject: 'Urgent: Equipment Maintenance This Weekend',
        fromstr: 'facilities@cbsn.harvard.edu',
        tostr: 'all-users@cbsn.harvard.edu',
        ccstr: '',
        bccstr: '',
        message: '<p>The 7T MRI will be offline for scheduled maintenance from Saturday 8am to Sunday 6pm.</p>',
        status: 'Sent',
      },
      {
        id: 3,
        sent: '2024-12-05 16:45:00',
        subject: 'New Research Participant Recruitment Guidelines',
        fromstr: 'ethics@cbsn.harvard.edu',
        tostr: 'principal-investigators@cbsn.harvard.edu, research-coordinators@cbsn.harvard.edu',
        ccstr: 'compliance@harvard.edu',
        bccstr: '',
        message: '<p>Please review the updated IRB guidelines for participant recruitment. All active studies must comply by January 1st, 2025.</p>',
        status: 'Sent',
      },
      {
        id: 4,
        sent: '2024-11-30 11:20:00',
        subject: 'Holiday Schedule and Lab Access',
        fromstr: 'admin@cbsn.harvard.edu',
        tostr: 'lab-members@cbsn.harvard.edu',
        ccstr: '',
        bccstr: '',
        message: '<p>The lab will have limited access during the winter break. Please plan your experiments accordingly.</p>',
        status: 'Sent',
      },
      {
        id: 5,
        sent: '2024-11-25 13:00:00',
        subject: 'Billing Reminders for November',
        fromstr: 'billing@cbsn.harvard.edu',
        tostr: 'lab-managers@cbsn.harvard.edu, finance-contacts@cbsn.harvard.edu',
        ccstr: '',
        bccstr: '',
        message: '<p>November billing records are now available. Please review and submit expense codes by December 5th.</p>',
        status: 'Sent',
      },
    ]
  },
  message: {
    getList: async () => {
      console.log('message.getList() called')
      return [
        {
          id: 1,
          name: 'welcome_message',
          displayName: 'Welcome Message',
          subject: 'Welcome to the Facility',
          message: 'Thank you for joining our facility. Here are some important details...',
        },
        {
          id: 2,
          name: 'billing_reminder',
          displayName: 'Billing Reminder',
          subject: 'Monthly Billing Reminder',
          message: 'This is a reminder that your monthly billing statement is available...',
        },
        {
          id: 3,
          name: 'safety_update',
          displayName: 'Safety Update',
          subject: 'Important Safety Procedures Update',
          message: 'We have updated our safety procedures. Please review the attached document...',
        },
      ]
    },
    getByID: async (id) => {
      const messages = [
        {
          id: 1,
          name: 'lab_meeting_reminder',
          displayName: 'Lab Meeting Reminder',
          subject: 'Weekly Lab Meeting',
          message: '<p>Hi team,</p><p>Weekly lab meeting reminder.</p>',
        },
        {
          id: 2,
          name: 'equipment_maintenance',
          displayName: 'Equipment Maintenance Notice',
          subject: 'Scheduled Maintenance',
          message: '<p>MRI scanner will be offline for maintenance.</p>',
        },
        {
          id: 3,
          name: 'safety_training',
          displayName: 'Safety Training Notification',
          subject: 'Annual Safety Training Required',
          message: '<p>Complete annual safety training by end of month.</p>',
        },
      ]
      return messages.find(m => m.id === parseInt(id))
    }
  },
  contact: {
    getList: async () => [
      {
        id: 1,
        key: 'contact_1',
        computedName: 'John Smith',
        name: 'John Smith',
        type: 'Email',
        detail: 'john.smith@harvard.edu',
        created: '2024-01-15T10:30:00Z',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@harvard.edu',
        phone: '617-555-0101',
        address: '123 Harvard St, Cambridge, MA 02138',
      },
      {
        id: 2,
        key: 'contact_2',
        computedName: 'Sarah Johnson',
        name: 'Sarah Johnson',
        type: 'Phone',
        detail: '617-555-0102',
        created: '2024-02-20T14:45:00Z',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.johnson@harvard.edu',
        phone: '617-555-0102',
      },
      {
        id: 3,
        key: 'contact_3',
        computedName: 'Michael Chen',
        name: 'Michael Chen',
        type: 'Email',
        detail: 'michael.chen@harvard.edu',
        created: '2024-03-10T09:15:00Z',
        firstName: 'Michael',
        lastName: 'Chen',
        email: 'michael.chen@harvard.edu',
        phone: '617-555-0103',
      },
    ],
    getByID: async (id) => {
      const contacts = [
        {
          id: 1,
          key: 'contact_1',
          computedName: 'John Smith',
          name: 'John Smith',
          type: 'Email',
          detail: 'john.smith@harvard.edu',
          created: '2024-01-15T10:30:00Z',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@harvard.edu',
          phone: '617-555-0101',
          address: '123 Harvard St, Cambridge, MA 02138',
        },
        {
          id: 2,
          key: 'contact_2',
          computedName: 'Sarah Johnson',
          name: 'Sarah Johnson',
          type: 'Phone',
          detail: '617-555-0102',
          created: '2024-02-20T14:45:00Z',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@harvard.edu',
          phone: '617-555-0102',
        },
        {
          id: 3,
          key: 'contact_3',
          computedName: 'Michael Chen',
          name: 'Michael Chen',
          type: 'Email',
          detail: 'michael.chen@harvard.edu',
          created: '2024-03-10T09:15:00Z',
          firstName: 'Michael',
          lastName: 'Chen',
          email: 'michael.chen@harvard.edu',
          phone: '617-555-0103',
        },
      ]
      return contacts.find(c => c.id === parseInt(id))
    },
    create: async (data) => {
      console.log('Creating contact:', data)
      return {
        id: null,
        name: '',
        detail: '',
        type: 'Email',
        email: '',
        phone: '',
        address: '',
        ...data
      }
    },
    save: async (contact) => {
      console.log('Saving contact:', contact)
      return { data: { ...contact, id: Date.now() } }
    },
    update: async (contact) => {
      console.log('Updating contact:', contact)
      return { data: contact }
    }
  },
  billingRecord: {
    getList: async (invoicePrefix, month, year, organization) => {
      console.log('billingRecord.getList() called:', invoicePrefix, month, year, organization)
      return [
        {
          id: 1,
          account: {
            id: 101,
            name: 'Smith Lab',
            slug: 'smith-lab',
            code: 'PO-12345',
            organization: 'harvard-neuroscience',
          },
          productUser: {
            id: 1,
            full_name: 'John Researcher',
          },
          product: 'fMRI Scanning',
          currentState: 'INIT',
          decimalCharge: 2500.00,
          decimalQuantity: 10.5,
          percent: 100,
          startDate: '2024-11-01T09:00:00Z',
          endDate: '2024-11-01T14:30:00Z',
          productUsage: {
            id: 501,
          },
          productUsageLinkText: 'Session #501',
          productUsageUrl: '/usage/501',
          description: 'fMRI scanning for cognitive study',
          transactions: [
            { id: 1, description: 'Initial charge', charge: 2500, rate: 250 }
          ],
          rate: 250,
          billingRecordStates: [
            { name: 'INIT', user: 'admin', approvers: [], comment: '' }
          ],
        },
        {
          id: 2,
          account: {
            id: 102,
            name: 'Jones Lab',
            slug: 'jones-lab',
            code: 'PO-67890',
            organization: 'harvard-neuroscience',
          },
          productUser: {
            id: 2,
            full_name: 'Jane Scientist',
          },
          product: 'MRI Scanning',
          currentState: 'LAB_APPROVED',
          decimalCharge: 1800.50,
          decimalQuantity: 7.25,
          percent: 100,
          startDate: '2024-11-05T10:00:00Z',
          endDate: '2024-11-05T13:15:00Z',
          productUsage: {
            id: 502,
          },
          productUsageLinkText: 'Session #502',
          productUsageUrl: '/usage/502',
          description: 'MRI structural imaging',
          transactions: [
            { id: 2, description: 'Scanning time', charge: 1800.50, rate: 250 }
          ],
          rate: 250,
          billingRecordStates: [
            { name: 'INIT', user: 'admin', approvers: [], comment: '' },
            { name: 'LAB_APPROVED', user: 'pi@example.com', approvers: [], comment: 'Approved' }
          ],
        },
        {
          id: 3,
          account: {
            id: 201,
            name: 'Brown Research',
            slug: 'brown-research',
            code: 'PO-11111',
            organization: 'mit-brain-cognitive-sciences',
          },
          productUser: {
            id: 3,
            full_name: 'Bob Postdoc',
          },
          product: 'EEG Recording',
          currentState: 'FINAL',
          decimalCharge: 950.00,
          decimalQuantity: 4.0,
          percent: 100,
          startDate: '2024-11-10T14:00:00Z',
          endDate: '2024-11-10T18:00:00Z',
          productUsage: {
            id: 503,
          },
          productUsageLinkText: null,
          productUsageUrl: null,
          description: 'EEG data collection',
          transactions: [
            { id: 3, description: 'EEG session', charge: 950, rate: 237.50 }
          ],
          rate: 237.50,
          billingRecordStates: [
            { name: 'INIT', user: 'admin', approvers: [], comment: '' },
            { name: 'LAB_APPROVED', user: 'pi@example.com', approvers: [], comment: 'Approved' },
            { name: 'FINAL', user: 'admin', approvers: [], comment: 'Finalized' }
          ],
        },
      ]
    },
    getByID: async (invoicePrefix, id) => ({
      id: parseInt(id),
      year: 2024,
      month: 12,
      description: 'MRI Scanner usage for research project',
      startDate: '2024-12-01T00:00:00Z',
      endDate: '2024-12-31T23:59:59Z',
      decimalCharge: 1250.00,
      rate: 15625,
      currentState: 'INIT',
      updated: '2024-12-15T10:30:00Z',
      productUsage: {
        product: 'MRI Scanner - 3T',
      },
      productUsageLinkText: 'View Usage Details',
      productUsageUrl: '/reservations/123/',
      account: {
        id: 1,
        slug: 'HRG-2024-001',
        account_type: 'Grant Account',
        organization: 'harvard',
        active: true,
      },
      billingRecordStates: [
        {
          id: 1,
          name: 'INIT',
          user: 'admin',
          comment: 'Initial creation',
          updated: '2024-12-01T09:00:00Z',
        },
      ]
    }),
    bulkUpdate: async (records, username) => {
      console.log('Bulk updating records:', records, 'by', username)
      return { data: records, error: null }
    },
    delete: async (record) => {
      console.log('Deleting record:', record)
      return { success: true }
    },
    create: (data) => ({
      ...data,
      addTransaction: function(transaction) {
        this.transactions = this.transactions || []
        this.transactions.push(transaction)
      }
    })
  },
  invoice: {
    generate: (prefix, month, year, orgs) => {
      return Promise.resolve({
        message: `Successfully generated ${orgs.length} invoice(s)`,
      })
    },
  },
  notifyLabManagers: (orgs, facility, year, month, recipientField, router) => {
    console.log('Notify lab managers called:', orgs, facility, year, month)
  },
  reviewLabManagerNotifications: (orgs, contacts, facility, year, month) => {
    return Promise.resolve({
      data: {
        successes: orgs.slice(0, 2),
        errors: {},
        nobrs: orgs.slice(2),
      },
    })
  },
  contactables: {
    getList: () => {
      return Promise.resolve([
        {
          text: 'John PI <john@harvard.edu>',
          name: 'John PI',
          email: 'john@harvard.edu',
          label: 'John PI <john@harvard.edu>',
          icon: 'mdi-account',
          color: 'blue'
        },
        {
          text: 'Jane Manager <jane@mit.edu>',
          name: 'Jane Manager',
          email: 'jane@mit.edu',
          label: 'Jane Manager <jane@mit.edu>',
          icon: 'mdi-account',
          color: 'green'
        },
      ])
    },
  },
  billingTransaction: {
    create: (data) => ({
      id: Date.now(),
      ...data
    })
  },
  calculateBillingMonth: async (facility, year, month, recalculate) => {
    console.log('Calculating billing month:', facility, year, month, recalculate)
    return {
      data: {
        successes: 15,
        failures: 0
      }
    }
  },
  getUsagesForFacility: async (facility, year, month) => {
    console.log('Getting usages for:', facility, year, month)
    return [
      {
        id: 1,
        year: parseInt(year),
        month: parseInt(month),
        organization: 'harvard',
        description: 'MRI Scanner Session - Research Study',
        productUser: { fullName: 'John Doe', id: 1 },
        product: { productName: 'MRI Scanner - 3T', id: 1 },
        billingRecords: [],
        processing: null
      },
      {
        id: 2,
        year: parseInt(year),
        month: parseInt(month),
        organization: 'mit',
        description: 'MRI Scanner Session - Clinical Trial',
        productUser: { fullName: 'Jane Smith', id: 2 },
        product: { productName: 'MRI Scanner - 7T', id: 2 },
        billingRecords: [{ currentState: 'DRAFT' }],
        processing: null
      },
      {
        id: 3,
        year: parseInt(year),
        month: parseInt(month),
        organization: 'harvard',
        description: 'Data Analysis Service',
        productUser: { fullName: 'Bob Johnson', id: 3 },
        product: { productName: 'Computation Time', id: 3 },
        billingRecords: [],
        processing: {
          resolved: false,
          errorMessage: 'No active account found for organization'
        }
      }
    ]
  },
  storage: {
    getItem: (key, type) => {
      console.log('Storage getItem:', key, type)
      return null
    },
    setItem: (key, value, type) => {
      console.log('Storage setItem:', key, value, type)
    }
  },
  facility: {
    getByID: async (id) => ({
      id: parseInt(id),
      name: 'Center for Brain Science Neuroimaging',
      invoicePrefix: 'CBSN',
      applicationUsername: 'cbsn_admin'
    }),
    getList: async (params) => {
      console.log('facility.getList called with:', params)
      return [
        {
          id: 1,
          name: 'Center for Brain Science Neuroimaging',
          invoicePrefix: 'CBSN',
          applicationUsername: 'cbsn_admin'
        },
        {
          id: 2,
          name: 'Bauer Core Facility',
          invoicePrefix: 'BAUER',
          applicationUsername: 'bauer_admin'
        }
      ]
    },
    isDecimalFacility: (name) => name.includes('Imaging'),
  },
  reportRun: {
    getList: async () => {
      console.log('reportRun.getList() called')
      return [
        {
          id: 1,
          report: 'Monthly Billing Summary',
          xlsFilePath: 'monthly_billing_2024_11.xlsx',
          xlsFileUrl: '/reports/monthly_billing_2024_11.xlsx',
          textFilePath: 'monthly_billing_2024_11.csv',
          textFileUrl: '/reports/monthly_billing_2024_11.csv',
          updated: '2024-11-15T14:30:00Z',
        },
        {
          id: 2,
          report: 'Annual Usage Report',
          xlsFilePath: 'annual_usage_2024.xlsx',
          xlsFileUrl: '/reports/annual_usage_2024.xlsx',
          textFilePath: 'annual_usage_2024.csv',
          textFileUrl: '/reports/annual_usage_2024.csv',
          updated: '2024-12-01T09:15:00Z',
        },
        {
          id: 3,
          report: 'Quarterly PI Report',
          xlsFilePath: 'quarterly_pi_q4_2024.xlsx',
          xlsFileUrl: '/reports/quarterly_pi_q4_2024.xlsx',
          textFilePath: 'quarterly_pi_q4_2024.csv',
          textFileUrl: '/reports/quarterly_pi_q4_2024.csv',
          updated: '2024-10-30T16:45:00Z',
        },
      ]
    },
    create: (data) => {
      // Factory method
      return data
    },
  },
  report: {
    getList: async () => {
      console.log('report.getList() called')
      return [
        {
          id: 1,
          name: 'Monthly Billing Summary',
          description: 'Summary of all billing records for a given month',
        },
        {
          id: 2,
          name: 'Annual Usage Report',
          description: 'Annual summary of facility usage by lab',
        },
        {
          id: 3,
          name: 'Quarterly PI Report',
          description: 'Quarterly report for Principal Investigators',
        },
      ]
    },
    runReport: async (params) => {
      console.log('report.runReport() called with:', params)
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000))
      return {
        data: {
          id: Math.floor(Math.random() * 1000) + 100,
          report: params.name,
          xlsFilePath: `${params.name.toLowerCase().replace(/ /g, '_')}_${params.date_range}.xlsx`,
          xlsFileUrl: `/reports/${params.name.toLowerCase().replace(/ /g, '_')}_${params.date_range}.xlsx`,
          textFilePath: `${params.name.toLowerCase().replace(/ /g, '_')}_${params.date_range}.csv`,
          textFileUrl: `/reports/${params.name.toLowerCase().replace(/ /g, '_')}_${params.date_range}.csv`,
          updated: new Date().toISOString(),
        },
      }
    },
  },
  urls: {
    ROOT_URL: 'http://localhost:8000/app/',
  }
}

// Mock Router
const mockRouter = {
  push: (location) => {
    console.log('Router push:', location)
  },
  replace: (location) => {
    console.log('Router replace:', location)
  },
  back: () => {
    console.log('Router back')
  },
  forward: () => {
    console.log('Router forward')
  },
  go: (n) => {
    console.log('Router go:', n)
  },
}

// Mock Route
const mockRoute = {
  query: { next: 'previous-page' },
  params: {},
  path: '/storybook',
  name: 'storybook',
  meta: {},
  hash: '',
  fullPath: '/storybook',
}


setup((app) => {
  app.use(vuetify)
  app.use(store)

  // Add global properties
  app.config.globalProperties.$api = mockAPI
  app.config.globalProperties.$router = mockRouter
  app.config.globalProperties.$route = mockRoute

  // Add global mixin
  app.mixin(IFXMixin)
  app.component('IFXSearchField', IFXSearchField)
  app.component('IFXDataTableCell', IFXDataTableCell)
  app.component('IFXButton', IFXButton)
  app.component('IFXPageHeader', IFXPageHeader)
  app.component('IFXItemDataTable', IFXItemDataTable)
  app.component('IFXContactCard', IFXContactCard)

  app.config.globalProperties.$columnDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  app.config.globalProperties.$humanDatetime = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  app.config.globalProperties.$dollars = (amount) => {
    if (!amount && amount !== 0) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }
  app.config.globalProperties.$centsToDollars = (cents) => {
    if (!cents && cents !== 0) return 'N/A'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(cents / 100)
  }
  app.config.globalProperties.$stateDisplay = (state) => {
    const stateMap = {
      'INIT': 'Initial',
      'LAB_APPROVED': 'Lab Approved',
      'FINAL': 'Final',
    }
    return stateMap[state] || state
  }
  app.config.globalProperties.formRules = {
    currency: [
      (v) => !!v || 'Required',
      (v) => !isNaN(parseFloat(v)) || 'Must be a number',
    ],
    generic: [
      (v) => !!v || 'Required',
    ],
  }
  if (!app.config.globalProperties.$api.getUsageReport) {
    app.config.globalProperties.$api.getUsageReport = (invoicePrefix, year, month, organization) => {
      console.log('Getting usage report:', invoicePrefix, year, month, organization)
      return Promise.resolve({
        data: {
          url: '/reports/usage-report-2024-11.pdf',
          filename: 'usage-report-2024-11.pdf',
        }
      })
    }
  }

  Object.keys(IFXFilters).forEach((name) => {
    app.config.globalProperties[`$${name}`] = IFXFilters[name]
  })
})

export default {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}