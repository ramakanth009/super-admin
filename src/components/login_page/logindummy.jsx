import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  School as SchoolIcon,
  Groups as GroupsIcon,
  Timeline as TimelineIcon,
} from "@mui/icons-material";

// Dummy credentials for testing
const DUMMY_CREDENTIALS = {
  email: "test@example.com",
  password: "password123",
};

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
    position: "relative",
    overflow: "hidden",
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
    background: "#6c5ce7 !important",
    color: "white",
    padding: "12px",
    "&:hover": {
      background: "#5a4dcc !important",
    },
  },
  welcomeText: {
    fontSize: "36px !important",
    fontWeight: "bold",
    marginBottom: "40px",
    color: "white",
    textAlign: "center",
  },
  featureList: {
    marginTop: "20px !important",
    listStyle: "none",
    padding: 0,
    "& li": {
      marginBottom: "25px",
      display: "flex",
      alignItems: "center",
      fontSize: "18px",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "translateX(10px)",
      },
      "& .MuiSvgIcon-root": {
        marginRight: "15px",
        fontSize: "24px",
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
  adminContact: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    textAlign: "center",
    padding: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "15px",
    backdropFilter: "blur(10px)",
  },
  shine: {
    position: "absolute",
    top: "-50%",
    left: "-50%",
    width: "200%",
    height: "200%",
    background:
      "linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)",
    animation: "$shine 3s infinite",
  },
  "@keyframes shine": {
    "0%": {
      transform: "translateX(-100%) translateY(-100%)",
    },
    "100%": {
      transform: "translateX(100%) translateY(100%)",
    },
  },
});

const LoginPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
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

    // Simulate API delay
    setTimeout(() => {
      if (
        formData.email === DUMMY_CREDENTIALS.email &&
        formData.password === DUMMY_CREDENTIALS.password
      ) {
        // Store dummy token
        localStorage.setItem("accessToken", "dummy-token-12345");

        if (formData.rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        navigate("/Landingpage");
      } else {
        setError("Invalid email or password. Please try again.");
      }
      setLoading(false);
    }, 1000); // 1 second delay to simulate network request
  };

  // Rest of the component remains the same...
  return (
    <Box className={classes.root}>
      <Container maxWidth="lg">
        <Paper className={classes.paper}>
          <Box className={classes.leftSection}>
            <Typography className={classes.brandName}>Gigaversity</Typography>
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
                  Test Credentials:
                  <br />
                  Email: test@example.com
                  <br />
                  Password: password123
                </Typography>
              </Box>
            </form>
          </Box>

          <Box className={classes.rightSection}>
            {!showSignup ? (
              <>
                <div className={classes.shine} />
                <Typography className={classes.welcomeText}>
                  Welcome to Gigaversity Learning Platform
                </Typography>
                <ul className={classes.featureList}>
                  <li>
                    <SchoolIcon />
                    Access to comprehensive learning materials with
                    expert-curated content
                  </li>
                  <li>
                    <TimelineIcon />
                    Interactive quizzes and real-time progress tracking
                  </li>
                  <li>
                    <GroupsIcon />
                    Join a thriving community of passionate learners
                  </li>
                  <li>
                    <PersonIcon />
                    One-on-one mentoring with industry experts
                  </li>
                </ul>
              </>
            ) : (
              <Box className={classes.adminContact}>
                <Typography variant="h4" gutterBottom>
                  Want to Join Gigaversity?
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 3 }}>
                  Please contact our administrative team to create your account.
                </Typography>
                <Typography variant="h6">
                  Email: admin@gigaversity.com
                </Typography>
                <Typography variant="h6">Phone: +1 (555) 123-4567</Typography>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
