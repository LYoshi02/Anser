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
        participants: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
        ],
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
      admins: {
        type: [
          {
            type: Schema.Types.ObjectId,
            ref: "User",
          },
        ],
        default: undefined,
      },
      image: {
        filename: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    },
  },
  { timestamps: true }
);

module.exports = model("Chat", ChatSchema);
