# Interview Prep AI - Backend

A Node.js/Express REST API for Interview Prep AI, an intelligent interview preparation platform powered by Google Gemini AI.

## 🚀 Features

- **AI-Powered Question Generation**: Generate personalized interview questions based on user role and experience
- **Concept Explanations**: Get AI-powered explanations for interview concepts
- **User Authentication**: Secure JWT-based authentication
- **Session Management**: Create and manage interview preparation sessions
- **Question Organization**: Pin, filter, and organize interview questions
- **Profile Management**: User profiles with avatar uploads
- **Real-time API**: Fast, responsive API endpoints
- **Error Handling**: Comprehensive error handling and logging

## 📋 Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **AI Integration**: Google Generative AI (Gemini)
- **File Upload**: Multer
- **Environment**: dotenv
- **CORS**: Cross-Origin Resource Sharing enabled

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB Atlas account (free tier available)
- Google Gemini API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Muhammadyaqoobwako/interview-prep-backend.git
cd interview-prep-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-secret-key-here

# AI
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash

# Server
PORT=8000
```

**Get your credentials:**
- MongoDB Atlas: [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Gemini API: [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)

4. **Start the server**

Development (with nodemon):
```bash
npm run dev
```

Production:
```bash
npm start
```

Server will run on `http://localhost:8000`

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update user profile (protected)
- `POST /api/auth/upload-image` - Upload profile image (protected)

### Sessions
- `GET /api/sessions` - Get all user sessions (protected)
- `POST /api/sessions` - Create new session (protected)
- `GET /api/sessions/:id` - Get session details (protected)
- `PUT /api/sessions/:id` - Update session (protected)
- `DELETE /api/sessions/:id` - Delete session (protected)

### Questions
- `POST /api/questions/add` - Add question to session (protected)
- `PUT /api/questions/:id/pin` - Pin/unpin question (protected)
- `PUT /api/questions/:id/note` - Add note to question (protected)

### AI
- `POST /api/ai/generate-questions` - Generate interview questions (protected)
- `POST /api/ai/generate-explanation` - Generate concept explanation (protected)

### Health Check
- `GET /api/health/gemini` - Check Gemini API status

## 📊 Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  profilePhoto: String,
  createdAt: Date
}
```

### Session
```javascript
{
  userId: ObjectId,
  jobRole: String,
  jobDescription: String,
  experience: String,
  questions: [ObjectId],
  createdAt: Date
}
```

### Question
```javascript
{
  sessionId: ObjectId,
  question: String,
  answer: String,
  isPinned: Boolean,
  note: String,
  createdAt: Date
}
```

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Tokens are returned on successful login and are valid for 7 days.

## 🚀 Deployment

### Deploy on Railway (Recommended)

1. Push code to GitHub
2. Connect GitHub to [Railway](https://railway.app)
3. Create new project from repository
4. Add environment variables in Railway dashboard
5. Deploy automatically

See [DEPLOYMENT.md](../DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

Health check endpoint:
```bash
curl https://your-backend-url/api/health/gemini
```

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `GEMINI_MODEL` | Gemini model version | Yes |
| `PORT` | Server port (default: 8000) | No |

## 🐛 Troubleshooting

### "MONGO_URI not set"
- Check `.env` file exists and has correct MongoDB connection string
- Verify MongoDB Atlas cluster is active

### "GEMINI_API_KEY not set"
- Get API key from [aistudio.google.com](https://aistudio.google.com/app/apikey)
- Ensure key is copied correctly to `.env`

### CORS Errors
- Frontend URL must be added to CORS origins in `server.js`
- Check that requests include proper headers

### 404 Errors on Deployment
- Ensure environment variables are set in deployment platform
- Check that PORT environment variable is configured

## 📚 Next Steps

- Add rate limiting for API endpoints
- Implement caching with Redis
- Add request/response logging
- Implement WebSocket for real-time updates
- Add comprehensive test suite
- Configure monitoring and error tracking

## 📄 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ✨ Credits

Built by Yaqoob | Interview Prep AI

---

**Questions or issues?** Open a GitHub issue or reach out on LinkedIn!
