const { Schema, model } = require("mongoose");

const ChatSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [
      {
        sender: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        global: {
          type: Boolean,
        },
      },
    ],
    group: {
      creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
        trim: true,
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Chat", ChatSchema);
