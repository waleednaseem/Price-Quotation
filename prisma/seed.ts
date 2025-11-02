import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create default settings
  const settings = await prisma.settings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      companyName: 'Your Company Name',
      companyEmail: 'admin@yourcompany.com',
      companyPhone: '+1 (555) 123-4567',
      companyAddress: '123 Business Street, City, State 12345',
      quotationPrefix: 'QT',
      quotationValidityDays: 30,
      defaultCurrency: 'USD',
      taxRate: 0.1, // 10%
    },
  })

  // Create admin user
  const adminPassword = await hashPassword('admin123')
  const admin = await prisma.user.upsert({
    where: { email: 'admin@yourcompany.com' },
    update: {},
    create: {
      email: 'admin@yourcompany.com',
      password: adminPassword,
      name: 'System Administrator',
      role: 'ADMIN',
    },
  })

  // Create sample companies
  const company1 = await prisma.company.upsert({
    where: { name: 'Tech Solutions Inc.' },
    update: {},
    create: {
      name: 'Tech Solutions Inc.',
      email: 'contact@techsolutions.com',
      phone: '+1 (555) 987-6543',
      address: '456 Tech Avenue, Silicon Valley, CA 94000',
      website: 'https://techsolutions.com',
      contactPerson: 'John Smith',
    },
  })

  const company2 = await prisma.company.upsert({
    where: { name: 'Digital Marketing Pro' },
    update: {},
    create: {
      name: 'Digital Marketing Pro',
      email: 'hello@digitalmarketingpro.com',
      phone: '+1 (555) 456-7890',
      address: '789 Marketing Blvd, New York, NY 10001',
      website: 'https://digitalmarketingpro.com',
      contactPerson: 'Sarah Johnson',
    },
  })

  // Create client users
  const clientPassword = await hashPassword('client123')
  const client1 = await prisma.user.upsert({
    where: { email: 'john@techsolutions.com' },
    update: {},
    create: {
      email: 'john@techsolutions.com',
      password: clientPassword,
      name: 'John Smith',
      role: 'CLIENT',
      companyId: company1.id,
    },
  })

  const client2 = await prisma.user.upsert({
    where: { email: 'sarah@digitalmarketingpro.com' },
    update: {},
    create: {
      email: 'sarah@digitalmarketingpro.com',
      password: clientPassword,
      name: 'Sarah Johnson',
      role: 'CLIENT',
      companyId: company2.id,
    },
  })

  // Create sample quotations
  const quotation1 = await prisma.quotation.create({
    data: {
      quotationId: 'QT-2025-001',
      projectName: 'E-commerce Website Development',
      description: 'Complete e-commerce solution with payment integration',
      companyId: company1.id,
      createdById: admin.id,
      totalCost: 15000,
      deploymentCost: 500,
      notes: 'Includes 3 months of free maintenance and support',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      status: 'PENDING',
    },
  })

  // Create features for quotation1
  await prisma.feature.createMany({
    data: [
      {
        title: 'Frontend Development',
        description: 'React.js based responsive frontend with modern UI/UX',
        price: 6000,
        quantity: 1,
        quotationId: quotation1.id,
        order: 1,
      },
      {
        title: 'Backend API Development',
        description: 'Node.js/Express API with authentication and database integration',
        price: 4000,
        quantity: 1,
        quotationId: quotation1.id,
        order: 2,
      },
      {
        title: 'Payment Gateway Integration',
        description: 'Stripe and PayPal payment processing integration',
        price: 2000,
        quantity: 1,
        quotationId: quotation1.id,
        order: 3,
      },
      {
        title: 'Admin Dashboard',
        description: 'Complete admin panel for managing products and orders',
        price: 2500,
        quantity: 1,
        quotationId: quotation1.id,
        order: 4,
      },
      {
        title: 'Testing & QA',
        description: 'Comprehensive testing and quality assurance',
        price: 500,
        quantity: 1,
        quotationId: quotation1.id,
        order: 5,
      },
    ],
  })

  const quotation2 = await prisma.quotation.create({
    data: {
      quotationId: 'QT-2025-002',
      projectName: 'Digital Marketing Campaign Platform',
      description: 'Custom platform for managing digital marketing campaigns',
      companyId: company2.id,
      createdById: admin.id,
      totalCost: 8500,
      deploymentCost: 300,
      notes: 'Includes training sessions for the team',
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      status: 'NEGOTIATING',
    },
  })

  // Create features for quotation2
  await prisma.feature.createMany({
    data: [
      {
        title: 'Campaign Management System',
        description: 'Web-based platform for creating and managing campaigns',
        price: 4000,
        quantity: 1,
        quotationId: quotation2.id,
        order: 1,
      },
      {
        title: 'Analytics Dashboard',
        description: 'Real-time analytics and reporting dashboard',
        price: 2500,
        quantity: 1,
        quotationId: quotation2.id,
        order: 2,
      },
      {
        title: 'Social Media Integration',
        description: 'Integration with Facebook, Instagram, and Twitter APIs',
        price: 1500,
        quantity: 1,
        quotationId: quotation2.id,
        order: 3,
      },
      {
        title: 'Team Training',
        description: '8 hours of comprehensive platform training',
        price: 500,
        quantity: 1,
        quotationId: quotation2.id,
        order: 4,
      },
    ],
  })

  // Create sample negotiation
  await prisma.negotiation.create({
    data: {
      quotationId: quotation2.id,
      userId: client2.id,
      fromRole: 'CLIENT',
      message: 'The price seems a bit high. Can we negotiate on the social media integration part?',
      proposedTotal: 7500,
      status: 'PROPOSED',
    },
  })

  // Create history entries
  await prisma.quotationHistory.createMany({
    data: [
      {
        quotationId: quotation1.id,
        action: 'created',
        details: { message: 'Quotation created' },
        performedBy: admin.id,
      },
      {
        quotationId: quotation2.id,
        action: 'created',
        details: { message: 'Quotation created' },
        performedBy: admin.id,
      },
      {
        quotationId: quotation2.id,
        action: 'negotiated',
        details: { 
          message: 'Client proposed new price',
          oldTotal: 8500,
          newTotal: 7500
        },
        performedBy: client2.id,
      },
    ],
  })

  console.log('✅ Database seeding completed successfully!')
  console.log(`👤 Admin user: admin@yourcompany.com (password: admin123)`)
  console.log(`👤 Client 1: john@techsolutions.com (password: client123)`)
  console.log(`👤 Client 2: sarah@digitalmarketingpro.com (password: client123)`)
  console.log(`📊 Created ${await prisma.quotation.count()} quotations`)
  console.log(`🏢 Created ${await prisma.company.count()} companies`)
  console.log(`⚙️ Settings configured`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })