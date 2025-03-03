import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
  Paper,
  Checkbox,
  FormControlLabel,
  Link,
  Grid,
  Alert,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  Visibility,
  VisibilityOff,
  Person as PersonIcon,
  Lock as LockIcon,
  Email as EmailIcon,
} from "@mui/icons-material";
import { AuthContext } from "../../App"; // Import the AuthContext

const useStyles = makeStyles({
  root: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    background: "linear-gradient(135deg, #6c5ce7 0%, #a393f0 100%)",
    padding: "20px",
  },
  paper: {
    display: "flex",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
    minHeight: "600px",
  },
  leftSection: {
    flex: 1,
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  rightSection: {
    flex: 1,
    background:
      "linear-gradient(135deg, rgba(108, 92, 231, 0.9) 0%, rgba(163, 147, 240, 0.9) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px",
    color: "white",
    "@media (max-width: 900px)": {
      display: "none",
    },
  },
  form: {
    width: "100%",
    marginTop: "20px",
  },
  textField: {
    marginBottom: "20px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#e0e0e0",
      },
      "&:hover fieldset": {
        borderColor: "#6c5ce7",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6c5ce7",
      },
    },
  },
  submitButton: {
    marginTop: "20px",
    background: "#6c5ce7",
    color: "white",
    padding: "12px",
    "&:hover": {
      background: "#5a4dcc",
    },
  },
  welcomeText: {
    fontSize: "32px",
    fontWeight: "bold",
    marginBottom: "40px",
    color: "white",
    textAlign: "center",
  },
  featureList: {
    marginTop: "20px",
    listStyle: "none",
    padding: 0,
    "& li": {
      marginBottom: "15px",
      display: "flex",
      alignItems: "center",
      "&:before": {
        content: '"•"',
        marginRight: "10px",
        color: "white",
      },
    },
  },
  forgotPassword: {
    color: "#6c5ce7",
    textDecoration: "none",
    "&:hover": {
      textDecoration: "underline",
    },
  },
  brandName: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#6c5ce7",
    marginBottom: "40px",
  },
  socialButton: {
    marginTop: "10px",
    width: "100%",
    background: "white",
    color: "#333",
    "&:hover": {
      background: "#f5f5f5",
    },
  },
});

const LoginPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext); // Use the AuthContext
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === "rememberMe" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/auth/super-admin/login/",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data.access) {
        localStorage.setItem("accessToken", response.data.access);
        localStorage.setItem("isAuthenticated", "true"); // Set isAuthenticated in localStorage
        if (response.data.refresh) {
          localStorage.setItem("refreshToken", response.data.refresh);
        }
        if (formData.rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        setIsAuthenticated(true); // Update the authentication state
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.detail ||
          "An error occurred during login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <Paper className={classes.paper}>
          <Box className={classes.leftSection}>
            <Typography className={classes.brandName}>GigaEd</Typography>
            <Typography variant="h5" gutterBottom>
              Welcome Back!
            </Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Please sign in to continue your learning journey
            </Typography>

            <form className={classes.form} onSubmit={handleSubmit}>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <TextField
                className={classes.textField}
                fullWidth
                name="email"
                label="Email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#6c5ce7" }} />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                className={classes.textField}
                fullWidth
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#6c5ce7" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Grid
                container
                justifyContent="space-between"
                alignItems="center"
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      disabled={loading}
                      sx={{
                        "&.Mui-checked": {
                          color: "#6c5ce7",
                        },
                      }}
                    />
                  }
                  label="Remember me"
                />
                <Link href="#" className={classes.forgotPassword}>
                  Forgot Password?
                </Link>
              </Grid>

              <Button
                className={classes.submitButton}
                fullWidth
                variant="contained"
                type="submit"
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Button>

              <Box mt={3} textAlign="center">
                <Typography variant="body2" color="textSecondary">
                  Don't have an account?{" "}
                  <Link href="#" className={classes.forgotPassword}>
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </form>
          </Box>

          <Box className={classes.rightSection}>
            <Typography className={classes.welcomeText}>
              Welcome to GigaEd Learning Platform
            </Typography>
            <ul className={classes.featureList}>
              <li>Access to comprehensive learning materials</li>
              <li>Interactive quizzes and assessments</li>
              <li>Track your progress in real-time</li>
              <li>Connect with expert instructors</li>
              <li>Join a community of learners</li>
            </ul>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;