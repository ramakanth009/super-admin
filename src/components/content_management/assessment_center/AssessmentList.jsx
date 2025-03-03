import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box
} from '@mui/material';
import {
  Visibility as ViewIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  tableContainer: {
    boxShadow: 'none',
  },
  tableHeader: {
    backgroundColor: '#f8fafd',
  },
  tableHeaderCell: {
    color: '#5c6b89',
    fontWeight: 600,
    padding: '16px',
    borderBottom: '2px solid #e0e7ff',
  },
  tableRow: {
    '&:hover': {
      backgroundColor: '#f8fafd',
    },
  },
  tableCell: {
    padding: '16px',
  },
  roleChip: {
    backgroundColor: '#e3f2fd',
    color: '#1976d2',
    fontWeight: 500,
  },
  actionsCell: {
    display: 'flex',
    gap: '8px',
  },
  noDataMessage: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
  institutionChip: {
    backgroundColor: '#f0f4c3',
    color: '#33691e',
  },
  marksChip: {
    backgroundColor: '#fff8e1',
    color: '#ff6f00',
    fontWeight: 500,
  },
  durationChip: {
    backgroundColor: '#e0f2f1',
    color: '#00695c',
  },
  titleCell: {
    fontWeight: 500,
  }
});

const AssessmentList = ({ assessments, onViewDetails, onDelete, onEdit }) => {
  const classes = useStyles();

  if (!assessments || assessments.length === 0) {
    return (
      <Typography variant="body1" className={classes.noDataMessage}>
        No assessments found. Create a new assessment to get started.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} className={classes.tableContainer}>
      <Table>
        <TableHead>
          <TableRow className={classes.tableHeader}>
            <TableCell className={classes.tableHeaderCell}>Title</TableCell>
            <TableCell className={classes.tableHeaderCell}>Role</TableCell>
            <TableCell className={classes.tableHeaderCell}>Questions</TableCell>
            <TableCell className={classes.tableHeaderCell}>Duration</TableCell>
            <TableCell className={classes.tableHeaderCell}>Total Marks</TableCell>
            <TableCell className={classes.tableHeaderCell}>Institution</TableCell>
            <TableCell className={classes.tableHeaderCell}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {assessments.map((assessment) => (
            <TableRow key={assessment.id} className={classes.tableRow}>
              <TableCell className={`${classes.tableCell} ${classes.titleCell}`}>
                {assessment.title}
                <Typography variant="caption" display="block" color="textSecondary">
                  Created: {new Date(assessment.created_at).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell className={classes.tableCell}>
                <Chip 
                  label={assessment.role} 
                  className={classes.roleChip} 
                  size="small"
                />
              </TableCell>
              <TableCell className={classes.tableCell}>
                {assessment.questions.length}
              </TableCell>
              <TableCell className={classes.tableCell}>
                <Chip 
                  label={`${assessment.duration_minutes} min`} 
                  className={classes.durationChip}
                  size="small"
                />
              </TableCell>
              <TableCell className={classes.tableCell}>
                <Chip 
                  label={assessment.total_marks} 
                  className={classes.marksChip}
                  size="small"
                />
              </TableCell>
              <TableCell className={classes.tableCell}>
                <Chip 
                  label={`ID: ${assessment.institution}`} 
                  className={classes.institutionChip}
                  size="small"
                />
              </TableCell>
              <TableCell className={`${classes.tableCell} ${classes.actionsCell}`}>
                <IconButton 
                  color="primary" 
                  size="small"
                  onClick={() => onViewDetails(assessment)}
                >
                  <ViewIcon />
                </IconButton>
                {onEdit && (
                  <IconButton 
                    color="secondary" 
                    size="small"
                    onClick={() => onEdit(assessment)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton 
                  color="error" 
                  size="small"
                  onClick={() => onDelete(assessment.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AssessmentList;