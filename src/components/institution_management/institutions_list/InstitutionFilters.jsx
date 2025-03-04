import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import ClearIcon from '@mui/icons-material/Clear';
import axios from 'axios';

const useStyles = makeStyles({
  filtersContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginRight: 'auto',
    // marginTop: '16px',
  },
  formControl: {
    minWidth: '100px !important', // Increased width for better text display
    '& .MuiSelect-select': {
      width: '100% !important',
      textAlign: 'left',
    }
  },
  activeFilterChip: {
    margin: '4px',
    backgroundColor: '#e3f2fd',
  },
  activeFiltersContainer: {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  filtersLabel: {
    color: '#5c6b89',
    marginRight: '8px',
  }
});

const InstitutionFilters = ({ onFilterChange }) => {
  const classes = useStyles();
  const [cities, setCities] = useState(['Vissannapet', 'Hyderabad']); // Added default cities
  const [states, setStates] = useState(['Telangana', 'Andhra Pradesh']); // Added default states
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    is_active: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await axios.get('https://lms1-1-p88i.onrender.com/api/institutions/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Extract unique cities and states and combine with default values
        const uniqueCities = [...new Set([
          'Vissannapet', 
          'Hyderabad',
          ...response.data.map(inst => inst.city).filter(Boolean)
        ])];
        const uniqueStates = [...new Set([
          'Telangana',
          'Andhra Pradesh',
          ...response.data.map(inst => inst.state).filter(Boolean)
        ])];
        
        setCities(uniqueCities.sort());
        setStates(uniqueStates.sort());
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };

    fetchFilterOptions();
  }, []);

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
    if (filters.city) newActiveFilters.push({ field: 'city', value: filters.city });
    if (filters.state) newActiveFilters.push({ field: 'state', value: filters.state });
    if (filters.is_active !== '') {
      newActiveFilters.push({ 
        field: 'is_active', 
        value: filters.is_active === 'true' ? 'Active' : 'Inactive' 
      });
    }
    
    setActiveFilters(newActiveFilters);
    
    // Notify parent component
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      is_active: ''
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
    <Box>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        {activeFilters.length > 0 && (
          <Box className={classes.activeFiltersContainer}>
            <Typography variant="body2" className={classes.filtersLabel}>
              Active filters:
            </Typography>
            {activeFilters.map(filter => (
              <Chip
                key={filter.field}
                label={`${filter.field}: ${filter.value}`}
                onDelete={() => removeFilter(filter.field)}
                className={classes.activeFilterChip}
                size="small"
                deleteIcon={<ClearIcon fontSize="small" />}
              />
            ))}
            
            <Button 
              size="small" 
              color="primary" 
              onClick={clearFilters}
              style={{ marginLeft: '8px' }}
            >
              Clear All
            </Button>
          </Box>
        )}
      </Box>
      
      <Box className={classes.filtersContainer}>
        <FormControl variant="outlined" size="small" className={classes.formControl}>
          <InputLabel>Area</InputLabel>
          <Select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            label="City"
          >
            <MenuItem value="">All Areas</MenuItem>
            {cities.map(city => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl variant="outlined" size="small" className={classes.formControl}>
          <InputLabel >State</InputLabel>
          <Select
            name="state"
            value={filters.state}
            onChange={handleFilterChange}
            label="State"
          >
            <MenuItem value="">All States</MenuItem>
            {states.map(state => (
              <MenuItem key={state} value={state}>{state}</MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <FormControl variant="outlined" size="small" className={classes.formControl}>
          <InputLabel>Status</InputLabel>
          <Select
            name="is_active"
            value={filters.is_active}
            onChange={handleFilterChange}
            label="Status"
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="true">Active</MenuItem>
            <MenuItem value="false">Inactive</MenuItem>
          </Select>
        </FormControl>
        
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
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default InstitutionFilters;