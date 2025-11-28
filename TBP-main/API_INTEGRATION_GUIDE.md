# Travel Booking Platform - API Integration Guide

## 🚀 Real API Integration

This travel booking platform now supports real API integrations with major travel service providers. The system is designed to work with both real APIs and fallback to mock data when APIs are not configured.

## 🔧 Backend Setup

### 1. Start the Backend Server

```bash
cd "TBP Back/demo"
./mvnw spring-boot:run
```

The backend will start on `http://localhost:8080`

### 2. Database Setup

Make sure MySQL is running and create a database:

```sql
CREATE DATABASE demo_db;
```

Update the database credentials in `application.properties` if needed.

## 🌐 API Integrations

### Amadeus API (Flights & Hotels)

The platform integrates with Amadeus API for real flight and hotel data. Amadeus provides comprehensive travel data including flights, hotels, and other travel services.

#### Setup Steps:

1. **Get API Credentials:**
   - Visit [Amadeus for Developers](https://developers.amadeus.com/)
   - Create a free account
   - Get your API Key and API Secret

2. **Configure API Keys:**
   Edit `TBP Back/demo/src/main/resources/application.properties`:
   ```properties
   amadeus.api.key=YOUR_AMADEUS_API_KEY
   amadeus.api.secret=YOUR_AMADEUS_API_SECRET
   ```

3. **API Endpoints Used:**
   - **Flights:** `https://test.api.amadeus.com/v2/shopping/flight-offers`
   - **Hotels:** `https://test.api.amadeus.com/v1/reference-data/locations/hotels/by-city`
   - **Authentication:** `https://test.api.amadeus.com/v1/security/oauth2/token`

**Note:** Amadeus API provides both flight and hotel data, so no additional APIs are needed!

### Mock Data Fallback

If API keys are not configured, the system automatically falls back to realistic mock data for:
- **Flights:** American Airlines, Delta, United with realistic pricing
- **Hotels:** Grand Plaza, Business Center, Budget Inn with amenities
- **Cabs:** Uber, Lyft, Local Taxi with estimated durations

## 🎯 Frontend Features

### Enhanced Booking Components

#### 1. Flight Booking (`/flights`)
- **Real-time Search:** Airport codes, dates, passenger count
- **Flight Results:** Airline, flight numbers, times, pricing
- **Booking Integration:** JWT-protected booking system
- **Visual Design:** Material-UI cards with flight icons

#### 2. Hotel Booking (`/hotels`)
- **City-based Search:** City codes, check-in/out dates
- **Hotel Details:** Ratings, amenities, pricing per night
- **Room Configuration:** Guests and rooms selection
- **Rich Display:** Hotel ratings, amenity chips

#### 3. Cab Booking (`/cabs`)
- **Location-based:** Pickup and dropoff addresses
- **Time Scheduling:** DateTime picker for pickup time
- **Provider Options:** Multiple cab services with pricing
- **Duration Estimates:** Realistic travel time calculations

## 🔐 Authentication System

### JWT Implementation
- **Secure Login/Register:** Password hashing with BCrypt
- **Token-based Auth:** JWT tokens for API access
- **Protected Routes:** Authentication required for booking
- **Session Management:** Stateless authentication

### User Management
- **Profile Management:** Update user information
- **Booking History:** Track all user bookings
- **Dashboard:** Overview of user's travel plans

## 📱 Modern UI/UX

### Material-UI Components
- **Responsive Design:** Mobile-first approach
- **Loading States:** Spinner indicators during API calls
- **Error Handling:** User-friendly error messages
- **Visual Feedback:** Icons, cards, and color coding

### User Experience
- **Real-time Validation:** Form validation with helpful messages
- **Progressive Enhancement:** Works without JavaScript
- **Accessibility:** ARIA labels and keyboard navigation
- **Performance:** Optimized API calls and caching

## 🛠️ Development Features

### Backend Architecture
- **Spring Boot:** Modern Java framework
- **RESTful APIs:** Clean, consistent endpoints
- **Service Layer:** Separation of concerns
- **Error Handling:** Comprehensive exception management

### Frontend Architecture
- **React Hooks:** Modern state management
- **Component-based:** Reusable UI components
- **API Integration:** Fetch-based HTTP client
- **State Management:** Local state with React hooks

## 🚀 Getting Started

### 1. Clone and Setup
```bash
git clone <repository-url>
cd TBP-main
npm install
```

### 2. Start Frontend
```bash
npm run dev
```

### 3. Start Backend
```bash
cd "TBP Back/demo"
./mvnw spring-boot:run
```

### 4. Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080
- **API Documentation:** http://localhost:8080/swagger-ui/ (if enabled)

## 🔧 Configuration Options

### Environment Variables
You can also use environment variables instead of `application.properties`:

```bash
export AMADEUS_API_KEY=your_key_here
export AMADEUS_API_SECRET=your_secret_here
```

### API Rate Limits
- **Amadeus Free Tier:** 2000 requests/month
- **Mock Data:** Unlimited (no external calls)

## 📊 API Response Examples

### Flight Search Response
```json
{
  "flightNumber": "AA101",
  "airline": "American Airlines",
  "from": "JFK",
  "to": "LAX",
  "departureTime": "2024-01-15T08:00:00",
  "arrivalTime": "2024-01-15T11:30:00",
  "price": 299.99,
  "currency": "USD"
}
```

### Hotel Search Response
```json
{
  "hotelId": "HOTEL001",
  "name": "Grand Plaza Hotel",
  "city": "New York",
  "checkIn": "2024-01-15",
  "checkOut": "2024-01-17",
  "pricePerNight": 199.99,
  "rating": 4.5,
  "amenities": ["WiFi", "Pool", "Gym", "Restaurant"]
}
```

## 🎉 Production Ready Features

- ✅ **Real API Integration**
- ✅ **JWT Authentication**
- ✅ **Responsive Design**
- ✅ **Error Handling**
- ✅ **Loading States**
- ✅ **Form Validation**
- ✅ **Booking System**
- ✅ **User Management**
- ✅ **Mock Data Fallback**
- ✅ **Modern UI/UX**

## 🔮 Future Enhancements

- **Payment Integration:** Stripe/PayPal integration
- **Email Notifications:** Booking confirmations
- **Real-time Updates:** Live pricing and availability
- **Mobile App:** React Native version
- **Admin Dashboard:** Management interface
- **Analytics:** User behavior tracking
- **Multi-language:** Internationalization support

---

**Note:** This platform is designed to be production-ready with real API integrations while maintaining a smooth development experience with mock data fallbacks.
