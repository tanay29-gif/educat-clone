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
    <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <CardMedia
        component="img"
        height="160"
        image={course.thumbnail}
        alt={course.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ mb: 1 }}>
          {course.title}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          By: {course.instructor?.name || "Unknown"}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating name="read-only" value={course.rating || 0} precision={0.5} readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            ({course.students || 0})
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ mt: 'auto', p: 2 }}>
        <Button
          component={RouterLink}
          to={`/course/${course._id}`}
          size="small"
          variant="outlined"
          fullWidth
        >
          View Details
        </Button>
        <Typography variant="h6" sx={{ ml: 'auto', color: 'primary.main' }}>
          {course.price === 0 ? "Free" : `$${course.price}`}
        </Typography>
      </CardActions>
    </Card>
  );
}
