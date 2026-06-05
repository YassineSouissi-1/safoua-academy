# 🤖 Hugging Face Chatbot Integration Guide

## Overview
Your Safoua Academy project now has a fully integrated Hugging Face-powered chatbot using the **Mistral-7B-Instruct** model.

## Architecture

### Frontend (React + Vite)
- **File**: `safoua-frontend/src/components/Chatbot.jsx`
- **Features**:
  - Floating chat widget with toggle button
  - Real-time message display with user/bot differentiation
  - Loading state with animated spinner
  - Error handling with user-friendly messages
  - Auto-scroll to latest message
  - Responsive design with Tailwind CSS

### Backend (Node.js + Express)
- **File**: `safoua-backend/server.js`
- **Endpoint**: `POST /api/chat`
- **Features**:
  - Uses Hugging Face Inference SDK for reliable API calls
  - Mistral-7B-Instruct model for responses
  - Environment variable-based configuration
  - Comprehensive error handling
  - Support for future model changes

## Setup Requirements

### Backend Dependencies
```
@huggingface/inference: ^4.13.15
express: ^5.2.1
cors: ^2.8.6
dotenv: ^17.3.1
axios: ^1.13.6
bcrypt: ^6.0.0
mongoose: ^9.2.1
```

### Environment Variables (`.env` in backend)
```
PORT=5000
MONGO_URI=mongodb+srv://...
HF_TOKEN=hf_xxxxxxxxxxxxxxxxxxxx  # Your Hugging Face API Token
```

### Get Your Hugging Face Token
1. Visit https://huggingface.co
2. Create/login to your account
3. Go to Settings > Access Tokens
4. Create a new access token with "Read" permissions
5. Copy and paste it in your `.env` file

## Running the Project

### 1. Start the Backend
```bash
cd safoua-backend
npm install
npm start  # or npm run dev for development with nodemon
```

### 2. Start the Frontend
```bash
cd safoua-frontend
npm install
npm run dev
```

### 3. Access the Application
- Frontend: `http://localhost:5173` (or the port shown in terminal)
- Chatbot: Click the floating chat icon in the bottom-right corner

## Available Models

Currently using: **Mistral-7B-Instruct-v0.3**

To change the model, edit `safoua-backend/server.js` and change:
```javascript
model: "mistralai/Mistral-7B-Instruct-v0.3"
```

### Other Recommended Models
- `meta-llama/Llama-2-7b-chat-hf` - Meta's Llama
- `tiiuae/falcon-7b-instruct` - Falcon
- `bigcode/starcoder` - For code-related questions

## API Response Examples

### Successful Response
```json
{
  "reply": "Bonjour! Je serais ravi de vous aider avec vos questions..."
}
```

### Error Response
```json
{
  "error": "Le modèle est actuellement surchargé. Veuillez réessayer dans quelques instants."
}
```

## Features Implemented

✅ Real-time chat interface  
✅ Hugging Face API integration  
✅ Loading states with spinner  
✅ Error handling and user feedback  
✅ Message history in session  
✅ Responsive design  
✅ Auto-scroll to latest message  
✅ Enter key to send message  
✅ Environment-based API URL configuration  

## Customization Options

### Change Chat Styling
Edit the Tailwind CSS classes in `Chatbot.jsx`:
- Colors: `bg-emerald-600` for theme color
- Size: `w-[350px] h-[450px]` for chat box dimensions
- Position: `bottom-6 right-6` for floating button position

### Adjust Model Parameters
In `server.js`:
```javascript
parameters: {
  max_new_tokens: 500,      // Max response length
  temperature: 0.7,          // Creativity level (0-1)
}
```

### Add Context/System Messages
Modify the input to the model:
```javascript
inputs: `You are a helpful AI assistant for education. User: ${message}`
```

## Troubleshooting

### ❌ "API Token Invalid" Error
- Verify your HF_TOKEN in `.env` is correct
- Check token has "Read" permissions

### ❌ "Model Overloaded" Error
- Model is busy; wait a few seconds and try again
- Consider using a smaller model if this happens frequently

### ❌ CORS Error
- Ensure backend is running on `http://localhost:5000`
- Check CORS middleware is enabled in server.js

### ❌ "Cannot POST /api/chat"
- Verify backend server is running
- Check API endpoint URL in frontend `.env`

## Next Steps

1. **Customize the system prompt** - Add context about Safoua Academy
2. **Store chat history** - Save messages to database for user reference
3. **Add user authentication** - Link chat history to logged-in users
4. **Implement typing indicator** - Show "user is typing" state
5. **Add multiple models** - Let users choose different models
6. **Rate limiting** - Prevent API abuse

## Resources

- [Hugging Face Documentation](https://huggingface.co/docs)
- [Hugging Face Inference API](https://huggingface.co/inference-api)
- [Mistral Model Card](https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.3)
