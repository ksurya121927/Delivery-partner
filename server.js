
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Server status
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "User Details API Running"
  });
});

// Save user details
app.post("/api/user", async (req, res) => {
  try {
    const { name, mobile_number, city } = req.body;

    if (!name || !mobile_number || !city) {
      return res.status(400).json({
        success: false,
        message: "Name, mobile number and city required"
      });
    }

    const mobile = String(mobile_number).trim();

    if (!/^[6-9]\d{9}$/.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Enter valid 10 digit mobile number"
      });
    }

    const { data, error } = await supabase
      .from("user_details")
      .insert([{
        name: String(name).trim(),
        mobile_number: mobile,
        city: String(city).trim()
      }])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: "User details saved successfully",
      user: data
    });

  } catch (error) {
    console.error(error.message);

    res.status(500).json({
      success: false,
      message: "Unable to save user details"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
