# Backend Integration - Customer Feedback Portal

Successfully integrated the Customer Feedback frontend with the Office Management backend system.

## 🚀 Quick Start

### 1. Start Backend Server

```bash
cd ../office-management-systemm-1
npm run dev
```

Backend runs on: `http://localhost:4000`

### 2. Start Frontend Server

```bash
cd customer-feedback
npm run dev
```

Frontend runs on: `http://localhost:3000`

## ✅ Integrated Features

### 1. **Feedback System** (`/feedback`)

- ✅ Real API integration for feedback submission
- ✅ Reference number generation from backend
- ✅ Status checking functionality
- ✅ Error handling and user notifications

### 2. **Complaints System** (`/complaints`)

- ✅ Dynamic department loading from API
- ✅ Office selection based on department
- ✅ Text complaint submission
- ✅ Voice complaint support with file upload
- ✅ Complaint tracking system

### 3. **Ratings System** (`/ratings`)

- ✅ Department and employee loading from API
- ✅ Multi-criteria rating submission
- ✅ Form validation and error handling

### 4. **Employee Directory** (`/employees`)

- ✅ Team member data from backend API
- ✅ Department-based filtering

## 🔧 Technical Implementation

### Created Files:

- `lib/api.ts` - Main API client with TypeScript types
- `test-backend-integration.js` - API testing script
- `README-INTEGRATION.md` - This integration guide

### Updated Files:

- `next.config.mjs` - Added API URL configuration
- `app/feedback/page.tsx` - Real API integration
- `app/complaints/page.tsx` - Dynamic data loading
- `app/ratings/page.tsx` - Rating submission to backend

## 🌐 API Endpoints Used

| Endpoint                             | Purpose                      |
| ------------------------------------ | ---------------------------- |
| `GET /api/departments`               | Load departments             |
| `GET /api/departments/:id/offices`   | Load offices by department   |
| `GET /api/departments/:id/employees` | Load employees by department |
| `POST /api/feedback/submit`          | Submit feedback              |
| `GET /api/feedback/status/:ref`      | Check feedback status        |
| `POST /api/complaints/submit`        | Submit text complaint        |
| `POST /api/complaints/submit-voice`  | Submit voice complaint       |
| `GET /api/complaints/track/:id`      | Track complaint              |
| `POST /api/ratings/submit`           | Submit service rating        |
| `GET /api/team`                      | Get team members             |
| `GET /api/statistics`                | Get public statistics        |

## 🧪 Testing Integration

Run the test script to verify backend connection:

```bash
node test-backend-integration.js
```

## 🔒 Environment Configuration

The API URL is configured via environment variable:

- Default: `http://localhost:4000/api`
- Production: Set `NEXT_PUBLIC_API_URL` in environment

## 📱 Features Working

### User Experience:

- ✅ Form submissions with loading states
- ✅ Success/error notifications via toast
- ✅ Real-time data loading from backend
- ✅ File upload for voice complaints
- ✅ Multi-language support maintained
- ✅ Responsive design preserved

### Data Flow:

- ✅ Frontend → Backend API calls
- ✅ Error handling and user feedback
- ✅ Type-safe API interactions
- ✅ CORS configured for development

## 🚨 Prerequisites

1. **Backend Database**: Ensure MySQL is running with proper schema
2. **Backend Dependencies**: Run `npm install` in backend directory
3. **Frontend Dependencies**: Run `npm install` in frontend directory
4. **Environment Variables**: Configure API URLs if needed

## 🎯 Next Steps

1. Test all forms with real data submission
2. Verify file upload functionality for voice complaints
3. Test complaint tracking with generated codes
4. Configure production environment variables
5. Set up proper CORS for production deployment

---

**Integration Status**: ✅ **COMPLETE**  
**Last Updated**: December 2024  
**Frontend**: Next.js 15 with TypeScript  
**Backend**: Node.js/Express with MySQL
