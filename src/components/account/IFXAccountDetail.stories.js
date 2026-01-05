import IFXAccountDetail from './IFXAccountDetail.vue'

export default {
  title: 'Components/IFXAccountDetail',
  component: IFXAccountDetail,
  tags: ['autodocs'],
}

const Template = (args) => ({
  components: { IFXAccountDetail },
  setup() {
    return { args }
  },
  template: `<IFXAccountDetail v-bind="args" />`,
})

export const ActiveAccount = Template.bind({})
ActiveAccount.args = {
  id: '1',
  selectedAccount: {
    id: 1,
    name: 'Harvard Research Grant',
    accountType: 'Grant Account',
    code: 'HRG-2024-001',
    organization: 'Harvard University',
    validFrom: '2024-01-01T00:00:00Z',
    expirationDate: '2025-12-31T00:00:00Z',
    active: true,
    created: '2024-01-01T10:00:00Z',
    createdBy: { fullName: 'Admin User' },
    modified: '2024-06-15T14:30:00Z',
    modifiedBy: { fullName: 'Admin User' },
    userAccounts: [
      {
        id: 1,
        isValid: true,
        user: { fullName: 'John Smith' }
      },
      {
        id: 2,
        isValid: true,
        user: { fullName: 'Sarah Johnson' }
      }
    ],
    userProductAccounts: [
      {
        id: 1,
        isValid: true,
        user: { fullName: 'Michael Chen' },
        product: 'MRI Scanner',
        percent: 100
      },
      {
        id: 2,
        isValid: true,
        user: { fullName: 'Emily Davis' },
        product: 'fMRI Analysis',
        percent: 50
      }
    ]
  }
}

export const InactiveAccount = Template.bind({})
InactiveAccount.args = {
  id: '2',
  selectedAccount: {
    id: 2,
    name: 'Expired Research Fund',
    accountType: 'Expense Code',
    code: 'EXP-2023-042',
    organization: 'MIT',
    validFrom: '2023-01-01T00:00:00Z',
    expirationDate: '2023-12-31T00:00:00Z',
    active: false,
    created: '2023-01-01T10:00:00Z',
    createdBy: { fullName: 'Admin User' },
    modified: '2023-12-31T23:59:00Z',
    modifiedBy: { fullName: 'Admin User' },
    userAccounts: [
      {
        id: 3,
        isValid: false,
        user: { fullName: 'Old User' }
      }
    ],
    userProductAccounts: []
  }
}

export const NoExpiration = Template.bind({})
NoExpiration.args = {
  id: '3',
  selectedAccount: {
    id: 3,
    name: 'Permanent Department Fund',
    accountType: 'PO',
    code: 'PO-PERM-001',
    organization: 'Harvard CBS',
    validFrom: '2020-01-01T00:00:00Z',
    expirationDate: null,
    active: true,
    created: '2020-01-01T10:00:00Z',
    createdBy: { fullName: 'Admin User' },
    modified: '2024-01-15T09:00:00Z',
    modifiedBy: { fullName: 'Finance Admin' },
    userAccounts: [],
    userProductAccounts: [
      {
        id: 4,
        isValid: true,
        user: { fullName: 'Department Head' },
        product: 'All Equipment',
        percent: 100
      }
    ]
  }
}