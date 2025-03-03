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
  moduleChip: {
    backgroundColor: '#e0f2f1',
    color: '#00695c',
    margin: '2px',
  },
  titleCell: {
    fontWeight: 500,
  }
});

const CareerPathList = ({ curriculums, onViewDetails, onDelete, onEdit }) => {
  const classes = useStyles();

  if (!curriculums || curriculums.length === 0) {
    return (
      <Typography variant="body1" className={classes.noDataMessage}>
        No career paths found. Create a new career path to get started.
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
            <TableCell className={classes.tableHeaderCell}>Modules</TableCell>
            <TableCell className={classes.tableHeaderCell}>Institution</TableCell>
            <TableCell className={classes.tableHeaderCell}>Created</TableCell>
            <TableCell className={classes.tableHeaderCell}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {curriculums.map((curriculum) => (
            <TableRow key={curriculum.id} className={classes.tableRow}>
              <TableCell className={`${classes.tableCell} ${classes.titleCell}`}>
                {curriculum.title}
                <Typography variant="caption" display="block" color="textSecondary">
                  {curriculum.description.length > 60 
                    ? `${curriculum.description.substring(0, 60)}...` 
                    : curriculum.description}
                </Typography>
              </TableCell>
              <TableCell className={classes.tableCell}>
                <Chip 
                  label={curriculum.role} 
                  className={classes.roleChip} 
                  size="small"
                />
              </TableCell>
              <TableCell className={classes.tableCell}>
                <Box display="flex" flexWrap="wrap" gap={0.5}>
                  {curriculum.content?.modules?.slice(0, 2).map((module, idx) => (
                    <Chip 
                      key={idx}
                      label={module.name} 
                      className={classes.moduleChip}
                      size="small"
                    />
                  ))}
                  {curriculum.content?.modules?.length > 2 && (
                    <Chip 
                      label={`+${curriculum.content.modules.length - 2} more`} 
                      variant="outlined"
                      size="small"
                    />
                  )}
                </Box>
              </TableCell>
              <TableCell className={classes.tableCell}>
                <Chip 
                  label={`ID: ${curriculum.institution}`} 
                  className={classes.institutionChip}
                  size="small"
                />
              </TableCell>
              <TableCell className={classes.tableCell}>
                {new Date(curriculum.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className={`${classes.tableCell} ${classes.actionsCell}`}>
                <IconButton 
                  color="primary" 
                  size="small"
                  onClick={() => onViewDetails(curriculum)}
                >
                  <ViewIcon />
                </IconButton>
                {onEdit && (
                  <IconButton 
                    color="secondary" 
                    size="small"
                    onClick={() => onEdit(curriculum)}
                  >
                    <EditIcon />
                  </IconButton>
                )}
                <IconButton 
                  color="error" 
                  size="small"
                  onClick={() => onDelete(curriculum.id)}
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

export default CareerPathList;