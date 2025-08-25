const touristSchema = new mongoose.Schema({
    fullName: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    nationality: String,
}, { timestamps: true });
