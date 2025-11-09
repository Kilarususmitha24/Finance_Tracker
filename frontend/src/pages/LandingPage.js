import React from "react";
import { Link } from "react-router-dom";
import { useTheme as useThemeContext } from "../contexts/ThemeContext";

const LandingPage = () => {
  const styles = {
    container: {
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #3f51b5, #2196f3)",
      color: "#fff",
      textAlign: "center",
      fontFamily: "'Poppins', sans-serif",
      padding: "0 20px",
    },
    heading: {
      fontSize: "2.8rem",
      fontWeight: "700",
      marginBottom: "15px",
      letterSpacing: "1px",
    },
    paragraph: {
      fontSize: "1.2rem",
      marginBottom: "40px",
      maxWidth: "600px",
      lineHeight: "1.6",
    },
    buttonContainer: {
      display: "flex",
      gap: "20px",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    button: {
      backgroundColor: "#fff",
      color: "#3f51b5",
      border: "none",
      padding: "12px 28px",
      borderRadius: "8px",
      fontSize: "1rem",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.3s ease",
      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
      textDecoration: "none",
      display: "inline-block",
    },
    buttonHover: {
      backgroundColor: "#e3e3e3",
      transform: "scale(1.05)",
    },
    registerButton: {
      backgroundColor: "#4caf50",
      color: "white",
    }
  };

  // simple hover effect handler
  const handleMouseEnter = (e) => {
    const buttonStyle = e.target.getAttribute('data-type') === 'register' 
      ? { ...styles.buttonHover, backgroundColor: '#43a047' }
      : styles.buttonHover;
    Object.assign(e.target.style, buttonStyle);
  };

  const handleMouseLeave = (e) => {
    const isRegister = e.target.getAttribute('data-type') === 'register';
    const style = isRegister 
      ? { ...styles.button, ...styles.registerButton }
      : styles.button;
    Object.assign(e.target.style, style);
  };

  // Initialize button styles on component mount
  React.useEffect(() => {
    const buttons = document.querySelectorAll('.landing-button');
    buttons.forEach(button => {
      const isRegister = button.getAttribute('data-type') === 'register';
      const style = isRegister 
        ? { ...styles.button, ...styles.registerButton }
        : styles.button;
      Object.assign(button.style, style);
    });
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>💰 Finance Tracker</h1>
      <p style={styles.paragraph}>
        Take control of your finances — track your income, expenses, and budgets effortlessly.
      </p>
      <div style={styles.buttonContainer}>
        <Link 
          to="/login" 
          className="landing-button"
          data-type="login"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Login
        </Link>
        <Link 
          to="/register" 
          className="landing-button"
          data-type="register"
          style={{ ...styles.button, ...styles.registerButton }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          Register
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
