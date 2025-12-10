const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieparser = require('cookie-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const port = 3000;
const app = express();
const AuthRouter = require('./src/Routers/Auth.js');
const AdminRouter = require('./src/Routers/Admin.js');
const StaffRouter = require("./src/Routers/Staff.js");
const Booking = require("./src/Routers/Booking.js")
dotenv.config();

mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('Kết nối MongoDB thành công'))
    .catch(err => console.error('Lỗi kết nối MongoDB:', err));

app.use(morgan('combined'));
app.use(cors());
app.use(cookieparser());
app.use(express.json());
app.get('/', (req, res) => {
    res.send('Hello, world!')
})

// routing 
app.use("/api/auth", AuthRouter);
app.use("/api/admin", AdminRouter);
app.use("/api/staff", StaffRouter);
app.use("/api/booking", Booking);

app.listen(port, () => console.log("App Listening " + port));