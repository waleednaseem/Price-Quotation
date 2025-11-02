# Database Setup Guide

## PostgreSQL Setup for Quotation Management System

### Prerequisites
- PostgreSQL 15 is installed and running (✅ Confirmed running)
- pgAdmin is available for database management

### Database Configuration Steps

#### 1. Create Database
You need to create the `price_quotation` database. You can do this through:

**Option A: Using pgAdmin**
1. Open pgAdmin
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `price_quotation`
5. Click "Save"

**Option B: Using SQL Command**
```sql
CREATE DATABASE price_quotation;
```

#### 2. Configure Database Connection
Update the `.env` file with the correct PostgreSQL credentials:

```env
# Database - Update with your actual credentials
DATABASE_URL="postgresql://[username]:[password]@localhost:5432/price_quotation?schema=public"
```

**Common connection strings to try:**
- `postgresql://postgres:postgres@localhost:5432/price_quotation?schema=public`
- `postgresql://postgres:password@localhost:5432/price_quotation?schema=public`
- `postgresql://postgres:@localhost:5432/price_quotation?schema=public` (no password)

#### 3. Run Database Migration
Once the connection is configured, run:
```bash
npm run db:migrate
```

This will:
- Create all database tables
- Set up relationships
- Generate Prisma client

#### 4. Seed Database (Optional)
To populate with sample data:
```bash
npm run db:seed
```

This creates:
- Admin user: `admin@yourcompany.com` (password: `admin123`)
- Sample companies and quotations
- Test data for development

### Database Schema Overview

The system uses the following main tables:
- **User** - Admin and client users
- **Company** - Client companies
- **Quotation** - Main quotation records
- **Feature** - Individual features/items in quotations
- **Negotiation** - Negotiation messages and proposals
- **QuotationHistory** - Audit trail of changes
- **Settings** - System configuration

### Troubleshooting

#### Authentication Issues
If you get authentication errors:
1. Check PostgreSQL is running: `Get-Service -Name "*postgres*"`
2. Verify username/password in pgAdmin
3. Try connecting through pgAdmin first
4. Update `.env` with correct credentials

#### Database Not Found
1. Ensure `price_quotation` database exists
2. Check database name spelling
3. Verify connection string format

#### Permission Issues
1. Ensure the PostgreSQL user has CREATE privileges
2. Check if the user can connect to the database
3. Verify schema permissions

### Next Steps
Once database is set up:
1. Run `npm run db:migrate` to create tables
2. Run `npm run db:seed` for sample data
3. Start development server: `npm run dev`
4. Access pgAdmin to view database structure

### Available NPM Scripts
- `npm run db:migrate` - Run database migrations
- `npm run db:generate` - Generate Prisma client
- `npm run db:studio` - Open Prisma Studio (database GUI)
- `npm run db:seed` - Seed database with sample data
- `npm run db:reset` - Reset database (careful!)