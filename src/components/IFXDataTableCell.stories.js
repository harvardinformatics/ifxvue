import IFXDataTableCell from './IFXDataTableCell.vue'

// Mock data for different item types
const mockUser = {
  id: 23,
  fullName: 'Alan Turing',
  email: 'alan@turing.com',
  dateJoined: '2024-01-15T10:30:00Z',
  created: '2024-01-15T10:30:00Z',
  updated: '2024-10-01T14:20:00Z',
  isActive: true,
  groups: ['Admin', 'Developers'],
  organization: 'Harvard FAS Informatics Department',
  comment: 'This is a test comment that might be very long and need truncation',
  active: 'true',
  parents: ['FAS', 'Harvard University'],
  rank: 'faculty',
}

const mockBillingRecord = {
  id: 101,
  user: {
    id: 23,
    fullName: 'Alan Turing',
  },
  loggedBy: {
    id: 45,
    fullName: 'Grace Hopper',
  },
  expenseCode: 'EXP-2024-001',
  expenses: [
    { code: 'TRAVEL-001' },
    { code: 'MEAL-002' },
  ],
  price: 15000, // cents
  pricePerLiter: 250, // cents
  creditPerLiter: 50, // cents
  scfPerLiter: 100, // cents
  deliveryDate: '2024-12-01T09:00:00Z',
  withdrawalDate: '2024-11-28T15:00:00Z',
  dateCreated: '2024-10-01T10:00:00Z',
  dateModified: '2024-10-05T14:30:00Z',
  dateValid: '2024-12-31T23:59:59Z',
  readingDate: '2024-10-15T08:00:00Z',
}

const mockMessage = {
  id: 301,
  message: 'This is a test message with some content that demonstrates how the message cell type displays information in the data table.',
  sent: '2024-10-01T12:00:00Z',
  recipients: {
    to: ['alan@turing.com', 'grace@hopper.com'],
    cc: ['admin@harvard.edu'],
    bcc: ['secret@example.com'],
  },
}

const mockContact = {
  id: 401,
  type: 'email',
  detail: 'contact@verylongdomainname.com',
}

export default {
  title: 'Components/IFXDataTableCell',
  component: IFXDataTableCell,
  tags: ['autodocs'],
}

