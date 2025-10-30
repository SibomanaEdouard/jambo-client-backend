# Client Backend API

A secure Node.js backend API for user authentication and financial transactions with TypeScript, MongoDB, and comprehensive documentation.

## 🚀 Features

- **JWT Authentication** - Secure user registration and login
- **Device Verification** - Device-based security
- **Financial Transactions** - Deposit and withdrawal operations
- **Transaction History** - Paginated transaction records
- **Rate Limiting** - Protection against brute force attacks
- **Security Headers** - Enhanced security with Helmet.js
- **API Documentation** - Interactive Swagger/OpenAPI documentation
- **Input Validation** - Comprehensive request validation
- **Docker Support** - Containerized deployment

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Express Validator
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure
src/
├── controllers/ # Route controllers
├── middlewares/ # Custom middleware functions
├── routes/ # API route definitions
├── services/ # Business logic layer
├── models/ # Database models
└── server.ts # Application entry point


## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB 5.0+
- npm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SibomanaEdouard/jambo-client-backend.git
   cd client-backend

   
2.  Install  Dependencies
 npm install  
3. Environment Configuration
  cp .env.example .env
  PORT=5000
MONGODB_URI=mongodb://localhost:27017/client-db
JWT_SECRET=your-super-secret-jwt-key
CLIENT_URL=http://localhost:3000
NODE_ENV=development


4. Start the application
  # Development
npm run dev

# Production
npm start

# Build
npm run build

📚 API Documentation
Once running, access the interactive API documentation:

Swagger UI: http://localhost:5000/api-docs

Health Check: http://localhost:5000/api/health

API Base URL: http://localhost:5000/api


Authentication Endpoints

Method	Endpoint	Description	Authentication
POST	/api/auth/register	Register new user	None
POST	/api/auth/login	User login	None

Transaction Endpoints

Method	Endpoint	Description	Authentication
POST	/api/transactions/deposit	Deposit funds	JWT Required
POST	/api/transactions/withdraw	Withdraw funds	JWT Required
GET	/api/transactions/history	Transaction history	JWT Required


Request Examples
Register:

json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "deviceId": "device-123456"
}

Login:
{
  "email": "john@example.com",
  "password": "password123",
  "deviceId": "device-123456"
}

Deposit:
{
  "amount": 100.50,
  "description": "Initial deposit"
}
🐳 Docker Deployment
Using Docker Compose
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes
docker-compose down -v

🤝 Contributing
Fork the repository

Create a feature branch (git checkout -b feature/amazing-feature)

Commit changes (git commit -m 'Add amazing feature')

Push to branch (git push origin feature/amazing-feature)

Open a Pull Request

📄 License
This project is licensed under the MIT License.

🆘 Support
For support, email sibomanaedouard974@gmail.com or create an issue in the repository.

Built  using TypeScript, Express, and MongoDB
