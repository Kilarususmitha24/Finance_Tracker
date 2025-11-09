// Test script to verify registration endpoint
import axios from "axios";

const API_URL = "http://localhost:5000/api";

async function testRegistration() {
  console.log("🧪 Testing Registration Endpoint...\n");

  const testUser = {
    name: "Test User",
    email: "test@example.com",
    password: "test123",
    role: "user"
  };

  try {
    console.log("📝 Attempting to register user:", testUser.email);
    const response = await axios.post(`${API_URL}/auth/register`, testUser);
    
    console.log("✅ Registration successful!");
    console.log("Response:", JSON.stringify(response.data, null, 2));
    
    // Test login
    console.log("\n🔐 Testing Login...");
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    
    console.log("✅ Login successful!");
    console.log("Token:", loginResponse.data.token ? "Received" : "Missing");
    console.log("User:", loginResponse.data.user);
    
  } catch (error) {
    if (error.response) {
      console.error("❌ Error:", error.response.status, error.response.data);
    } else if (error.request) {
      console.error("❌ No response from server. Is the backend running?");
      console.error("💡 Start the backend with: cd backend && node server.js");
    } else {
      console.error("❌ Error:", error.message);
    }
  }
}

testRegistration();

