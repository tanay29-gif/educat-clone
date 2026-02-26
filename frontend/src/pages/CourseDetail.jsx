import React from 'react';
import { useParams } from 'react-router-dom';
import courses from '../data/courses';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';

export default function CourseDetail() {
  const { id } = useParams();
  const course = courses.find(c => c.id === id);
  if (!course) return <Container sx={{ py: 4 }}><Typography>Course not found</Typography></Container>;

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
        <Box component="img" src={course.image} alt={course.title} sx={{ width: { xs: '100%', md: 480 }, borderRadius: 2 }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" gutterBottom>{course.title}</Typography>
          <Typography variant="subtitle1" color="text.secondary">By {course.instructor}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Rating value={course.rating} precision={0.1} readOnly />
            <Typography variant="body2" sx={{ ml: 1 }}>{course.rating} • {course.students} students</Typography>
          </Box>
          <Typography sx={{ mt: 2 }}>{course.description}</Typography>
          <Button variant="contained" size="large" sx={{ mt: 3 }}>
            Enroll for ${course.price}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
