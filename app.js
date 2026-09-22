const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

const port = process.env.PORT || 4555;


app.use(express.json());
app.use(morgan('dev'));



const dbUrl = process.env.DB_URL;

const databaseConnection = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("Database connection failed", error);
  }
}

databaseConnection();


app.get("/", (req, res) => {
  res.send("Hello World");
});

const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
  phone: String,
  address: String,
  course: String,
  institution: String
});

const Student = mongoose.model("Student", studentSchema);

app.post("/create-student", async (req, res) => {
  const { name, age, email, phone, address, course, institution } = req.body;
try {
  const student = new Student({ name, age, email, phone, address, course, institution });
  await student.save();
  return res.status(200).json({ message: "Student created successfully", student });
} catch (error) {
  return res.status(500).json({ message: "Internal server error" });
}
});


app.get("/get-students", async (req, res) => {
  try {
    const students = await Student.find();
    return res.status(200).json({ message: "Students fetched successfully", students });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
}); 


app.get("/get-student/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const student = await Student.findById(id);
    return res.status(200).json({ message: "Student fetched successfully", student });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});


app.put("/update-student/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age, email, phone, address, course, institution } = req.body;
  try {
    const student = await Student.findByIdAndUpdate(id, { name, age, email, phone, address, course, institution }, { new: true });
    return res.status(200).json({ message: "Student updated successfully", student });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get('/get-student-by-name', async (req, res) => {
  const { name } = req.query;
  try {
    const student = await Student.find({ name });
    return res.status(200).json({ message: "Student fetched successfully", student });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.delete("/delete-student/:id", async (req, res) => {

  const { id } = req.params;
  try {
    await Student.findByIdAndDelete(id);
    return res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
