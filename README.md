# Fastify Backend with Authentication on Vercel

A comprehensive backend API built with Fastify.js, featuring user authentication, email verification, and CRUD operations, designed to run on Vercel serverless functions.

## Features

- **User Authentication**: Registration, login, email verification
- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Tokens**: Secure authentication with JSON Web Tokens
- **Email Verification**: Custom verification codes sent via Nodemailer
- **CRUD Operations**: Complete REST API for posts/content
- **MySQL Database**: Persistent data storage
- **Vercel Ready**: Optimized for serverless deployment

## Project Structure

```
project/
├── api/
│   └── index.ts         # Main serverless function
├── src/
│   └── app.ts           # Fastify app
│   └── api/routes/      # Fastify routes
│   └── libs/            # Fastify utility functions
├── package.json         # Dependencies and scripts
├── vercel.json          # Vercel configuration
└── .env.local           # Environment variables (local)
```

## Setup Instructions

### 1. Install Dependencies

packages used to create this backend

- fastify
- fastify-cors
- fastify-helmet
- fastify-plugin
- @fastify/cors
- @fastify/jwt
- @fastify/rate-limit
- @fastify/cookie
- bcrypt
- nanoid
- dotenv
- nodemailer
- mysql2
- dotenv@16.4.5 (for node 20 specific and do not use dotenv v17 or above)

dev dependencies

- nodemon
- @types/node
- @types/nodemailer
- @types/bcrypt
- @types/dotenv
- vercel

install all dependencies

```bash
bun add fastify fastify-cors @fastify/cookie @fastify/rate-limit fastify-helmet fastify-plugin @fastify/cors @fastify/jwt bcrypt nanoid nodemailer sequelize mysql2 zod dotenv@16.4.5
```

install dev dependencies

```bash
bun add --dev typescript @types/node @types/nodemailer @types/bcrypt @types/dotenv vercel
```

### 2. Database Setup

Create a MySQL database and note the connection details. You can use:

- **Local MySQL**: Install MySQL locally
- **PlanetScale**: Free MySQL-compatible database
- **Railway**: Database hosting service
- **AWS RDS**: Amazon's managed database service

### 3. Environment Variables

Create a `.env.local` file in your project root:

```bash
touch .env
```

```env.local
# Database Configuration
DB_HOST=your-mysql-host
DB_USER=your-mysql-username
DB_PASSWORD=your-mysql-password
DB_NAME=your-database-name
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters

# Email Configuration (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Node Environment
NODE_ENV=development
```

### 4. Email Setup (Gmail Example)

1. Enable 2-factor authentication on your Gmail account
2. Generate an "App Password" in your Google account settings
3. Use this app password (not your regular password) in `SMTP_PASS`

### 5. Local Development

```bash
bun dev
```

This will start the Vercel development server at `http://localhost:3000/api`

### 6. Deploy to Vercel

1. Check if the latest version of @vercel/node is installed:
   for ex @vercel/node@5.3.5 for this project

```bash
npm show @vercel/node versions
```

2. Install Vercel CLI:

```bash
npm install -g vercel
```

3. Login to Vercel:

```bash
vercel login
```

4. Deploy:

```bash

vercel --prod

```

5. Add environment variables in Vercel dashboard:
   - Go to your project settings
   - Add all environment variables from your `.env.local`

## API Endpoints

### Authentication

- **POST** `/auth/register` - User registration
- **POST** `/auth/verify` - Email verification
- **POST** `/auth/login` - User login
- **GET** `/auth/me` - Get current user (requires auth)

### Posts (CRUD Operations)

- **GET** `/posts` - Get all posts
- **GET** `/posts/:id` - Get single post
- **POST** `/posts` - Create post (requires auth)
- **PUT** `/posts/:id` - Update post (requires auth)
- **DELETE** `/posts/:id` - Delete post (requires auth)

### Utility

- **GET** `/health` - Health check endpoint

## Usage Examples

### Register a new user

```javascript
const response = await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "securepassword123",
    fullname: "John Doe",
  }),
});
```

### Verify email

```javascript
const response = await fetch("/api/auth/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    code: "123456",
  }),
});
```

### Login

```javascript
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "user@example.com",
    password: "securepassword123",
  }),
});

const data = await response.json();
const token = data.token;
```

### Create a post (authenticated)

```javascript
const response = await fetch("/api/posts", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: "My First Post",
    content: "This is the content of my post.",
  }),
});
```

## Database Schema

### Users Table

- `id` - Primary key
- `email` - Unique email address
- `password` - Bcrypt hashed password
- `fullname` - User's full name
- `google_id` - Google OAuth ID (for future Google auth)
- `is_verified` - Email verification status
- `verification_code` - Temporary verification code
- `verification_expires` - Code expiration time
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Posts Table

- `id` - Primary key
- `title` - Post title
- `content` - Post content
- `user_id` - Foreign key to users table
- `created_at` - Post creation timestamp
- `updated_at` - Last update timestamp

## Security Features

- **Password Hashing**: Bcrypt with 12 salt rounds
- **JWT Tokens**: Secure authentication tokens
- **Email Verification**: Required before account activation
- **Input Validation**: Server-side validation for all endpoints
- **Authorization**: User-specific resource access control
- **CORS Protection**: Configured for your frontend domain

## Error Handling

The API returns consistent error responses:

```javascript
{
  "error": "Error message description"
}
```

Common HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Performance Considerations

- **Connection Pooling**: MySQL connections are properly managed
- **Lightweight**: Minimal dependencies for faster cold starts
- **Caching**: Consider adding Redis for session management in production
- **Database Indexes**: Add indexes on frequently queried fields

## Future Enhancements

- Google OAuth integration
- Rate limiting
- Password reset functionality
- User profile management
- File upload support
- Real-time notifications

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this code in your projects.
