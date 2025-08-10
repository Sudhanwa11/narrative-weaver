import mongoose from 'mongoose';

const diaryEntrySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes a relationship with the User model
    },
    text: {
      type: String,
      required: [true, 'Please add some text to your entry'],
    },
    image: {
      type: String, // URL to the uploaded image
      required: false,
    },
    feeling: {
      type: String, // e.g., 'Happy', 'Sad', 'Anxious', 'Excited'
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const DiaryEntry = mongoose.model('DiaryEntry', diaryEntrySchema);

export default DiaryEntry;