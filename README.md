# 🌱 Flowfig - Task Management API

<p align="center">
  <img src="assets/flowfig-logo.png" alt="Flowfig Logo" width="200"/>
</p>

A modern, secure REST API for task management built with Node.js, TypeScript, and Clean Architecture principles.

## 🚀 Features

- **🔐 JWT Authentication** - Secure user registration and login
- **📝 Complete CRUD Operations** - Create, read, update, delete tasks
- **👤 User Isolation** - Users can only access their own tasks
- **✅ Input Validation** - Comprehensive validation with Zod schemas
- **🛡️ Security** - Password hashing with bcrypt, JWT token expiration
- **🏗️ Clean Architecture** - Organized with controllers, services, middlewares
- **🧪 Comprehensive Testing** - Unit tests with Jest
- **🐳 Docker Support** - Easy containerization and deployment
- **🌐 CORS Ready** - Configured for frontend integration
- **📖 Well Documented** - Extensive code comments and documentation

## 🛠️ Tech Stack

- **Runtime:** Node.js with Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod schemas
- **Password Security:** bcrypt
- **Testing:** Jest
- **Containerization:** Docker & Docker Compose
- **Package Manager:** pnpm

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- Docker & Docker Compose (optional)
- pnpm package manager

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd flowfig
pnpm install
```

### 2. Environment Setup

Create a `.env` file based on `.env.exemple`:

```bash
cp .env.exemple .env
```

Configure your environment variables:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/flowfig"
JWT_SECRET="your-super-secure-jwt-secret-key"
PORT=3000
CORS_ORIGINS="http://localhost:3000,http://localhost:5173"
```

### 3. Database Setup

```bash
# Generate Prisma client
pnpm prisma generate

# Run database migrations
pnpm prisma migrate deploy
```

### 4. Start the Application

#### Development Mode

```bash
pnpm dev
```

#### Docker Mode (Recommended)

```bash
# Start with Docker Compose
pnpm docker

# Or build and start
docker-compose up --build
```

The API will be available at `http://localhost:3000`
