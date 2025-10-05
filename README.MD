# Node.js E-Commerce Shop

A comprehensive e-commerce web application built with Node.js, featuring a complete MVC architecture, user authentication, payment processing, and administrative functionality.

## 🚀 Features

### Core Functionality
- **User Authentication & Authorization**: Secure registration, login/logout with session management
- **Product Management**: Full CRUD operations for products with image upload support
- **Shopping Cart**: Add/remove products, quantity management
- **Order Processing**: Complete checkout flow with order history
- **Payment Integration**: Stripe payment gateway for secure transactions
- **Email Notifications**: SendGrid integration for order confirmations and user notifications
- **PDF Generation**: Dynamic invoice generation for orders

### Security Features
- **CSRF Protection**: Cross-Site Request Forgery protection
- **Input Sanitization**: Request sanitization middleware
- **Password Hashing**: Bcrypt for secure password storage
- **Session Management**: MongoDB-backed session storage
- **File Upload Security**: Image-only file filtering and secure storage
- **Security Headers**: Comprehensive security headers middleware

### Admin Features
- **Product Management**: Add, edit, delete products
- **Order Management**: View and manage customer orders
- **User Management**: Administrative user controls

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - Database with Mongoose ODM
- **Pug** - Template engine

### Security & Authentication
- **bcryptjs** - Password hashing
- **express-session** - Session management
- **connect-mongodb-session** - MongoDB session store
- **csurf** - CSRF protection
- **express-validator** - Input validation

### File & Email Handling
- **multer** - File upload middleware
- **@sendgrid/mail** - Email service
- **pdfkit** - PDF generation

### Payment Processing
- **stripe** - Payment gateway integration

### Development
- **nodemon** - Development server with auto-restart
- **dotenv** - Environment variables management

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB installation
- SendGrid account for email functionality
- Stripe account for payment processing

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/IlyaBielov/NodeJS---The-Complete-Guide-MVC-REST-APIs-GraphQL-Deno-.git
   cd NodeJS---The-Complete-Guide-MVC-REST-APIs-GraphQL-Deno-
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy the `.env` file and update the following variables with your own values:
   
   ```env
   # Database Configuration
   MONGODB_URI=your_mongodb_connection_string
   
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Session Configuration
   SESSION_SECRET=your-super-secret-session-key-here
   
   # SendGrid Email Configuration
   SENDGRID_API_KEY=your_sendgrid_api_key
   SENDGRID_FROM_EMAIL=your_email@example.com
   SENDGRID_FROM_NAME=Your App Name
   
   # File Upload Configuration
   UPLOAD_PATH=./app/images
   STATIC_PATH=./app/public
   
   # Security Configuration
   BCRYPT_ROUNDS=12
   
   # Application Configuration
   APP_NAME=Node Shop
   APP_VERSION=1.0.0
   
   # Stripe Configuration
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. **Create required directories**
   ```bash
   mkdir -p app/images
   ```

## 🚀 Usage

### Development Mode
```bash
npm start
```
This runs the application with nodemon for automatic restarts on file changes.

### Production Mode
```bash
npm run start-server
```
This runs the application with standard Node.js.

The application will be available at `http://localhost:3000` (or your configured PORT).

## 📁 Project Structure

```
app/
├── controllers/          # Route controllers (MVC)
│   ├── admin.js         # Admin functionality
│   ├── auth.js          # Authentication logic
│   ├── error.js         # Error handling
│   └── shop.js          # Shop functionality
├── middleware/          # Custom middleware
│   ├── is-auth.js      # Authentication middleware
│   └── sanitize.js     # Input sanitization
├── models/             # Database models (MongoDB/Mongoose)
│   ├── order.js        # Order model
│   ├── product.js      # Product model
│   └── user.js         # User model
├── public/             # Static assets
│   ├── css/           # Stylesheets
│   └── js/            # Client-side JavaScript
├── routes/            # Route definitions
│   ├── admin.js       # Admin routes
│   ├── auth.js        # Authentication routes
│   └── shop.js        # Shop routes
├── utils/             # Utility functions
│   ├── fileHelper.js  # File operations
│   ├── path.js        # Path utilities
│   └── pdfMaker.js    # PDF generation
├── views/             # Pug templates
└── app.js             # Main application file
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `PORT` | Server port (default: 3000) | No |
| `SESSION_SECRET` | Secret key for session encryption | Yes |
| `SENDGRID_API_KEY` | SendGrid API key for emails | Yes |
| `SENDGRID_FROM_EMAIL` | Sender email address | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `UPLOAD_PATH` | Path for file uploads | No |
| `BCRYPT_ROUNDS` | Bcrypt hashing rounds | No |

## 🔧 API Endpoints

### Authentication
- `GET /signup` - User registration page
- `POST /signup` - Process user registration
- `GET /login` - User login page
- `POST /login` - Process user login
- `POST /logout` - User logout

### Shop
- `GET /` - Home page with products
- `GET /products` - All products listing
- `GET /products/:productId` - Product details
- `POST /cart` - Add product to cart
- `GET /cart` - View cart
- `POST /cart-delete-item` - Remove item from cart
- `GET /checkout` - Checkout page
- `POST /create-order` - Process order
- `GET /orders` - User order history
- `GET /orders/:orderId` - Order invoice (PDF)

### Admin (Protected Routes)
- `GET /admin/products` - Manage products
- `GET /admin/add-product` - Add new product
- `POST /admin/add-product` - Process new product
- `GET /admin/edit-product/:productId` - Edit product
- `POST /admin/edit-product` - Update product
- `DELETE /admin/product/:productId` - Delete product

## 🛡️ Security Considerations

- All user inputs are sanitized and validated
- Passwords are hashed using bcrypt
- CSRF protection on all forms
- Secure session management
- File upload restrictions (images only)
- Security headers for protection against common attacks
- Environment variables for sensitive configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 📞 Support

For support and questions, please open an issue in the [GitHub repository](https://github.com/IlyaBielov/NodeJS---The-Complete-Guide-MVC-REST-APIs-GraphQL-Deno-/issues).

---

**Note**: This application is designed for educational purposes as part of "The Complete Guide to Node.js" course, covering MVC architecture, REST APIs, GraphQL, and modern web development practices.