// Text and ID cells
export const IDCell = {
  render: () => ({
    components: { IFXDataTableCell },
    setup() {
      return {
        header: { value: 'id', text: 'ID' },
        item: mockUser,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>ID Cell (clickable link)</h3>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
          <IFXDataTableCell 
            :header="header"
            :item="item"
            type="User"
            :page="1"
          />
        </div>
      </div>
    `,
  }),
}

export const EmailCell = {
  render: () => ({
    components: { IFXDataTableCell },
    setup() {
      return {
        header: { value: 'email', text: 'Email' },
        item: mockUser,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Email Cell (mailto link)</h3>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
          <IFXDataTableCell 
            :header="header"
            :item="item"
            type="User"
            :page="1"
          />
        </div>
      </div>
    `,
  }),
}

// Date cells
export const DateCells = {
  render: () => ({
    components: { IFXDataTableCell },
    setup() {
      const dateCells = [
        { value: 'dateJoined', text: 'Date Joined' },
        { value: 'created', text: 'Created' },
        { value: 'updated', text: 'Updated' },
        { value: 'dateCreated', text: 'Date Created' },
        { value: 'dateModified', text: 'Date Modified' },
        { value: 'deliveryDate', text: 'Delivery Date' },
      ]
      return {
        dateCells,
        item: { ...mockUser, ...mockBillingRecord },
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Date Cells (formatted with humanDatetime)</h3>
        <div style="margin-top: 16px;">
          <v-table>
            <thead>
              <tr>
                <th>Cell Type</th>
                <th>Formatted Output</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="header in dateCells" :key="header.value">
                <td><strong>{{ header.text }}</strong></td>
                <td>
                  <IFXDataTableCell 
                    :header="header"
                    :item="item"
                    type="User"
                    :page="1"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    `,
  }),
}

// Price cells
export const PriceCells = {
  render: () => ({
    components: { IFXDataTableCell },
    setup() {
      const priceCells = [
        { value: 'price', text: 'Price' },
        { value: 'pricePerLiter', text: 'Price Per Liter' },
        { value: 'creditPerLiter', text: 'Credit Per Liter' },
        { value: 'scfPerLiter', text: 'SCF Per Liter' },
      ]
      return {
        priceCells,
        item: mockBillingRecord,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Price Cells (cents to dollars)</h3>
        <div style="margin-top: 16px;">
          <v-table>
            <thead>
              <tr>
                <th>Cell Type</th>
                <th>Formatted Output</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="header in priceCells" :key="header.value">
                <td><strong>{{ header.text }}</strong></td>
                <td>
                  <IFXDataTableCell 
                    :header="header"
                    :item="item"
                    type="BillingRecord"
                    :page="1"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    `,
  }),
}

// Action buttons
export const ActionButtons = {
  render: () => ({
    components: { IFXDataTableCell },
    setup() {
      const actionCells = [
        { value: 'rowActionEdit', text: 'Edit Button' },
        { value: 'rowActionDetailEdit', text: 'Detail Edit Button' },
        { value: 'rowActionCopy', text: 'Copy Button' },
      ]
      return {
        actionCells,
        item: mockUser,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Action Button Cells</h3>
        <div style="margin-top: 16px;">
          <v-table>
            <thead>
              <tr>
                <th>Cell Type</th>
                <th>Button</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="header in actionCells" :key="header.value">
                <td><strong>{{ header.text }}</strong></td>
                <td>
                  <IFXDataTableCell 
                    :header="header"
                    :item="item"
                    type="User"
                    :page="1"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    `,
  }),
}

// Related objects
export const RelatedObjects = {
  render: () => ({
    components: { IFXDataTableCell },
    setup() {
      return {
        userHeader: { value: 'user', text: 'User' },
        loggedByHeader: { value: 'loggedBy', text: 'Logged By' },
        item: mockBillingRecord,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Related Object Cells (clickable links)</h3>
        <div style="margin-top: 16px;">
          <v-table>
            <thead>
              <tr>
                <th>Cell Type</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>User</strong></td>
                <td>
                  <IFXDataTableCell 
                    :header="userHeader"
                    :item="item"
                    type="BillingRecord"
                    :page="1"
                  />
                </td>
              </tr>
              <tr>
                <td><strong>Logged By</strong></td>
                <td>
                  <IFXDataTableCell 
                    :header="loggedByHeader"
                    :item="item"
                    type="BillingRecord"
                    :page="1"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    `,
  }),
}

// Special cells
export const SpecialCells = {
  render: () => ({
    components: { IFXDataTableCell },
    setup() {
      const specialCells = [
        { value: 'groups', text: 'Groups' },
        { value: 'organization', text: 'Organization (truncated)' },
        { value: 'comment', text: 'Comment (truncated)' },
        { value: 'message', text: 'Message (truncated)' },
        { value: 'expenseCode', text: 'Expense Code' },
        { value: 'parents', text: 'Parents' },
        { value: 'rank', text: 'Rank' },
        { value: 'active', text: 'Active' },
      ]
      return {
        specialCells,
        item: { ...mockUser, ...mockBillingRecord, ...mockMessage },
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Special Format Cells</h3>
        <div style="margin-top: 16px;">
          <v-table>
            <thead>
            <tr>
              <th>Cell Type</th>
              <th>Formatted Output</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="header in specialCells" :key="header.value">
              <td><strong>{{ header.text }}</strong></td>
              <td>
                <IFXDataTableCell
                  :header="header"
                  :item="item"
                  type="User"
                  :page="1"
                />
              </td>
            </tr>
            </tbody>
          </v-table>
        </div>
        <div style="margin-top: 20px; padding: 12px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
          <strong>⚠️ Known Issues in Storybook:</strong>
          <ul style="margin: 8px 0 0 20px;">
            <li><strong>Parents cell:</strong> Requires <code>$api.organization</code> mock (calls <code>formatOrganizationParents</code> from mixin)</li>
            <li><strong>Rank cell:</strong> Requires <code>$api.organization.getValidRankByValue()</code> mock (calls <code>formatOrganizationRank</code> from mixin)</li>
          </ul>
          <p style="margin-top: 8px; font-size: 14px; color: #856404;">These cells work correctly in the full application with the API configured.</p>
        </div>
      </div>
    `,
  }),
}

// Recipients cells
export const RecipientsCells = {
  render: () => ({
    components: { IFXDataTableCell },
    setup() {
      const recipientCells = [
        { value: 'to', text: 'To' },
        { value: 'cc', text: 'CC' },
        { value: 'bcc', text: 'BCC' },
      ]
      return {
        recipientCells,
        item: mockMessage,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Recipients Cells</h3>
        <div style="margin-top: 16px;">
          <v-table>
            <thead>
              <tr>
                <th>Cell Type</th>
                <th>Recipients</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="header in recipientCells" :key="header.value">
                <td><strong>{{ header.text }}</strong></td>
                <td>
                  <IFXDataTableCell 
                    :header="header"
                    :item="item"
                    type="Message"
                    :page="1"
                  />
                </td>
              </tr>
            </tbody>
          </v-table>
        </div>
      </div>
    `,
  }),
}

// Custom slot
export const CustomCell = {
  render: () => ({
    components: { IFXDataTableCell },
    setup() {
      return {
        header: { value: 'custom', text: 'Custom' },
        item: mockUser,
      }
    },
    template: `
      <div style="padding: 20px;">
        <h3>Custom Cell (using slot)</h3>
        <div style="margin-top: 16px; padding: 16px; border: 1px solid #ddd; border-radius: 4px;">
          <IFXDataTableCell 
            :header="header"
            :item="item"
            type="User"
            :page="1"
            :custom="true"
          >
            <template #custom>
              <v-chip color="primary" size="small">
                Custom Content: {{ item.fullName }}
              </v-chip>
            </template>
          </IFXDataTableCell>
        </div>
      </div>
    `,
  }),
}