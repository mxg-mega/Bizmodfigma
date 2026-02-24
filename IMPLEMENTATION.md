# BizMod - Business Management System

A comprehensive business management platform built for Nigerian SMEs with full multi-business, multi-location, and multi-tenant support.

## Features Implemented

### 1. Navigation System
- **React Router Integration**: Full routing with React Router for seamless navigation
- **Protected Routes**: Dashboard routes require authentication
- **Nested Routes**: Dashboard has nested routes for different modules
- **Navigation Components**: Sidebar navigation with active state indication

### 2. Inventory Management System
- **Product Management**:
  - Create, read, update, and delete products
  - SKU tracking
  - Category organization
  - Product descriptions
  
- **Unit of Measure System**:
  - Multiple unit types: Weight (kg, g, ton, lb, oz), Volume (liter, ml, gallon), Length (meter, cm, km, inch, foot, yard), Piece (piece, dozen, pack, box)
  - Automatic unit conversion between compatible units
  - Display formatted quantities with proper symbols
  
- **Multi-Location Stock Management**:
  - Track stock separately for each location
  - Stock adjustment with reason tracking
  - Stock movement history
  - Low stock alerts
  
- **Inventory Features**:
  - Search and filter products
  - Real-time stock updates
  - Inventory valuation (cost price vs selling price)
  - Stock level warnings (min/max)

### 3. Sales Management System
- **Point of Sale**:
  - Intuitive product selection interface
  - Real-time cart management
  - Quantity adjustments
  - Customer information (optional)
  - Multiple payment methods (Cash, Card, Transfer, Credit)
  - Discount support
  - Sale notes
  
- **Sales Tracking**:
  - Complete sales history
  - Sales by date, customer, payment method
  - Automatic stock deduction on sale
  - Sales status tracking
  
- **Sales Metrics & Analytics**:
  - Total sales count
  - Total revenue
  - Average sale value
  - Sales by day (chart)
  - Top products by revenue
  - Real-time dashboard updates

### 4. Multi-Business & Multi-Tenant System
- **Business Management**:
  - Create and manage multiple businesses
  - Switch between businesses with ease
  - Business-specific data isolation
  - Currency support per business
  
- **Multi-Location Support**:
  - Add multiple locations per business
  - Location selector in navigation
  - Default location setting
  - Stock tracked per location
  - Sales tracked per location

### 5. Backend API
Comprehensive REST API with full CRUD operations:

**Business Routes**:
- `GET /businesses` - List all businesses for user
- `POST /businesses` - Create new business

**Location Routes**:
- `GET /locations/:businessId` - List locations
- `POST /locations/:businessId` - Create location

**Product Routes**:
- `GET /products/:businessId` - List products
- `POST /products/:businessId` - Create product
- `PUT /products/:businessId/:productId` - Update product
- `DELETE /products/:businessId/:productId` - Delete product
- `POST /products/:businessId/:productId/stock` - Update stock

**Sales Routes**:
- `GET /sales/:businessId` - List sales
- `POST /sales/:businessId` - Create sale
- `GET /sales/:businessId/metrics` - Get sales metrics

### 6. Data Architecture
- **Multi-tenant**: All data scoped by user ID
- **Multi-business**: Data scoped by business ID
- **Multi-location**: Stock and sales tracked by location ID
- **Key-Value Storage**: Efficient data storage using Supabase KV store
- **Data Relationships**: Proper foreign key relationships maintained

## Technical Stack

- **Frontend**: React 18.3.1, TypeScript
- **Routing**: React Router 7
- **State Management**: React Context API
- **Styling**: Tailwind CSS 4.1
- **UI Components**: Radix UI, Motion (Framer Motion)
- **Charts**: Recharts
- **Backend**: Supabase Edge Functions (Deno), Hono web framework
- **Database**: Supabase KV Store
- **Authentication**: Supabase Auth

## Getting Started

### Using the Application

1. **Landing Page**: Start at the home page to learn about BizMod
2. **Sign Up/Login**: Create an account or sign in
3. **Onboarding**: Complete the 7-step onboarding process
4. **Dashboard**: Access your business dashboard
5. **Add Products**: Navigate to Inventory → Add Product
6. **Record Sales**: Navigate to Sales → New Sale
7. **View Analytics**: Check the Sales overview for insights

### Multi-Business Setup

1. Complete onboarding for your first business
2. From the dashboard, click the business selector in the top nav
3. Create additional businesses as needed
4. Switch between businesses using the dropdown

### Multi-Location Setup

1. Navigate to Settings (coming soon) to add locations
2. Or locations are auto-created during onboarding
3. Use the location selector to switch between locations
4. Stock and sales are tracked separately per location

## Unit Conversion

The system automatically handles unit conversions:
- **Weight**: Convert between kg, g, mg, ton, lb, oz
- **Volume**: Convert between liter, ml, gallon
- **Length**: Convert between meter, cm, mm, km, inch, foot, yard
- **Piece**: Support for piece, dozen, pack, box

Example: Add 1kg of rice, sell 500g - the system automatically calculates remaining 0.5kg.

## Key Features

✅ Complete navigation system with React Router
✅ Inventory management with unit conversion
✅ Sales system with POS interface
✅ Multi-business support
✅ Multi-location stock tracking
✅ Multi-tenant data architecture
✅ Real-time metrics and analytics
✅ Stock movement tracking
✅ Low stock alerts
✅ Sales history and reporting
✅ Automatic stock deduction on sales

## Demo Credentials

- **Email**: demo@bizmod.ng
- **Password**: BizMod2024!

## Next Steps

Future enhancements to implement:
- Customer management module
- Advanced analytics dashboard
- Settings page (business profile, team members, etc.)
- Export/Import functionality for inventory and sales
- Receipt printing
- Multi-currency support
- Tax calculations
- Supplier management
- Purchase orders
- Expense tracking
