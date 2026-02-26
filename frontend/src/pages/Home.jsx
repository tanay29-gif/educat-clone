import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import CourseCard from '../components/CourseCard';
import courses from '../data/courses';

export default function Home() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>Recommended courses</Typography>
      <Grid container spacing={3}>
        {courses.map(c => (
          <Grid item key={c.id} xs={12} sm={6} md={4}>
            <CourseCard course={c} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
