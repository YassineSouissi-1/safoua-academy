import mongoose from 'mongoose';

/**
 * ChatHistory — persists conversation history per user in MongoDB.
 * Replaces the in-memory Map in chat.js so history survives restarts/redeploys.
 *
 * messages[] stores the last MAX_MESSAGES turns (user + assistant pairs).
 * updatedAt is auto-maintained by Mongoose timestamps.
 */

const ChatHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    messages: {
      type: [
        {
          role:    { type: String, enum: ['user', 'assistant'], required: true },
          content: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model('ChatHistory', ChatHistorySchema);
