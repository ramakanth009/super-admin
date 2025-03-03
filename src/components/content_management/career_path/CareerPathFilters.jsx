import React, { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Chip,
  Typography,
  Paper
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ClearIcon from '@mui/icons-material/Clear';
import FilterListIcon from '@mui/icons-material/FilterList';

const useStyles = makeStyles({
  filtersContainer: {
    padding: '16px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    marginBottom: '20px',
  },
  formContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  formControl: {
    minWidth: '200px',
  },
  activeFiltersContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '16px',
  },
  activeFilterChip: {
    margin: '4px',
    backgroundColor: '#e3f2fd',
  },
  filtersLabel: {
    color: '#5c6b89',
    marginRight: '8px',
  },
  institutionInput: {
    minWidth: '150px',
  },
  filterIcon: {
    marginRight: '8px',
  }
});

const roles = [
  { value: 'student', label: 'Student' },
  { value: 'software_developer', label: 'Software Developer' },
  { value: 'data_scientist', label: 'Data Scientist' },
  { value: 'network_engineer', label: 'Network Engineer' },
  { value: 'computer_science', label: 'Computer Science' }
];

const CareerPathFilters = ({ onFilterChange }) => {
  const classes = useStyles();
  const [filters, setFilters] = useState({
    role: '',
    institution: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const applyFilters = () => {
    // Create a new array of active filters for display
    const newActiveFilters = [];
    if (filters.role) {
      const roleLabel = roles.find(r => r.value === filters.role)?.label || filters.role;
      newActiveFilters.push({ field: 'role', value: roleLabel, key: filters.role });
    }
    if (filters.institution) {
      newActiveFilters.push({ field: 'institution', value: filters.institution, key: filters.institution });
    }
    
    setActiveFilters(newActiveFilters);
    
    // Notify parent component
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      institution: ''
    });
    setActiveFilters([]);
    onFilterChange({});
  };

  const removeFilter = (field) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: ''
    }));
    
    // Update active filters
    setActiveFilters(prev => prev.filter(filter => filter.field !== field));
    
    // Notify parent component with updated filters
    const updatedFilters = {
      ...filters,
      [field]: ''
    };
    
    onFilterChange(updatedFilters);
  };

  return (
    <Paper className={classes.filtersContainer}>
      <Typography variant="subtitle1" fontWeight={500} gutterBottom>
        <FilterListIcon className={classes.filterIcon} fontSize="small" />
        Filter Career Paths
      </Typography>
      
      <Box className={classes.formContainer}>
        <FormControl variant="outlined" size="small" className={classes.formControl}>
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            label="Role"
          >
            <MenuItem value="">All Roles</MenuItem>
            {roles.map(role => (
              <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <TextField
          label="Institution ID"
          name="institution"
          value={filters.institution}
          onChange={handleFilterChange}
          variant="outlined"
          size="small"
          className={classes.institutionInput}
        />
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={applyFilters}
          size="small"
          style={{ backgroundColor: '#1a237e' }}
        >
          Apply Filters
        </Button>
        
        <Button 
          variant="outlined" 
          color="primary" 
          onClick={clearFilters}
          size="small"
        >
          Clear All
        </Button>
      </Box>
      
      {activeFilters.length > 0 && (
        <Box className={classes.activeFiltersContainer}>
          <Typography variant="body2" className={classes.filtersLabel}>
            Active filters:
          </Typography>
          {activeFilters.map(filter => (
            <Chip
              key={`${filter.field}-${filter.key}`}
              label={`${filter.field}: ${filter.value}`}
              onDelete={() => removeFilter(filter.field)}
              className={classes.activeFilterChip}
              size="small"
              deleteIcon={<ClearIcon fontSize="small" />}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default CareerPathFilters;
