import React from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Box from '@mui/material/Box';
import { Link as RouterLink } from 'react-router-dom';

export default function CourseCard({ course }) {
  return (
    <Card sx={{ maxWidth: 345, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia component="img" height="160" image={course.image} alt={course.title} />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div">
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {course.instructor}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <Rating value={course.rating} precision={0.1} size="small" readOnly />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {course.rating} • {course.students} students
          </Typography>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" component={RouterLink} to={`/courses/${course.id}`}>View</Button>
        <Button size="small" variant="contained" sx={{ ml: 'auto' }}>
          ${course.price}
        </Button>
      </CardActions>
    </Card>
  );
}
