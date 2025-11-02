# Product Requirement Document (PRD)
## Quotation Management System (Admin + Client)

### 📋 Project Overview
**Project Name:** Quotation Management System  
**Tech Stack:** Next.js 16 + Prisma + PostgreSQL + TailwindCSS  
**Timeline:** 4-6 weeks  
**Team Size:** 1 Developer  

---

## 🎯 Executive Summary

Build a comprehensive Quotation Management System where an Admin can create, manage, and negotiate project quotations with multiple clients. The system will feature a clean, modern UI similar to Todoist/Notion, secure SSR implementation, and complete negotiation workflow management.

---

## 🏗️ System Architecture

### Tech Stack Details
- **Frontend:** Next.js 16 (App Router) + TypeScript
- **Backend:** Next.js API Routes (SSR)
- **Database:** PostgreSQL + Prisma ORM
- **Styling:** TailwindCSS (Light theme)
- **State Management:** React Context API
- **Authentication:** NextAuth.js or custom JWT
- **File Handling:** PDF/Excel export libraries
- **Email:** Nodemailer or SendGrid

### Core Libraries
```json
{
  "prisma": "^5.0.0",
  "postgresql": "driver",
  "axios": "^1.6.0",
  "react-toastify": "^9.1.0",
  "js-cookie": "^3.0.0",
  "jspdf": "^2.5.0",
  "xlsx": "^0.18.0",
  "nodemailer": "^6.9.0",
  "bcryptjs": "^2.4.0",
  "jsonwebtoken": "^9.0.0"
}
```

---

## 📊 Database Schema

### Core Models

#### 1. User Model
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String?  // null for passwordless clients
  name      String
  role      Role     @default(CLIENT)
  companyId String?
  company   Company? @relation(fields: [companyId], references: [id])
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

