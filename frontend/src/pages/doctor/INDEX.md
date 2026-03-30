# Doctor Pages - Nexus EHR Frontend

Complete set of 10 doctor pages for the Nexus EHR React+MUI application.

## Pages Overview

### 1. Dashboard.tsx
**Purpose:** Doctor home/landing page showing queue status and key metrics
- Queue banner with token tracking (Now Serving: 14, Up Next: 15-17)
- 4 stat cards: Today's Patients (30), Revenue (₹18,400), Device Reports (8), WhatsApp (15)
- Today's Schedule table with 8 appointments
- Pending Device Reports sidebar
- AI Insights card

### 2. Appointments.tsx
**Purpose:** Manage and view all appointments
- Walk-In and New Appointment buttons
- Appointments table (10 records)
- Queue Statistics sidebar
- Action buttons (Consult, Call)

### 3. Patients.tsx
**Purpose:** Patient directory and management
- Search bar with filtering
- Patients table with 8 mock records
- Columns: ID, Name, Age/Gender, Condition, ABHA ID, Last Visit
- View button for each patient

### 4. Encounter.tsx ⭐ MOST COMPLEX
**Purpose:** Complete patient encounter management
- Patient hero section with gradient background
- 5 tabs: SOAP Note, ENT Exam, Timeline, Reports, Prescriptions
- SOAP Note: Chief Complaint, HPI, Examination, AI Diagnosis
- ENT Exam: Ear, Nose, Throat findings in 3-column grid
- Timeline: Vertical patient history timeline
- Reports: Report list and upload zone
- Prescriptions: AI suggested medications

### 5. Prescriptions.tsx
**Purpose:** Prescription builder and management
- 6 ENT prescription templates
- Current prescription list with add/delete
- Left/Right split: Builder + Prescription Pad Preview
- Realistic prescription paper styling
- Print functionality with QR code

### 6. DeviceReports.tsx
**Purpose:** Medical device report management
- Taevas Agent Status (version, devices, reports count)
- Universal Ingestion drop zone
- Pending Review section (3 reports)
- Audiogram, VNG, CBC mock reports

### 7. Family.tsx
**Purpose:** Family health management
- Family info card (Sharma family, 4 members)
- Family member cards with conditions
- AI Family Health Insight (gradient card)
- Family health summary table
- Stats: Visits, Spend, ABHA linked, WhatsApp active

### 8. Billing.tsx
**Purpose:** Financial and billing management
- 4 stat cards: Today (₹18,400), Month (₹2.1L), Bills (23), Pending (₹3,200)
- Today's Bills table (6 mock invoices)
- GST & Export card
- DHIS Credits display

### 9. WhatsApp.tsx
**Purpose:** WhatsApp bot and automation management
- Chat interface (600px height) with mock conversation
- Taevas Bot header
- Chat messages with bot/user differentiation
- Bot Performance card (47 messages, 6 appointments, 4 reports, 78% automation)
- Bot Settings with toggles

### 10. Marketing.tsx
**Purpose:** Practice marketing and online presence
- Practice Page status and preview
- Practice URL display
- Practice page mockup (gradient, rating, CTA)
- AI Social Content Generator
- Recent and all reviews section

## Design Specifications

### Brand Colors
- Primary: `#5519E6` (Purple)
- Secondary: `#A046F0` (Light Purple)
- Success: `#CDDC50` (Lime Green)
- Warning: `#FF8232` (Orange)
- Social: `#25D366` (WhatsApp Green)

### Component Structure
All pages follow this pattern:
```tsx
import DashboardLayout from '@/components/layout/DashboardLayout';

const PageName: React.FC = () => {
  return (
    <DashboardLayout pageTitle="Title">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        {/* Content */}
      </Container>
    </DashboardLayout>
  );
};

export default PageName;
```

### Common MUI Components Used
- Layout: Box, Container, Grid, Stack
- Display: Card, CardContent, Typography, Paper
- Form: TextField, Select, MenuItem, FormControl, RadioGroup
- Interaction: Button, Chip, IconButton, Tab, Tabs
- Data: Table, TableHead, TableBody, TableRow, TableCell
- Media: Avatar, Rating
- Input: InputAdornment, FormControlLabel

### MUI Icons Used
QueueMusic, TrendingUp, Assignment, WhatsApp, ManageAccounts, AlertCircle, Phone, PhoneIncomingOutlined, Mic, Edit, Send, Settings, MoreVert, CheckCircle, CloudUpload, FamilyRestroom, Favorite, People, Sparkles, Star, Share, AttachMoney, Receipt, FileDownload, CheckDouble, PublishedWithChanges, Copy, Delete, Print, EmojiEvents, Cloud, Devices, and more...

## Mock Data
- Patient names: Anita Sharma, Rajiv Kumar, Priya Singh, Amit Patel, Neha Sharma, Vijay Desai, Kamala Devi, Deepak Kumar
- Indian healthcare context: ABHA IDs, ENT conditions, Blood types
- Realistic timings: 09:00 - 14:30 appointment slots
- Financial data: ₹800 - ₹11,650 per invoice
- Device names: Audecom, Equipoise VNG

## File Statistics
- Total Files: 10
- Total Lines: 3,506
- Largest File: Encounter.tsx (821 lines)
- Smallest File: Appointments.tsx (194 lines)
- Average Size: 350 lines

## Key Features Implemented
✓ Complete React+MUI implementation
✓ DashboardLayout wrapping all pages
✓ Brand color scheme throughout
✓ Mock data for realistic UI
✓ Responsive grid layouts
✓ Tab navigation (Encounter page)
✓ Table implementations with styling
✓ Gradient cards and hero sections
✓ Form components (dropdowns, text fields)
✓ Icon usage from @mui/icons-material
✓ Status chips with color coding
✓ Action buttons (Consult, Call, Review, etc.)
✓ Avatar components with initials
✓ Timeline visualization (Family & Encounter)
✓ Chat interface mockup (WhatsApp page)
✓ Prescription paper styling (Prescriptions page)

---
Created: 27 Mar 2026
Updated: 27 Mar 2026
