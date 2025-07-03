# Multi-Tenant Enterprise Admin Module

A fully customizable, multi-tenant enterprise admin application built with NestJS (backend) and React (frontend). This application enables customers to configure their own organizational structure, workflows, data validation rules, and UI without requiring code changes.

## 🚀 Features

- **Multi-Tenant Architecture**: Each company has isolated data
- **Dynamic UI Configuration**: Database-driven menus, pages, fields
- **Role-Based Access Control**: Granular permissions
- **Master Data Management**: Flexible data types and hierarchies
- **Workflow Engine**: Configurable approval workflows
- **JWT Authentication**: Secure session management

## 🛠️ Quick Start

### Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Update .env with your database credentials
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run start:dev
```

### Frontend Setup

```bash
cd frontend
npm install
cp env.example .env
# Update .env with backend URL
npm run dev
```

## 📋 Prerequisites

- Node.js 18+
- MySQL 8.0+
- npm or yarn

## 🔧 Environment Variables

### Backend (.env)

```env
DATABASE_URL="mysql://username:password@localhost:3306/admin_module"
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=24h
ALLOWED_ORIGINS=http://localhost:5173
```

### Frontend (.env)

```env
VITE_BACKEND_URL=http://localhost:3000/api/
VITE_APP_NAME=Admin Module
```

## 🚀 Production Deployment

1. Set `NODE_ENV=production`
2. Update database credentials
3. Set strong JWT secrets
4. Configure CORS origins
5. Build and deploy

## 📊 API Endpoints

- `POST /api/auth/login` - User login
- `GET /api/ui-config/menu/:companyId` - Get menu
- `GET /api/ui-config/page/:companyId/:pageKey` - Get page config
- `POST /api/company/create` - Create company

## 🧪 Testing

```bash
# Backend
npm run test
npm run test:e2e

# Frontend
npm test
```

## 📄 License

MIT License
