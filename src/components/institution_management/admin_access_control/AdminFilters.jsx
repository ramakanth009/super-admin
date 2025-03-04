import React, { useState, useEffect } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Typography,
  TextField
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
    marginBottom: '20px',
  },
  formControl: {
    minWidth: '120px !important',
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
  },
  textField: {
    minWidth: '120px !important',
  }
});

const AdminFilters = ({ onFilterChange }) => {
  const classes = useStyles();
  const [institutions, setInstitutions] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    is_active: '',
    institution_name: ''
  });
  const [activeFilters, setActiveFilters] = useState([]);

  useEffect(() => {
    fetchInstitutions();
    fetchDepartments();
  }, []);

  const fetchInstitutions = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('https://lms1-1-p88i.onrender.com/api/institutions/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInstitutions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching institutions:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await axios.get('https://lms1-1-p88i.onrender.com/api/admin-management/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Extract unique departments from admins
      const adminList = Array.isArray(response.data) ? response.data : (response.data?.results || []);
      const uniqueDepartments = [...new Set(
        adminList
          .map(admin => admin.department)
          .filter(Boolean) // Remove null or empty values
      )].sort();
      
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

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
      const roleDisplay = filters.role === 'college_admin' ? 'College Admin' : 'Department Admin';
      newActiveFilters.push({ field: 'role', value: roleDisplay });
    }
    if (filters.department) newActiveFilters.push({ field: 'department', value: filters.department });
    if (filters.is_active !== '') {
      newActiveFilters.push({ 
        field: 'status', 
        value: filters.is_active === 'true' ? 'Active' : 'Inactive' 
      });
    }
    if (filters.institution_name) newActiveFilters.push({ field: 'institution', value: filters.institution_name });
    
    setActiveFilters(newActiveFilters);
    
    // Notify parent component
    onFilterChange(filters);
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      department: '',
      is_active: '',
      institution_name: ''
    });
    setActiveFilters([]);
    onFilterChange({});
  };

  const removeFilter = (field) => {
    const fieldMap = {
      'role': 'role',
      'department': 'department',
      'status': 'is_active',
      'institution': 'institution_name'
    };
    
    const apiField = fieldMap[field];
    
    if (apiField) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [apiField]: ''
      }));
      
      // Update active filters
      setActiveFilters(prev => prev.filter(filter => filter.field !== field));
      
      // Notify parent component with updated filters
      const updatedFilters = {
        ...filters,
        [apiField]: ''
      };
      
      onFilterChange(updatedFilters);
    }
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
          <InputLabel>Role</InputLabel>
          <Select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            label="Role"
          >
            <MenuItem value="">All Roles</MenuItem>
            <MenuItem value="college_admin">College Admin</MenuItem>
            <MenuItem value="department_admin">Department Admin</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl variant="outlined" size="small" className={classes.formControl}>
          <InputLabel>Department</InputLabel>
          <Select
            name="department"
            value={filters.department}
            onChange={handleFilterChange}
            label="Department"
          >
            <MenuItem value="">All Departments</MenuItem>
            {departments.map(department => (
              <MenuItem key={department} value={department}>{department}</MenuItem>
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
        
        <TextField
          size="small"
          label="Institution"
          name="institution_name"
          value={filters.institution_name}
          onChange={handleFilterChange}
          variant="outlined"
          className={classes.textField}
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
          Clear
        </Button>
      </Box>
    </Box>
  );
};

export default AdminFilters;