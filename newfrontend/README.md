# NeuroFleetX Frontend

A comprehensive AI-powered urban fleet and traffic intelligence platform frontend built with Vite, React, and Tailwind CSS.

## Features

### 🔐 Authentication System
- **JWT-based Authentication**: Secure token generation and validation
- **Role-based Access Control**: Support for 4 user roles (Admin, Fleet Manager, Driver, Customer)
- **Protected Routes**: Components restricted to specific roles
- **Session Management**: Automatic logout on token expiration
- **Password Strength Validation**: Real-time password strength indicators

### 👥 User Roles & Dashboards

#### Admin Dashboard
- System overview with key metrics
- Total users, fleets, and bookings
- Revenue and trip analytics
- System health monitoring
- Recent activity tracking

#### Fleet Manager Dashboard
- Vehicle fleet management
- Real-time vehicle tracking
- Driver management
- Maintenance scheduling
- Revenue analytics

#### Driver Dashboard
- Current trip management
- Earnings tracking
- Performance metrics
- Trip history
- Driver ratings

#### Customer Dashboard
- Ride booking interface
- Trip tracking
- Booking history
- Payment management
- Eco-impact tracking

### 🎨 UI/UX Features
- **Modern Design**: Clean, professional interface with Tailwind CSS
- **Responsive Layout**: Mobile-friendly design
- **Interactive Components**: Smooth animations and transitions
- **Real-time Updates**: Live tracking and notifications
- **Data Visualization**: Charts and analytics with Recharts

## Technology Stack

- **Frontend Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: React Icons
- **Charts**: Recharts
- **Authentication**: JWT (localStorage based)

## Project Structure

```
src/
├── components/
│   ├── Navbar.js              # Navigation bar with user info & logout
│   └── ProtectedRoute.js      # Role-based route guard
├── context/
│   └── AuthContext.js         # Authentication context and state management
├── pages/
│   ├── Login.js               # Login page with role selector
│   ├── Register.js            # Registration page with validation
│   └── Unauthorized.js        # Access denied page
├── dashboards/
│   ├── AdminDashboard.js      # Admin dashboard with metrics
│   ├── FleetManagerDashboard.js # Fleet manager dashboard
│   ├── DriverDashboard.js     # Driver dashboard
│   └── CustomerDashboard.js   # Customer dashboard
├── services/
│   ├── apiClient.js           # Axios instance with interceptors
│   └── services.js            # API service methods
├── utils/
│   └── authUtils.js           # JWT token management utilities
└── App.jsx                    # Main app with routing
```

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Instructions

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:5173`

## Usage

### Login Flow
1. Navigate to `/login`
2. Select your role (Admin, Fleet Manager, Driver, Customer)
3. Enter your email and password
4. System validates credentials and redirects to role-specific dashboard

### Registration Flow
1. Navigate to `/register`
2. Fill in personal information
3. Select your role
4. Provide role-specific fields (Company Name for Fleet Manager, License Number for Driver)
5. Create a strong password with validation
6. Submit registration and redirect to login

### Dashboard Navigation
- Each role has a dedicated dashboard with relevant features
- Navigation bar provides quick access to dashboard and logout
- Protected routes ensure users can only access authorized pages

## API Integration

### Expected Backend Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh-token` - Token refresh
- `POST /api/auth/verify-token` - Token verification

#### Dashboard Metrics
- `GET /api/dashboard/admin/metrics` - Admin dashboard data
- `GET /api/dashboard/fleet-manager/metrics` - Fleet manager data
- `GET /api/dashboard/driver/metrics` - Driver data
- `GET /api/dashboard/customer/metrics` - Customer data

#### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/:id` - Get user by ID

## Authentication

### JWT Token Management
The application uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatic token expiration checking
- Request interceptors add tokens to API calls
- Response interceptors handle 401 errors with auto-logout

### Role-Based Access Control
- Protected routes check user roles before rendering components
- Unauthorized users are redirected to the login page
- Access denied page shows for insufficient permissions

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- Uses ESLint for code linting
- Follows React best practices
- Component-based architecture
- Custom hooks for state management

## Security Considerations

### Current Implementation
- JWT tokens stored in localStorage (consider HttpOnly cookies for production)
- Password strength validation
- Role-based access control
- Input validation and sanitization

### Production Recommendations
1. **Use HTTPS** for all communications
2. **Implement HttpOnly cookies** for token storage
3. **Add rate limiting** to authentication endpoints
4. **Enable CORS** properly on backend
5. **Implement audit logging** for sensitive actions
6. **Add two-factor authentication** (2FA)

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- **Page load time**: < 2 seconds
- **Dashboard render**: < 500ms
- **API response time**: < 1 second (expected)

## Future Enhancements

1. **Two-factor authentication (2FA)**
2. **OAuth social login integration**
3. **Remember me functionality**
4. **Password reset flow**
5. **Email verification**
6. **Real-time notifications**
7. **Advanced user management**
8. **Role customization**
9. **Activity tracking dashboard**
10. **Mobile app integration**

## Testing

### Manual Testing Checklist
- [x] Login with valid credentials
- [x] Login with invalid credentials
- [x] Registration with all roles
- [x] Role-specific dashboard access
- [x] Unauthorized access handling
- [x] Token expiration handling
- [x] Logout functionality
- [x] Form validation
- [x] Responsive design
- [x] Error handling

## Support & Maintenance

For issues or questions:
1. Check the console for error messages
2. Verify API endpoints are accessible
3. Ensure environment variables are correctly set
4. Review browser console for network errors

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Development Ready
