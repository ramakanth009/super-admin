import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  root: {
    padding: '16px',
  },
  section: {
    marginBottom: '24px',
  },
  sectionTitle: {
    color: '#1a237e',
    fontWeight: 600,
    marginBottom: '16px',
  },
  label: {
    color: '#666',
    fontWeight: 500,
    marginBottom: '4px',
  },
  value: {
    color: '#1a237e',
    fontWeight: 500,
  },
  divider: {
    margin: '24px 0',
  },
  questionCard: {
    marginBottom: '16px',
    backgroundColor: '#f8fafd',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },
  questionHeader: {
    backgroundColor: '#e3f2fd',
    padding: '12px 16px',
  },
  questionHeaderText: {
    fontWeight: 500,
    color: '#1a237e',
  },
  optionList: {
    padding: '8px 0',
  },
  correctAnswer: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
    padding: '8px 16px',
    borderRadius: '4px',
    fontWeight: 500,
    marginTop: '8px',
  },
  metaItem: {
    display: 'flex',
    marginBottom: '8px',
  },
  metaLabel: {
    fontWeight: 500,
    marginRight: '8px',
    color: '#666',
  },
  metaValue: {
    color: '#1a237e',
  },
  chipContainer: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  roleChip: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
  },
  marksChip: {
    backgroundColor: '#fff8e1',
    color: '#ff6f00',
  },
  durationChip: {
    backgroundColor: '#e0f2f1',
    color: '#00695c',
  },
  institutionChip: {
    backgroundColor: '#f0f4c3',
    color: '#33691e',
  },
  descriptionText: {
    whiteSpace: 'pre-wrap',
    color: '#555',
  }
});

const AssessmentDetails = ({ assessment }) => {
  const classes = useStyles();

  if (!assessment) {
    return (
      <Typography variant="body1" align="center">
        No assessment data available
      </Typography>
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.section}>
        <Typography variant="h5" className={classes.sectionTitle}>
          {assessment.title}
        </Typography>
        
        <Box className={classes.chipContainer}>
          <Chip
            label={`Role: ${assessment.role}`}
            className={classes.roleChip}
          />
          <Chip
            label={`Duration: ${assessment.duration_minutes} min`}
            className={classes.durationChip}
          />
          <Chip
            label={`Total Marks: ${assessment.total_marks}`}
            className={classes.marksChip}
          />
          <Chip
            label={`Institution ID: ${assessment.institution}`}
            className={classes.institutionChip}
          />
        </Box>
        
        {assessment.description && (
          <Box mt={2}>
            <Typography variant="subtitle2" className={classes.label}>
              Description:
            </Typography>
            <Typography variant="body2" className={classes.descriptionText}>
              {assessment.description}
            </Typography>
          </Box>
        )}
      </Box>

      <Divider className={classes.divider} />
      
      <Box className={classes.section}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" className={classes.sectionTitle}>
            Questions ({assessment.questions.length})
          </Typography>
          <Typography variant="body2">
            Created by: {assessment.created_by_email}
          </Typography>
        </Box>
        
        {assessment.questions.map((question, index) => (
          <Card key={index} className={classes.questionCard}>
            <CardHeader
              title={`Q${index + 1}: ${question.question_text}`}
              className={classes.questionHeader}
              titleTypographyProps={{ variant: 'subtitle1', className: classes.questionHeaderText }}
              subheader={`Type: ${question.type} | Marks: ${question.marks}`}
            />
            <CardContent>
              {question.type === 'mcq' && question.options && (
                <List className={classes.optionList}>
                  {question.options.map((option, optIdx) => (
                    <ListItem key={optIdx} dense>
                      <ListItemText
                        primary={option}
                        primaryTypographyProps={{
                          style: {
                            fontWeight: option === question.correct_answer ? 600 : 400,
                            color: option === question.correct_answer ? '#2e7d32' : 'inherit',
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
              
              <Box className={classes.correctAnswer}>
                <Typography variant="body2">
                  Correct Answer: {question.correct_answer}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      <Divider className={classes.divider} />
      
      <Box className={classes.section}>
        <Typography variant="subtitle1" className={classes.label}>
          Metadata
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Box className={classes.metaItem}>
              <Typography className={classes.metaLabel}>Created:</Typography>
              <Typography className={classes.metaValue}>
                {new Date(assessment.created_at).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.metaItem}>
              <Typography className={classes.metaLabel}>Last Updated:</Typography>
              <Typography className={classes.metaValue}>
                {new Date(assessment.updated_at).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.metaItem}>
              <Typography className={classes.metaLabel}>Status:</Typography>
              <Typography className={classes.metaValue}>
                {assessment.is_active ? 'Active' : 'Inactive'}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.metaItem}>
              <Typography className={classes.metaLabel}>Assessment ID:</Typography>
              <Typography className={classes.metaValue}>
                {assessment.id}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default AssessmentDetails;