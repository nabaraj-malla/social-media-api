import mongoose from "mongoose";

function emailValidator(val) {
  var emailRegex = /^([a-z0-9_\-\.]+)@user\.([a-z0-5]{2,4})/;
  return emailRegex.test(val);
}

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      minLength: 5,
      unique: true,
      required: true,
    },
    email: {
      type: String,
      validate: {
        validator: emailValidator,
        message: "email format don't matched",
      },
      unique: true,
      required: true,
    },
    password: {
      type: String,
      minLength: 8,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    // followers: {
    //   type: [String],
    // },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // following: {
    //   type: [String],
    // },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      maxLength: 50,
    },
    city: {
      type: String,
      maxLength: 20,
    },
    from: {
      type: String,
      maxLength: 20,
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", userSchema);
