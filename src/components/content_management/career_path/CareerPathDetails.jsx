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
  CardHeader,
  Link
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
  moduleCard: {
    marginBottom: '16px',
    backgroundColor: '#f8fafd',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },
  moduleHeader: {
    backgroundColor: '#e3f2fd',
    padding: '12px 16px',
  },
  moduleHeaderText: {
    fontWeight: 500,
    color: '#1a237e',
  },
  topicList: {
    padding: '8px 0',
  },
  projectSection: {
    backgroundColor: '#e8f5e9',
    padding: '16px',
    borderRadius: '4px',
    marginTop: '16px',
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
  institutionChip: {
    backgroundColor: '#f0f4c3',
    color: '#33691e',
  },
  descriptionText: {
    whiteSpace: 'pre-wrap',
    color: '#555',
  },
  fileLink: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '16px',
    textDecoration: 'none',
    color: '#1a237e',
    '&:hover': {
      textDecoration: 'underline',
    },
  }
});

const CareerPathDetails = ({ curriculum }) => {
  const classes = useStyles();

  if (!curriculum) {
    return (
      <Typography variant="body1" align="center">
        No career path data available
      </Typography>
    );
  }

  return (
    <Box className={classes.root}>
      <Box className={classes.section}>
        <Typography variant="h5" className={classes.sectionTitle}>
          {curriculum.title}
        </Typography>
        
        <Box className={classes.chipContainer}>
          <Chip
            label={`Role: ${curriculum.role}`}
            className={classes.roleChip}
          />
          <Chip
            label={`Institution ID: ${curriculum.institution}`}
            className={classes.institutionChip}
          />
        </Box>
        
        {curriculum.description && (
          <Box mt={2}>
            <Typography variant="subtitle2" className={classes.label}>
              Description:
            </Typography>
            <Typography variant="body2" className={classes.descriptionText}>
              {curriculum.description}
            </Typography>
          </Box>
        )}
        
        {curriculum.file_url && (
          <Link 
            href={curriculum.file_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className={classes.fileLink}
          >
            Supporting Materials
          </Link>
        )}
      </Box>

      <Divider className={classes.divider} />
      
      <Box className={classes.section}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" className={classes.sectionTitle}>
            Modules ({curriculum.content?.modules?.length || 0})
          </Typography>
          <Typography variant="body2">
            Created by: {curriculum.created_by_email}
          </Typography>
        </Box>
        
        {curriculum.content?.modules?.map((module, index) => (
          <Card key={index} className={classes.moduleCard}>
            <CardHeader
              title={`${index + 1}. ${module.name}`}
              className={classes.moduleHeader}
              titleTypographyProps={{ variant: 'subtitle1', className: classes.moduleHeaderText }}
            />
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Topics:
              </Typography>
              <List className={classes.topicList}>
                {module.topics.map((topic, topicIdx) => (
                  <ListItem key={topicIdx} dense>
                    <ListItemText primary={topic} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </Box>
      
      {curriculum.content?.recommended_projects && curriculum.content.recommended_projects.length > 0 && (
        <>
          <Divider className={classes.divider} />
          
          <Box className={classes.section}>
            <Typography variant="h6" className={classes.sectionTitle}>
              Recommended Projects
            </Typography>
            
            <Paper className={classes.projectSection}>
              <List>
                {curriculum.content.recommended_projects.map((project, index) => (
                  <ListItem key={index} dense>
                    <ListItemText 
                      primary={project} 
                      primaryTypographyProps={{ 
                        style: { fontWeight: 500, color: '#2e7d32' } 
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Box>
        </>
      )}
      
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
                {new Date(curriculum.created_at).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.metaItem}>
              <Typography className={classes.metaLabel}>Last Updated:</Typography>
              <Typography className={classes.metaValue}>
                {new Date(curriculum.updated_at).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className={classes.metaItem}>
              <Typography className={classes.metaLabel}>Curriculum ID:</Typography>
              <Typography className={classes.metaValue}>
                {curriculum.id}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CareerPathDetails;