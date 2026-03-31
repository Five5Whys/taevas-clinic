import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
  Paper,
  Select,
  MenuItem,
  FormControl,
  TextField,
  IconButton,
  Rating,
  CircularProgress,
} from '@mui/material';
import {
  PublishedWithChanges,
  AutoAwesome as Sparkles,
  ContentCopy,
  Star,
  Share,
} from '@mui/icons-material';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useMarketingReviews } from '@/hooks/doctor';

const Marketing: React.FC = () => {
  const { data: marketingData, isLoading } = useMarketingReviews();

  const [topic, setTopic] = useState('ENT Health Tips');
  const [generatedContent, setGeneratedContent] = useState(
    'Regular ear hygiene is essential for maintaining optimal hearing health. Avoid inserting cotton buds deep into the ear canal as it can damage the delicate eardrum. Instead, clean only the outer ear with a damp cloth. If you experience ear pain or hearing loss, consult an ENT specialist immediately.'
  );

  const topics = [
    'ENT Health Tips',
    'Hearing Care Benefits',
    'Allergy Management',
    'Preventive Care',
    'Patient Success Stories',
  ];

  const reviews = (Array.isArray(marketingData) ? marketingData : marketingData?.reviews ?? marketingData?.content ?? []) as any[];
  const practiceInfo = marketingData?.practiceInfo ?? {};
  const totalReviews = marketingData?.totalReviews ?? reviews.length;
  const avgRating = marketingData?.avgRating ?? (reviews.length > 0 ? reviews.reduce((s: number, r: any) => s + (r.rating ?? 0), 0) / reviews.length : 0);

  if (isLoading) {
    return (
      <DashboardLayout pageTitle="Marketing">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress sx={{ color: '#5519E6' }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout pageTitle="Marketing">
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={6}>
            {/* Practice Page Card */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Practice Page
                  </Typography>
                  <Chip
                    icon={<PublishedWithChanges />}
                    label="Live"
                    sx={{
                      backgroundColor: '#CDDC50',
                      color: '#000',
                      fontWeight: 'bold',
                    }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5 }}>
                    Your Practice URL
                  </Typography>
                  <Box
                    sx={{
                      p: 1,
                      backgroundColor: '#f5f5f5',
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      dr-rajesh.taevas.health
                    </Typography>
                    <IconButton size="small">
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                {/* Practice Page Preview */}
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: '#f9f9f9',
                    borderRadius: 2,
                    border: '1px solid #eee',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(135deg, #5519E6 0%, #A046F0 100%)',
                      color: '#fff',
                      p: 2,
                      borderRadius: 1,
                      mb: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                      Dr. Rajesh Kumar
                    </Typography>
                    <Typography variant="caption">
                      MS (ENT) • Reg: MH-123456
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                      ENT Care Center, Pune
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Over 25 years of experience in ENT care
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <Rating value={avgRating} readOnly size="small" precision={0.1} />
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
                      {avgRating.toFixed(1)}/5 ({totalReviews} reviews)
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="small"
                    sx={{
                      backgroundColor: '#5519E6',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#4410cc' },
                    }}
                  >
                    Book Appointment
                  </Button>
                </Paper>

                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    mt: 2,
                    color: '#5519E6',
                    borderColor: '#5519E6',
                  }}
                >
                  Preview Full Page
                </Button>
              </CardContent>
            </Card>

            {/* Recent Reviews */}
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Recent Reviews
                </Typography>
                <Stack spacing={2}>
                  {reviews.slice(0, 2).map((review) => (
                    <Paper key={review.id} variant="outlined" sx={{ p: 1.5 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {review.author}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          {review.date}
                        </Typography>
                      </Box>
                      <Typography variant="body2">{review.text}</Typography>
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={6}>
            {/* AI Social Content Generator */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Sparkles sx={{ color: '#5519E6', fontSize: 28 }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    AI Social Content
                  </Typography>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Select Topic
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    >
                      {topics.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<Sparkles />}
                  sx={{
                    backgroundColor: '#A046F0',
                    color: '#fff',
                    mb: 2,
                    '&:hover': { backgroundColor: '#8a38c0' },
                  }}
                >
                  Generate Content
                </Button>

                {/* Generated Content */}
                <Paper
                  sx={{
                    p: 2,
                    backgroundColor: '#f5f5f5',
                    borderRadius: 1,
                    mb: 2,
                    minHeight: 120,
                  }}
                >
                  <Typography variant="body2">{generatedContent}</Typography>
                </Paper>

                <Stack direction="row" spacing={1}>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<ContentCopy />}
                    sx={{ color: '#5519E6', borderColor: '#5519E6' }}
                  >
                    Copy
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={<Share />}
                    sx={{
                      backgroundColor: '#25D366',
                      color: '#fff',
                      '&:hover': { backgroundColor: '#1fad55' },
                    }}
                  >
                    Share
                  </Button>
                </Stack>
              </CardContent>
            </Card>

            {/* All Reviews */}
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    All Reviews
                  </Typography>
                  <Button
                    size="small"
                    variant="text"
                    sx={{ color: '#5519E6' }}
                  >
                    View All ({totalReviews})
                  </Button>
                </Box>

                <Stack spacing={1.5}>
                  {reviews.map((review) => (
                    <Box key={review.id} sx={{ pb: 1.5, borderBottom: '1px solid #eee', '&:last-child': { borderBottom: 'none' } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {review.author}
                          </Typography>
                          <Rating value={review.rating} readOnly size="small" />
                        </Box>
                        <Typography variant="caption" color="textSecondary">
                          {review.date}
                        </Typography>
                      </Box>
                      <Typography variant="caption">{review.text}</Typography>
                    </Box>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Marketing;
