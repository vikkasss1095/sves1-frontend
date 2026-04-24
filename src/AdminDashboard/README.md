# SVES1 — Smart Vendor Evaluation System

A full-stack MERN industry-level project for vendor management, task tracking, and performance evaluation.

---

## 🗂 Project Structure

```
sves1/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── vendorController.js
│   │   ├── adminController.js
│   │   ├── taskController.js
│   │   ├── paymentController.js
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Task.js
│   │   ├── Rating.js
│   │   ├── Document.js
│   │   ├── Payment.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── vendor.js
│   │   ├── admin.js
│   │   ├── task.js
│   │   ├── payment.js
│   │   └── notification.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   ├── vendorDashboard/
    │   │   │   ├── VendorLayout.jsx
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── Tasks.jsx
    │   │   │   ├── Profile.jsx
    │   │   │   ├── Documents.jsx
    │   │   │   ├── Ratings.jsx
    │   │   │   ├── Analytics.jsx
    │   │   │   ├── Notifications.jsx
    │   │   │   ├── Payments.jsx
    │   │   │   └── Settings.jsx
    │   │   └── adminDashboard/
    │   │       ├── AdminLayout.jsx
    │   │       ├── Dashboard.jsx
    │   │       ├── Vendors.jsx
    │   │       ├── Tasks.jsx
    │   │       ├── Evaluation.jsx
    │   │       ├── Documents.jsx
    │   │       ├── Payments.jsx
    │   │       ├── Notifications.jsx
    │   │       └── Settings.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

---

## ⚙️ Setup Guide

### Step 1 — Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/sves1
JWT_SECRET=your_strong_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 2 — Seed admin user

Run this once in MongoDB shell or Compass:

```js
// In mongosh
use sves1
db.users.insertOne({
  name: "Super Admin",
  email: "admin@sves1.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQyCbQwSUkSYBaLjHT9BNrvy2",  // password: Admin@123
  role: "admin",
  isApproved: true,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or use this Node.js seed script:

```js
// seed.js (run once: node seed.js from backend/)
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const exists = await User.findOne({ email: 'admin@sves1.com' });
  if (!exists) {
    await User.create({
      name: 'Super Admin',
      email: 'admin@sves1.com',
      password: 'Admin@123',
      role: 'admin',
      isApproved: true,
      isActive: true,
    });
    console.log('Admin user created: admin@sves1.com / Admin@123');
  } else {
    console.log('Admin already exists');
  }
  mongoose.disconnect();
});
```

```bash
node seed.js
```

### Step 3 — Start backend

```bash
npm run dev
# Runs on http://localhost:5000
```

### Step 4 — Frontend setup

```bash
cd ../frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔐 Login Credentials

| Role  | Email             | Password  |
|-------|-------------------|-----------|
| Admin | admin@sves1.com   | Admin@123 |
| Vendor| Register via /register | Your choice |

---

## 🔄 System Flow

```
1. Vendor registers → account pending
2. Admin approves → vendor can use dashboard
3. Admin assigns task → vendor gets notification
4. Vendor completes task → status updated
5. Admin rates vendor → weighted score calculated
6. System generates rankings → Top vendors ranked
7. Admin processes payment → vendor gets notified
```

---

## 🛠 Tech Stack

| Layer    | Tech              |
|----------|-------------------|
| Frontend | React 18 + Vite   |
| Styling  | Tailwind CSS      |
| Charts   | Recharts          |
| Icons    | Lucide React      |
| Backend  | Node.js + Express |
| Database | MongoDB + Mongoose|
| Auth     | JWT               |
| Files    | Cloudinary        |
| Toasts   | React Hot Toast   |

---

## 📡 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`
- `PUT  /api/auth/change-password`

### Vendor
- `GET  /api/vendor/dashboard`
- `PUT  /api/vendor/profile`
- `DELETE /api/vendor/account`
- `GET/POST/DELETE /api/vendor/documents`
- `GET  /api/vendor/ratings`
- `GET  /api/vendor/analytics`

### Admin
- `GET  /api/admin/dashboard`
- `GET  /api/admin/vendors`
- `PUT  /api/admin/vendors/:id/approve`
- `PUT  /api/admin/vendors/:id/reject`
- `DELETE /api/admin/vendors/:id`
- `GET  /api/admin/evaluation`
- `POST /api/admin/ratings`
- `GET/PUT /api/admin/documents/:id`
- `GET  /api/admin/payments`
- `PUT  /api/admin/payments/:id/approve`

### Tasks
- `GET  /api/tasks`
- `POST /api/tasks`
- `PUT  /api/tasks/:id/status`
- `DELETE /api/tasks/:id`

### Notifications
- `GET  /api/notifications`
- `PUT  /api/notifications/:id/read`
- `PUT  /api/notifications/read-all`

### Payments
- `POST /api/payments`
- `GET  /api/payments/my`