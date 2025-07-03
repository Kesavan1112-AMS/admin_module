import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing data...');

  // Delete in order of foreign key dependencies (child tables first)
  await prisma.workflowstephistory.deleteMany();
  await prisma.workflowsteps.deleteMany();
  await prisma.workflowinstances.deleteMany();
  await prisma.userprivileges.deleteMany();
  await prisma.usermastermappings.deleteMany();
  await prisma.usersessions.deleteMany();
  await prisma.roleprivileges.deleteMany();
  await prisma.privilegemaster.deleteMany();
  await prisma.module.deleteMany();
  await prisma.user.deleteMany();
  await prisma.usercategories.deleteMany();
  await prisma.companyconfigurations.deleteMany();
  await prisma.company.deleteMany();
  await prisma.uiMenu.deleteMany();
  await prisma.uiPage.deleteMany();
  await prisma.uiTableColumn.deleteMany();
  await prisma.uiAction.deleteMany();
  await prisma.uiField.deleteMany();
  await prisma.mastertypes.deleteMany();
  await prisma.masterdata.deleteMany();
  await prisma.masterhierarchy.deleteMany();
  await prisma.masterdatarelationships.deleteMany();
  // We can skip the deletion of customization tables since we haven't created them yet
  // If they existed in your database, uncomment these lines
  // await prisma.businessRule.deleteMany();
  // await prisma.dynamicFormField.deleteMany();
  // await prisma.dynamicForm.deleteMany();
  // await prisma.apiEndpoint.deleteMany();
  // Add more deleteMany as needed for your schema

  console.log('Existing data cleared. Seeding new data...');

  const now = new Date();

  // Create a default company
  const company = await prisma.company.upsert({
    where: { code: 'DEFAULT' },
    update: {},
    create: {
      name: 'Default Company',
      code: 'DEFAULT',
      logoUrl: '/assets/logos/iSteerLogo.png',
      themeConfig: {
        primaryColor: '#15396a',
        secondaryColor: '#1e4a8a',
        backgroundColor: '#f6f8fa',
        textColor: '#333333',
        borderRadius: '8px',
        fontFamily: 'Inter, sans-serif',
      },
      status: 'A',
    },
  });

  console.log('Created company:', company.name);

  // Create default user categories
  const adminCategory = await prisma.usercategories.upsert({
    where: { companyId_name: { companyId: company.id, name: 'admin' } },
    update: {},
    create: {
      companyId: company.id,
      name: 'admin',
      displayName: 'Administrator',
      description: 'Full system administrator with all privileges',
      hierarchyLevel: null,
      accessScope: 'all',
      status: 'A',
      updatedAt: now,
    },
  });

  const userCategory = await prisma.usercategories.upsert({
    where: { companyId_name: { companyId: company.id, name: 'user' } },
    update: {},
    create: {
      companyId: company.id,
      name: 'user',
      displayName: 'User',
      description: 'Standard user with limited privileges',
      hierarchyLevel: 1,
      accessScope: 'own',
      status: 'A',
      updatedAt: now,
    },
  });

  console.log('Created user categories');

  // Create default modules
  const companyModule = await prisma.module.upsert({
    where: { companyId_name: { companyId: company.id, name: 'company' } },
    update: {},
    create: {
      companyId: company.id,
      name: 'company',
      displayName: 'Company Management',
      description: 'Manage company information and settings',
      moduleGroup: 'administration',
      status: 'A',
    },
  });

  const userModule = await prisma.module.upsert({
    where: { companyId_name: { companyId: company.id, name: 'user' } },
    update: {},
    create: {
      companyId: company.id,
      name: 'user',
      displayName: 'User Management',
      description: 'Manage users and their permissions',
      moduleGroup: 'administration',
      status: 'A',
    },
  });

  // Create customization modules
  const businessRulesModule = await prisma.module.upsert({
    where: { companyId_name: { companyId: company.id, name: 'business-rules' } },
    update: {},
    create: {
      companyId: company.id,
      name: 'business-rules',
      displayName: 'Business Rules',
      description: 'Manage dynamic business rules',
      moduleGroup: 'customization',
      status: 'A',
    },
  });

  const dynamicFormsModule = await prisma.module.upsert({
    where: { companyId_name: { companyId: company.id, name: 'dynamic-forms' } },
    update: {},
    create: {
      companyId: company.id,
      name: 'dynamic-forms',
      displayName: 'Dynamic Forms',
      description: 'Manage custom forms',
      moduleGroup: 'customization',
      status: 'A',
    },
  });

  const apiEndpointsModule = await prisma.module.upsert({
    where: { companyId_name: { companyId: company.id, name: 'api-endpoints' } },
    update: {},
    create: {
      companyId: company.id,
      name: 'api-endpoints',
      displayName: 'API Endpoints',
      description: 'Configure dynamic API endpoints',
      moduleGroup: 'customization',
      status: 'A',
    },
  });

  console.log('Created modules');

  // Create default privileges
  const privileges = [
    { name: 'view', displayName: 'View' },
    { name: 'create', displayName: 'Create' },
    { name: 'edit', displayName: 'Edit' },
    { name: 'delete', displayName: 'Delete' },
    { name: 'export', displayName: 'Export' },
  ];

  for (const privilege of privileges) {
    // Company privileges
    await prisma.privilegemaster.upsert({
      where: {
        moduleId_name: { moduleId: companyModule.id, name: privilege.name },
      },
      update: {},
      create: {
        companyId: company.id,
        moduleId: companyModule.id,
        name: privilege.name,
        displayName: privilege.displayName,
        description: `${privilege.displayName} companies`,
        status: 'A',
        updatedAt: now,
      },
    });

    // User privileges
    await prisma.privilegemaster.upsert({
      where: {
        moduleId_name: { moduleId: userModule.id, name: privilege.name },
      },
      update: {},
      create: {
        companyId: company.id,
        moduleId: userModule.id,
        name: privilege.name,
        displayName: privilege.displayName,
        description: `${privilege.displayName} users`,
        status: 'A',
        updatedAt: now,
      },
    });
  }

  // Customization privileges
  const customizationPrivileges = [
    { name: 'view', displayName: 'View' },
    { name: 'create', displayName: 'Create' },
    { name: 'edit', displayName: 'Edit' },
    { name: 'delete', displayName: 'Delete' },
    { name: 'execute', displayName: 'Execute' },
  ];

  for (const privilege of customizationPrivileges) {
    // Business Rules privileges
    await prisma.privilegemaster.upsert({
      where: {
        moduleId_name: { moduleId: businessRulesModule.id, name: privilege.name },
      },
      update: {},
      create: {
        companyId: company.id,
        moduleId: businessRulesModule.id,
        name: privilege.name,
        displayName: `${privilege.displayName} business rules`,
        description: `${privilege.displayName} business rules`,
        status: 'A',
        updatedAt: now,
      },
    });

    // Dynamic Forms privileges
    await prisma.privilegemaster.upsert({
      where: {
        moduleId_name: { moduleId: dynamicFormsModule.id, name: privilege.name },
      },
      update: {},
      create: {
        companyId: company.id,
        moduleId: dynamicFormsModule.id,
        name: privilege.name,
        displayName: `${privilege.displayName} dynamic forms`,
        description: `${privilege.displayName} dynamic forms`,
        status: 'A',
        updatedAt: now,
      },
    });

    // API Endpoints privileges
    await prisma.privilegemaster.upsert({
      where: {
        moduleId_name: { moduleId: apiEndpointsModule.id, name: privilege.name },
      },
      update: {},
      create: {
        companyId: company.id,
        moduleId: apiEndpointsModule.id,
        name: privilege.name,
        displayName: `${privilege.displayName} API endpoints`,
        description: `${privilege.displayName} API endpoints`,
        status: 'A',
        updatedAt: now,
      },
    });
  }

  console.log('Created privileges');

  // Create admin user
  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const adminUser = await prisma.user.upsert({
    where: { companyId_username: { companyId: company.id, username: 'admin' } },
    update: {},
    create: {
      companyId: company.id,
      username: 'admin',
      email: 'admin@default.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+1234567890',
      userCategoryId: adminCategory.id,
      status: 'A',
    },
  });

  console.log('Created admin user:', adminUser.username);

  // Assign all privileges to admin category
  const allPrivileges = await prisma.privilegemaster.findMany({
    where: { companyId: company.id },
  });

  for (const privilege of allPrivileges) {
    await prisma.roleprivileges.upsert({
      where: {
        userCategoryId_privilegeId: {
          userCategoryId: adminCategory.id,
          privilegeId: privilege.id,
        },
      },
      update: {},
      create: {
        companyId: company.id,
        userCategoryId: adminCategory.id,
        privilegeId: privilege.id,
        status: 'A',
        grantedBy: adminUser.id,
        updatedAt: now,
      },
    });
  }

  console.log('Assigned privileges to admin category');

  // --- UI CONFIG SEEDING ---
  // Seed sidebar menu
  const menuItems = [
    {
      label: 'Dashboard',
      route: '/',
      icon: 'home',
      order: 1,
    },
    {
      label: 'Company Management',
      route: '/company-management',
      icon: 'building',
      order: 2,
    },
    {
      label: 'User Management',
      route: '/user-management',
      icon: 'users',
      order: 3,
    },
    {
      label: 'Settings',
      route: '/settings',
      icon: 'settings',
      order: 4,
      children: [
        {
          label: 'Business Rules',
          route: '/settings/business-rules',
          icon: 'sliders',
          order: 1,
        },
        {
          label: 'Dynamic Forms',
          route: '/settings/forms',
          icon: 'file-text',
          order: 2,
        },
        {
          label: 'API Endpoints',
          route: '/settings/api-endpoints',
          icon: 'code',
          order: 3,
        },
      ]
    },
  ];
  for (const item of menuItems) {
    await prisma.uiMenu.create({
      data: {
        companyId: company.id,
        label: item.label,
        route: item.route,
        icon: item.icon,
        order: item.order,
        status: 'A',
      },
    });
  }

  // Seed pages and their table columns/actions/fields
  const pages = [
    {
      key: 'company-management',
      title: 'Company Management',
      description: 'Manage company information and settings',
      columns: [
        {
          key: 'name',
          label: 'Company Name',
          type: 'text',
          order: 1,
          sortable: true,
        },
        { key: 'code', label: 'Code', type: 'text', order: 2, sortable: true },
        {
          key: 'status',
          label: 'Status',
          type: 'toggle',
          order: 3,
          sortable: false,
        },
      ],
      actions: [
        { key: 'create', label: 'Create', order: 1 },
        { key: 'edit', label: 'Edit', order: 2 },
        { key: 'delete', label: 'Delete', order: 3 },
        { key: 'export', label: 'Export', order: 4 },
      ],
      fields: [
        {
          key: 'name',
          label: 'Company Name',
          type: 'text',
          required: true,
          order: 1,
        },
        { key: 'code', label: 'Code', type: 'text', required: true, order: 2 },
        {
          key: 'status',
          label: 'Status',
          type: 'toggle',
          required: false,
          order: 3,
        },
      ],
    },
    {
      key: 'user-management',
      title: 'User Management',
      description: 'Manage users and their permissions',
      columns: [
        {
          key: 'username',
          label: 'Username',
          type: 'text',
          order: 1,
          sortable: true,
        },
        {
          key: 'email',
          label: 'Email',
          type: 'text',
          order: 2,
          sortable: true,
        },
        {
          key: 'userCategory',
          label: 'Role',
          type: 'text',
          order: 3,
          sortable: true,
        },
        {
          key: 'status',
          label: 'Status',
          type: 'toggle',
          order: 4,
          sortable: false,
        },
      ],
      actions: [
        { key: 'create', label: 'Create', order: 1 },
        { key: 'edit', label: 'Edit', order: 2 },
        { key: 'delete', label: 'Delete', order: 3 },
        { key: 'export', label: 'Export', order: 4 },
      ],
      fields: [
        {
          key: 'username',
          label: 'Username',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          key: 'email',
          label: 'Email',
          type: 'text',
          required: true,
          order: 2,
        },
        {
          key: 'userCategory',
          label: 'Role',
          type: 'text',
          required: true,
          order: 3,
        },
        {
          key: 'status',
          label: 'Status',
          type: 'toggle',
          required: false,
          order: 4,
        },
      ],
    },
  ];

  for (const page of pages) {
    const createdPage = await prisma.uiPage.create({
      data: {
        companyId: company.id,
        key: page.key,
        title: page.title,
        description: page.description,
        status: 'A',
      },
    });
    for (const col of page.columns) {
      await prisma.uiTableColumn.create({
        data: {
          pageId: createdPage.id,
          key: col.key,
          label: col.label,
          type: col.type,
          order: col.order,
          visible: true,
          sortable: col.sortable,
        },
      });
    }
    for (const action of page.actions) {
      await prisma.uiAction.create({
        data: {
          pageId: createdPage.id,
          key: action.key,
          label: action.label,
          order: action.order,
          visible: true,
        },
      });
    }
    for (const field of page.fields) {
      await prisma.uiField.create({
        data: {
          pageId: createdPage.id,
          key: field.key,
          label: field.label,
          type: field.type,
          required: field.required,
          visible: true,
          order: field.order,
        },
      });
    }
  }

  // Remove old companyconfigurations menu config if present
  await prisma.companyconfigurations.deleteMany({
    where: { companyId: company.id, configKey: 'menu' },
  });

  console.log('Created default configurations');

  console.log('Database seeding completed successfully!');
  console.log('Admin credentials:');
  console.log('Company ID:', company.id);
  console.log('Username: admin');
  console.log('Email: admin@default.com');
  console.log('Password: Admin@123');

  console.log('Seeding complete.');

  // --- DEBUG: Print all users ---
  const allUsers = await prisma.user.findMany({
    include: {
      userCategory: true,
    },
  });
  console.log('--- All Users in DB ---');
  console.dir(allUsers, { depth: null });
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
