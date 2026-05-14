import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
   {
      firstName: {
         type: String,
         required: true,
      },
      lastName: {
         type: String,
         required: true,
      },
      username: {
         type: String,
         required: true,
         unique: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      passwordHash: {
         type: String,
         required: true,
      },
      role: {
         type: String,
         default: 'USER',
      },
      profileImage: {
         type: String,
         default: null,
      },
   },
   { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