enum Role {
  ADMIN
  CLIENT
}
```

#### 2. Company Model
```prisma
model Company {
  id          String      @id @default(cuid())
  name        String      @unique
  email       String?
  phone       String?
  address     String?
  users       User[]
  quotations  Quotation[]
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
```

#### 3. Quotation Model
```prisma
model Quotation {
  id             String            @id @default(cuid())
  quotationId    String            @unique // QT-2025-001
  projectName    String
  companyId      String
  company        Company           @relation(fields: [companyId], references: [id])
  features       Feature[]
  totalCost      Decimal           @default(0)
  deploymentCost Decimal?
  notes          String?
  status         QuotationStatus   @default(PENDING)
  negotiations   Negotiation[]
  history        QuotationHistory[]
  createdAt      DateTime          @default(now())
  updatedAt      DateTime          @updatedAt
}

enum QuotationStatus {
  PENDING
  NEGOTIATING
  ACCEPTED
  DECLINED
}
```

#### 4. Feature Model
```prisma
model Feature {
  id          String    @id @default(cuid())
  title       String
  description String?
  price       Decimal
  quotationId String
  quotation   Quotation @relation(fields: [quotationId], references: [id], onDelete: Cascade)
  isDeleted   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### 5. Negotiation Model
```prisma
model Negotiation {
  id          String    @id @default(cuid())
  quotationId String
  quotation   Quotation @relation(fields: [quotationId], references: [id])
  fromRole    Role
  message     String?
  proposedTotal Decimal?
  featureChanges Json? // Store feature-wise price changes
  status      NegotiationStatus
  createdAt   DateTime  @default(now())
}

enum NegotiationStatus {
  PROPOSED
  ACCEPTED
  DECLINED
  COUNTERED
}
```

#### 6. QuotationHistory Model
```prisma
model QuotationHistory {
  id          String    @id @default(cuid())
  quotationId String
  quotation   Quotation @relation(fields: [quotationId], references: [id])
  action      String    // "created", "updated", "negotiated", "accepted", etc.
  details     Json?     // Store change details
  performedBy String    // User ID
  createdAt   DateTime  @default(now())
}
```

---

## 🎨 UI/UX Design Requirements

### Design System
- **Color Palette:** Light theme (whites, grays, subtle blues)
- **Typography:** Clean, readable fonts (Inter/Geist)
- **Layout:** Card-based design similar to Notion
- **Components:** Reusable, accessible components
- **Responsive:** Desktop-first, tablet-friendly

### Key UI Components
1. **Dashboard Cards** - Overview statistics
2. **Data Tables** - Quotations list with filters
3. **Forms** - Create/edit quotations
4. **Modal Dialogs** - Negotiations, confirmations
5. **Toast Notifications** - Success/error feedback
6. **Export Buttons** - PDF/Excel download
7. **Status Badges** - Visual status indicators

---

## 🔐 Authentication & Security

### Admin Authentication
- Email/password login
- JWT token-based sessions
- Role-based access control

### Client Authentication
- Email-based login (magic link or password)
- Company-specific access
- Session management

### Security Features
- Password hashing (bcrypt)
- CSRF protection
- Input validation & sanitization
- Rate limiting on APIs
- Secure cookie handling

---

## 📱 Feature Specifications

### 👨‍💼 Admin Panel Features

#### 1. Dashboard
- **Overview Cards:**
  - Total quotations sent
  - Pending quotations
  - Accepted quotations
  - Revenue generated
- **Recent Activity Timeline**
- **Quick Actions:** Create new quotation

#### 2. Quotation Management
- **Create Quotation:**
  - Auto-generated ID (QT-YYYY-XXX)
  - Project name input
  - Company selection/creation
  - Dynamic feature addition (Todoist-style)
  - Auto-calculated totals
  - Optional deployment cost
  - Notes section

- **Quotation List:**
  - Searchable table
  - Filter by status, company, date
  - Bulk actions
  - Export options

- **Quotation Details:**
  - Full quotation view
  - Edit capabilities
  - Negotiation history
  - Status management

#### 3. Negotiation Management
- **Incoming Negotiations:**
  - Client proposals list
  - Price comparison view
  - Accept/Counter/Decline actions
  - Response messaging

- **Negotiation History:**
  - Complete timeline
  - All parties' messages
  - Price change tracking

#### 4. Company Management
- **Company Profiles:**
  - Basic information
  - Contact details
  - Quotation history
  - Client user management

#### 5. Export Features
- **PDF Export:**
  - Professional quotation format
  - Company branding
  - Terms & conditions

- **Excel Export:**
  - Detailed breakdown
  - Multiple quotations
  - Analytics data

### 🧑‍💼 Client Dashboard Features

#### 1. Client Dashboard
- **Active Quotations:** Current pending/negotiating
- **Quotation History:** All past quotations
- **Quick Actions:** Review pending quotations

#### 2. Quotation Review
- **View Quotation:**
  - Project details
  - Feature breakdown
  - Total costs
  - Admin notes

- **Feature Management:**
  - Delete unwanted features
  - Cannot add new features
  - Real-time total updates

#### 3. Negotiation Interface
- **Price Proposals:**
  - Total price negotiation
  - Per-feature price changes
  - Message/reasoning input

- **Negotiation History:**
  - Complete conversation thread
  - Price change timeline
  - Status updates

#### 4. Final Actions
- **Accept Quotation:** Confirm final agreement
- **Decline Quotation:** Reject with reason
- **Request Changes:** Continue negotiation

---

## 🛠️ Development Milestones

### Phase 1: Foundation Setup (Week 1)
**Tasks:**
1. ✅ Project initialization (Already done)
2. 🔄 Database setup & Prisma configuration
3. 🔄 Authentication system implementation
4. 🔄 Basic UI components & layout
5. 🔄 Context API setup for state management

**Deliverables:**
- Working authentication system
- Database schema implemented
- Basic admin/client layouts
- Global state management

### Phase 2: Core Admin Features (Week 2)
**Tasks:**
1. 🔄 Admin dashboard with statistics
2. 🔄 Quotation CRUD operations
3. 🔄 Dynamic feature management
4. 🔄 Company management system
5. 🔄 Basic quotation listing & filtering

**Deliverables:**
- Complete admin quotation management
- Company profiles system
- Feature addition/deletion functionality

### Phase 3: Client Interface (Week 3)
**Tasks:**
1. 🔄 Client dashboard implementation
2. 🔄 Quotation viewing interface
3. 🔄 Feature deletion for clients
4. 🔄 Basic negotiation interface
5. 🔄 Client authentication flow

**Deliverables:**
- Functional client dashboard
- Quotation review system
- Client-side feature management

### Phase 4: Negotiation System (Week 4)
**Tasks:**
1. 🔄 Negotiation workflow implementation
2. 🔄 Real-time price calculations
3. 🔄 Negotiation history tracking
4. 🔄 Status management system
5. 🔄 Email notifications

**Deliverables:**
- Complete negotiation workflow
- History tracking system
- Email notification system

### Phase 5: Export & Polish (Week 5)
**Tasks:**
1. 🔄 PDF export functionality
2. 🔄 Excel export implementation
3. 🔄 UI/UX improvements
4. 🔄 Error handling & validation
5. 🔄 Performance optimization

**Deliverables:**
- Export functionality
- Polished user interface
- Comprehensive error handling

### Phase 6: Testing & Deployment (Week 6)
**Tasks:**
1. 🔄 Comprehensive testing
2. 🔄 Bug fixes & optimizations
3. 🔄 Documentation
4. 🔄 Deployment setup
5. 🔄 Final review & handover

**Deliverables:**
- Fully tested application
- Deployment-ready code
- User documentation

---

## 📋 Detailed Task Breakdown

### 🔧 Technical Tasks

#### Database & Backend
- [ ] Install and configure Prisma
- [ ] Set up PostgreSQL database
- [ ] Create database schema
- [ ] Implement database migrations
- [ ] Set up pgAdmin for database management
- [ ] Create API routes for all CRUD operations
- [ ] Implement authentication middleware
- [ ] Set up session management
- [ ] Create data validation schemas
- [ ] Implement error handling middleware

#### Frontend Development
- [ ] Set up TailwindCSS configuration
- [ ] Create reusable UI components
- [ ] Implement responsive layouts
- [ ] Set up Context API for state management
- [ ] Create admin dashboard layout
- [ ] Create client dashboard layout
- [ ] Implement form handling & validation
- [ ] Set up toast notifications
- [ ] Create modal components
- [ ] Implement loading states

#### Authentication System
- [ ] Admin login/logout functionality
- [ ] Client authentication (email-based)
- [ ] Password hashing & verification
- [ ] JWT token management
- [ ] Role-based access control
- [ ] Session persistence
- [ ] Password reset functionality
- [ ] Account verification system

#### Quotation Management
- [ ] Quotation creation form
- [ ] Dynamic feature addition/removal
- [ ] Auto-calculation of totals
- [ ] Quotation editing functionality
- [ ] Quotation listing with pagination
- [ ] Search & filter implementation
- [ ] Status management system
- [ ] Quotation ID generation

#### Negotiation System
- [ ] Negotiation proposal interface
- [ ] Price comparison views
- [ ] Negotiation history display
- [ ] Real-time updates
- [ ] Status tracking
- [ ] Message threading
- [ ] Approval/rejection workflow

#### Export Features
- [ ] PDF generation library setup
- [ ] PDF template design
- [ ] Excel export functionality
- [ ] Export data formatting
- [ ] Download handling
- [ ] Export history tracking

#### Email System
- [ ] Email service configuration
- [ ] Email templates creation
- [ ] Notification triggers
- [ ] Email queue management
- [ ] Delivery tracking

### 🎨 UI/UX Tasks

#### Design System
- [ ] Color palette definition
- [ ] Typography system
- [ ] Component library creation
- [ ] Icon system setup
- [ ] Spacing & layout guidelines

#### Admin Interface
- [ ] Dashboard design & implementation
- [ ] Quotation management interface
- [ ] Company management pages
- [ ] Negotiation management interface
- [ ] Settings & profile pages

#### Client Interface
- [ ] Client dashboard design
- [ ] Quotation review interface
- [ ] Negotiation interface
- [ ] History & archive pages

#### Responsive Design
- [ ] Mobile breakpoint optimization
- [ ] Tablet layout adjustments
- [ ] Desktop experience enhancement
- [ ] Cross-browser compatibility

### 🧪 Testing Tasks
- [ ] Unit tests for utilities
- [ ] API route testing
- [ ] Authentication flow testing
- [ ] Database operation testing
- [ ] UI component testing
- [ ] Integration testing
- [ ] User acceptance testing
- [ ] Performance testing

---

## 🚀 Success Metrics

### Functional Requirements
- ✅ Admin can create/edit/delete quotations
- ✅ Clients can review and negotiate quotations
- ✅ Complete negotiation history tracking
- ✅ PDF/Excel export functionality
- ✅ Email notifications working
- ✅ Secure authentication system
- ✅ Responsive design implementation

### Performance Requirements
- Page load time < 2 seconds
- Database queries optimized
- Smooth user interactions
- Mobile-friendly interface

### Security Requirements
- Secure authentication
- Data validation
- CSRF protection
- SQL injection prevention
- XSS protection

---

## 📚 Technical Documentation

### API Endpoints Structure