import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Grid, Divider, Chip, CircularProgress } from "@mui/material";
import { makeStyles } from "@mui/styles";
import axios from "axios";

const useStyles = makeStyles({
  root: {
    padding: "24px",
  },
  section: {
    marginBottom: "24px",
  },
  label: {
    color: "#666",
    fontWeight: 500,
    marginBottom: "4px",
  },
  value: {
    color: "#1a237e",
    fontWeight: 600,
  },
  chip: {
    margin: "4px",
  },
  paper: {
    padding: "24px",
    backgroundColor: "#f8fafd",
    borderRadius: "8px",
  },
  divider: {
    margin: "24px 0",
  },
  addressbox: {
    display: "flex",
    justifyContent: "space-between",
    marginRight: "50px !important",
  },
});

const InstitutionDetails = ({ institutionId }) => {
  const classes = useStyles();
  const [institution, setInstitution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstitutionDetails = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await axios.get(
          `https://lms1-1-p88i.onrender.com/api/institutions/${institutionId}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInstitution(response.data);
      } catch (error) {
        setError("Failed to fetch institution details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (institutionId) {
      fetchInstitutionDetails();
    }
  }, [institutionId]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!institution) return null;

  return (
    <Box className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={3}>
          {/* Basic Information */}
          <Grid item xs={12} className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography className={classes.label}>
                  Institution Name
                </Typography>
                <Typography className={classes.value}>
                  {institution.name}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography className={classes.label}>
                  Institution Code
                </Typography>
                <Typography className={classes.value}>
                  {institution.code}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography className={classes.label}>Status</Typography>
                <Chip
                  label={institution.is_active ? "Active" : "Inactive"}
                  color={institution.is_active ? "success" : "error"}
                  className={classes.chip}
                />
              </Grid>
            </Grid>
          </Grid>

          <Divider className={classes.divider} />

          {/* Contact Information */}
          <Grid item xs={12} className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box className={classes.addressbox}>
                  <Box>
                    <Typography className={classes.label}>Address</Typography>
                    <Typography className={classes.value}>
                      {institution.address}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography className={classes.label}>City</Typography>
                    <Typography className={classes.value}>
                      {institution.city}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography className={classes.label}>State</Typography>
                    <Typography className={classes.value}>
                      {institution.state}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography className={classes.label}>Email</Typography>
                <Typography className={classes.value}>
                  {institution.contact_email}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography className={classes.label}>Phone</Typography>
                <Typography className={classes.value}>
                  {institution.contact_phone}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography className={classes.label}>Website</Typography>
                <Typography className={classes.value}>
                  {institution.website ? (
                    <a
                      href={institution.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {institution.website}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Divider className={classes.divider} />

          {/* Additional Information */}
          <Grid item xs={12} className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography className={classes.label}>
                  Established Year
                </Typography>
                <Typography className={classes.value}>
                  {institution.established_year}
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Divider className={classes.divider} />

          {/* Timestamps Section */}
          <Grid item xs={12} className={classes.section}>
            <Typography variant="h6" gutterBottom>
              Timestamps
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography className={classes.label}>Created At</Typography>
                <Typography className={classes.value}>
                  {new Date(institution.created_at).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography className={classes.label}>Last Updated</Typography>
                <Typography className={classes.value}>
                  {new Date(institution.updated_at).toLocaleString()}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default InstitutionDetails;
