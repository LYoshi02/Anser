const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const { v4: uuid } = require("uuid");

const authRoutes = require("./routes/auth");
const chatsRoutes = require("./routes/chats");
const groupRoutes = require("./routes/group");
const usersRoutes = require("./routes/users");
const profileRoutes = require("./routes/profile");

const PORT = process.env.PORT || 8080;

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload");
  },
  filename: (req, file, cb) => {
    cb(null, uuid());
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    return cb(null, true);
  }

  return cb(null, false);
};

app.use(cors());
app.use(express.json());
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 Megabytes
    },
  }).single("image")
);
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use("/auth", authRoutes);
app.use("/chats", chatsRoutes);
app.use("/group", groupRoutes);
app.use("/users", usersRoutes);
app.use("/profile", profileRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  console.log(error);
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.z4xmb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    }
  )
  .then(() => {
    const server = app.listen(PORT);
    const io = require("./socket").init(server);

    io.on("connection", (socket) => {
      socket.on("startConversation", ({ userId }, callback) => {
        socket.join(userId);
      });

      socket.on("newUser", ({ user }) => {
        socket.broadcast.emit("addNewUser", { user });
      });
    });
  })
  .catch((error) => {
    console.log(error);
  });
