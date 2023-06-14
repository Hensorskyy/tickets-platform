import mongoose, { Document, Model, Schema } from "mongoose";

import { Password } from "../services.ts/password";

interface UserAttrs {
  email: string;
  password: string;
}

interface UserModel extends Model<UserDoc> {
  build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends Document, UserAttrs {}

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        (ret.id = ret._id), delete ret._id, delete ret.password, delete ret.__v;
      },
    },
  }
);

userSchema.pre("save", function (next) {
  const passwordField = "password";

  if (this.isModified(passwordField)) {
    const hashedPassword = Password.toHash(this.get(passwordField));
    this.set(passwordField, hashedPassword);
  }
  next();
});
userSchema.statics.build = (attrs: UserAttrs) => {
  return new User(attrs);
};

const User = mongoose.model<UserDoc, UserModel>("User", userSchema);

export { User };
