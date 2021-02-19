const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const chatsRoutes = require("./routes/chats");
const usersRoutes = require("./routes/users");
const profileRoutes = require("./routes/profile");

const PORT = process.env.PORT || 8080;

const app = express();

app.use(cors());
app.use(express.json());
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use("/auth", authRoutes);
app.use("/chats", chatsRoutes);
app.use("/users", usersRoutes);
app.use("/profile", profileRoutes);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

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
