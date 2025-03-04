import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Visibility as VisibilityIcon,
  TimerOutlined as TimerIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircleOutline as CheckCircleIcon,
  PendingOutlined as PendingIcon,
} from '@mui/icons-material';

const useStyles = makeStyles({
  dialog: {
    '& .MuiDialog-paper': {
      borderRadius: '12px',
      minWidth: '800px',
    },
  },
  dialogTitle: {
    backgroundColor: '#1a237e',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  content: {
    padding: '24px',
  },
  summaryCard: {
    padding: '24px',
    marginBottom: '24px',
    backgroundColor: '#f8fafd',
    borderRadius: '8px',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  summaryItem: {
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#1a237e',
    marginBottom: '4px',
  },
  summaryLabel: {
    color: '#666666',
    fontSize: '14px',
  },
  tableContainer: {
    marginTop: '24px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  tableHeader: {
    backgroundColor: '#f8fafd',
  },
  tableHeaderCell: {
    fontWeight: '600 !important',
    color: '#5c6b89',
  },
  statusPending: {
    backgroundColor: '#fff3e0 !important',
    color: '#f57c00 !important',
  },
  statusSubmitted: {
    backgroundColor: '#e3f2fd !important',
    color: '#1976d2 !important',
  },
  statusEvaluated: {
    backgroundColor: '#e8f5e9 !important',
    color: '#2e7d32 !important',
  },
  score: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  scoreExcellent: {
    color: '#2e7d32',
  },
  scoreGood: {
    color: '#1976d2',
  },
  scoreFair: {
    color: '#f57c00',
  },
  scorePoor: {
    color: '#d32f2f',
  },
  emptyState: {
    textAlign: 'center',
    padding: '48px',
  },
  emptyIcon: {
    fontSize: '48px !important',
    color: '#cccccc',
    marginBottom: '16px',
  },
  actionIcon: {
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
});

const ViewAssessment = ({ studentId, open, onClose }) => {
  const classes = useStyles();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState({
    total: 0,
    completed: 0,
    avgScore: 0,
  });

  useEffect(() => {
    if (open && studentId) {
      fetchAssessments();
    }
  }, [studentId, open]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(
        `https://lms1-1-p88i.onrender.com/api/student-management/${studentId}/assessments/`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch assessment data');
      }

      const data = await response.json();
      
      // Use the structure from the API documentation
      const assessmentData = data.data || [];
      setAssessments(assessmentData);
      
      // Calculate summary
      const completed = assessmentData.filter(a => a.status === 'evaluated').length;
      const scores = assessmentData
        .filter(a => a.status === 'evaluated' && a.score !== null)
        .map(a => a.score);
      const avgScore = scores.length > 0 
        ? scores.reduce((a, b) => a + b, 0) / scores.length 
        : 0;

      setSummary({
        total: data.total_assessments || assessmentData.length,
        completed: completed,
        avgScore: avgScore.toFixed(1),
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChipProps = (status) => {
    const statusConfigs = {
      pending: {
        label: 'Pending',
        className: classes.statusPending,
        icon: <PendingIcon fontSize="small" />,
      },
      submitted: {
        label: 'Submitted',
        className: classes.statusSubmitted,
        icon: <TimerIcon fontSize="small" />,
      },
      evaluated: {
        label: 'Evaluated',
        className: classes.statusEvaluated,
        icon: <CheckCircleIcon fontSize="small" />,
      },
    };
    return statusConfigs[status] || statusConfigs.pending;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return classes.scoreExcellent;
    if (score >= 75) return classes.scoreGood;
    if (score >= 60) return classes.scoreFair;
    return classes.scorePoor;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not submitted';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      className={classes.dialog}
    >
      <DialogTitle className={classes.dialogTitle}>
        <AssessmentIcon />
        Student Assessments
      </DialogTitle>

      <DialogContent className={classes.content}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : assessments.length === 0 ? (
          <Box className={classes.emptyState}>
            <AssessmentIcon className={classes.emptyIcon} />
            <Typography variant="h6" color="textSecondary">
              No assessments found
            </Typography>
            <Typography variant="body2" color="textSecondary">
              This student hasn't taken any assessments yet
            </Typography>
          </Box>
        ) : (
          <>
            <Paper className={classes.summaryCard}>
              <Box className={classes.summaryGrid}>
                <Box className={classes.summaryItem}>
                  <Typography className={classes.summaryValue}>
                    {summary.total}
                  </Typography>
                  <Typography className={classes.summaryLabel}>
                    Total Assessments
                  </Typography>
                </Box>
                <Box className={classes.summaryItem}>
                  <Typography className={classes.summaryValue}>
                    {summary.completed}
                  </Typography>
                  <Typography className={classes.summaryLabel}>
                    Completed
                  </Typography>
                </Box>
                <Box className={classes.summaryItem}>
                  <Typography className={classes.summaryValue}>
                    {summary.avgScore}%
                  </Typography>
                  <Typography className={classes.summaryLabel}>
                    Average Score
                  </Typography>
                </Box>
              </Box>
            </Paper>

            <TableContainer component={Paper} className={classes.tableContainer}>
              <Table>
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell className={classes.tableHeaderCell}>Title</TableCell>
                    <TableCell className={classes.tableHeaderCell}>Status</TableCell>
                    <TableCell className={classes.tableHeaderCell}>Score</TableCell>
                    <TableCell className={classes.tableHeaderCell}>Submitted</TableCell>
                    <TableCell className={classes.tableHeaderCell}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {assessments.map((assessment) => {
                    const statusProps = getStatusChipProps(assessment.status);
                    return (
                      <TableRow key={assessment.id} hover>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AssessmentIcon color="primary" fontSize="small" />
                            {assessment.title}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={statusProps.icon}
                            label={statusProps.label}
                            className={statusProps.className}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box className={`${classes.score} ${getScoreColor(assessment.score || 0)}`}>
                            {assessment.status === 'evaluated' ? (
                              <>
                                <TrendingUpIcon fontSize="small" />
                                {assessment.score}%
                              </>
                            ) : (
                              'N/A'
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          {formatDate(assessment.submitted_at)}
                        </TableCell>
                        <TableCell>
                          <Tooltip title="View Details">
                            <IconButton 
                              size="small"
                              color="primary"
                              className={classes.actionIcon}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ViewAssessment;