# Weather API Project

This project is a Weather API wrapper service that fetches weather data from a third-party API, caches it, and serves it through its own endpoints. It's designed to showcase best practices in backend development, including authentication, caching, environment variable management, and API documentation.

## ✨ Features

- **Authentication & User Management**: Secure user registration and login using JSON Web Tokens (JWT).
- **Role-Based Access Control (RBAC)**: Differentiates between `user` and `admin` roles to restrict access to certain endpoints.
- **Real-Time Weather Data**: Fetches the current weather for any specified city.
- **Multi-Layer Caching System**:
    - **Redis Cache**: For lightning-fast data retrieval, reducing database load.
    - **Database Cache (MongoDB)**: Stores data for up to 12 hours to minimize redundant calls to the third-party API.
- **Third-Party API Integration**: Utilizes the [Visual Crossing](https://www.visualcrossing.com/weather-api) service for accurate weather data.
- **Comprehensive API Documentation**: Interactive API documentation powered by **Swagger (OpenAPI)** for all endpoints.
- **Environment Variable Management**: Securely manages sensitive information and configurations using a `.env` file.
- **Security**: Implements password hashing using `bcryptjs` for user security.
- **Modular Project Structure**: Clean and organized codebase with a clear separation of concerns.

## 🛠️ Tech Stack

- **Runtime Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis with `ioredis`
- **Authentication**: JSON Web Tokens (`jsonwebtoken`)
- **Password Hashing**: `bcryptjs`
- **API Documentation**: Swagger UI Express & `swagger-jsdoc`
- **Request Logging**: Morgan
- **Environment Variables**: `dotenv`

## 📂 Project Structure

```
myProject/
├── Controllers/         # Core application logic (Business Logic)
│   ├── AuthCn.js
│   └── WeatherCn.js
├── middleware/          # Middleware for request processing
│   ├── ExportValidation.js
│   ├── isAdmin.js
│   └── isLogin.js
├── Models/              # Mongoose data schemas
│   ├── UserMd.js
│   └── WeatherMd.js
├── Routes/              # API route definitions
│   ├── Auth.js
│   └── Weather.js
├── Services/            # Auxiliary services like caching
│   └── CacheService.js
├── Utils/               # Utility helpers like Swagger config
│   └── Swagger.js
├── app.js               # Main Express application setup
├── server.js            # Application entry point and database connection
├── config.env           # Environment variables file
└── package.json         # Project dependencies and scripts
```

## 🚀 Getting Started

Follow these steps to run the project locally.

**1. Clone the Repository:**

```bash
git clone <repository-url>
cd myProject
```

**2. Install Dependencies:**

```bash
npm install
```

**3. Create Environment File:**
Create a file named `config.env` in the project root and populate it with the following variables:

```env
PORT=5000
DATA_BASE=mongodb://localhost:27017/weatherDB
JWT_SECRET=YourSuperSecretKeyHere

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379

# 3rd Party Weather API
WEATHER_API_URL=https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline
WEATHER_API_KEY=YOUR_VISUAL_CROSSING_API_KEY
```

**Note**: You need to sign up on the [Visual Crossing](https://www.visualcrossing.com/weather-api) website to get your `WEATHER_API_KEY`.

**4. Run the Server:**
To run the server in development mode (with Nodemon):

```bash
npm run dev
```

To run the server in production mode:

```bash
npm start
```

The server will be running on the port specified in your `config.env` file (e.g., 5000).

## 📚 API Documentation

Full interactive API documentation is available via Swagger at:
`http://localhost:5000/api-docs`

Here is a summary of the available endpoints:

-----

### **Auth Endpoints**

#### `POST /api/auth/register`

**Description**: Registers a new user.
**Request Body**:

```json
{
  "username": "testuser",
  "password": "Password123!"
}
```

**Success Response**:

```json
{
  "success": true,
  "message": "User registered successfully"
}
```

-----

#### `POST /api/auth/`

**Description**: Logs in a user and returns a JWT token.
**Request Body**:

```json
{
  "username": "testuser",
  "password": "Password123!"
}
```

**Success Response**:

```json
{
  "success": true,
  "login": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "60d0fe4f5311236168a109ca",
      "role": "user"
    }
  }
}
```

-----

### **Weather Endpoints**

#### `GET /api/weather/current`

**Description**: Retrieves the current weather for a specific city. Requires authentication (Bearer Token).
**Query Parameters**:

- `city` (required): The name of the city. e.g., `London`
- `country` (optional): The country code. e.g., `UK`
  **Success Response (from external API)**:

<!-- end list -->

```json
{
  "success": true,
  "data": {
    "_id": "662a5b1f9b3e1c6a3b2e5f8a",
    "city": "london",
    "country": "uk",
    "tempC": 15.5,
    "description": "Partially cloudy",
    "createdAt": "2024-04-25T12:30:55.939Z"
  },
  "source": "external_api",
  "message": "Weather data fetched successfully"
}
```

-----

#### `GET /api/weather/`

**Description**: Fetches all historical weather data records. **This endpoint is restricted to users with the `admin` role.**
**Success Response**:

```json
{
    "success": true,
    "count": 50,
    "pagination": {
        "currentPage": 1,
        "totalPages": 5,
        "nextPage": 2
    },
    "data": [
        {
            "_id": "...",
            "city": "paris",
            "tempC": 18,
            "description": "Sunny"
        },
        "..."
    ]
}
```

-----