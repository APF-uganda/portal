import { useState } from 'react'
import { Box, Container, Typography, TextField, Button } from '@mui/material'
import PhoneIcon from '@mui/icons-material/Phone'
import EmailIcon from '@mui/icons-material/Email'
import LocationOnIcon from '@mui/icons-material/LocationOn'

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <Box sx={{ backgroundColor: '#e5e7eb', py: { xs: 6, md: 10 } }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            backgroundColor: 'white',
            borderRadius: '16px',
            p: { xs: 3, md: 5 },
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1.5fr' },
              gap: { xs: 4, md: 6 },
            }}
          >
            {/* Left Column - Contact Info */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: '#1f2937',
                }}
              >
                Get in touch with us
              </Typography>
              
              <Typography
                variant="body2"
                sx={{
                  color: '#9ca3af',
                  mb: 4,
                  lineHeight: 1.7,
                }}
              >
                Have a question about membership, professional development, or upcoming events? Reach out to the Accountancy Practitioners Forum (APF) and our team will be glad to assist. We're here to support members and advance professionalism in accountancy.
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  color: '#1f2937',
                }}
              >
                Our Contact Information
              </Typography>

              {/* Contact Info */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Phone */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <PhoneIcon sx={{ color: '#7c3aed', fontSize: 22, mt: 0.3 }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem', mb: 0.3 }}
                    >
                      Phone
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      +256-XXXX-XXXXX
                    </Typography>
                  </Box>
                </Box>

                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <EmailIcon sx={{ color: '#7c3aed', fontSize: 22, mt: 0.3 }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem', mb: 0.3 }}
                    >
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      info@apfuganda.com
                    </Typography>
                  </Box>
                </Box>

                {/* Office Address */}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationOnIcon sx={{ color: '#7c3aed', fontSize: 22, mt: 0.3 }} />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem', mb: 0.3 }}
                    >
                      Office Address
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                      Spring Road, Bugolobi, Kampala
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Right Column - Contact Form */}
            <Box component="form" onSubmit={handleSubmit}>
              {/* Form Fields Stacked Vertically */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
                {/* Name */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: '#6b7280', fontWeight: 500, fontSize: '0.875rem' }}
                  >
                    Name
                  </Typography>
                  <TextField
                    fullWidth
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: '#e5e7eb',
                        },
                        '&:hover fieldset': {
                          borderColor: '#7c3aed',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#7c3aed',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Email */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: '#6b7280', fontWeight: 500, fontSize: '0.875rem' }}
                  >
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: '#e5e7eb',
                        },
                        '&:hover fieldset': {
                          borderColor: '#7c3aed',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#7c3aed',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Subject */}
                <Box>
                  <Typography
                    variant="body2"
                    sx={{ mb: 1, color: '#6b7280', fontWeight: 500, fontSize: '0.875rem' }}
                  >
                    Subject
                  </Typography>
                  <TextField
                    fullWidth
                    name="subject"
                    placeholder="Inquiry about services"
                    value={formData.subject}
                    onChange={handleChange}
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f9fafb',
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: '#e5e7eb',
                        },
                        '&:hover fieldset': {
                          borderColor: '#7c3aed',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#7c3aed',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>

              {/* Message Field */}
              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: '#6b7280', fontWeight: 500, fontSize: '0.875rem' }}
                >
                  Your Message
                </Typography>
                <TextField
                  fullWidth
                  name="message"
                  multiline
                  rows={6}
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={handleChange}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#f9fafb',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: '#e5e7eb',
                      },
                      '&:hover fieldset': {
                        borderColor: '#7c3aed',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#7c3aed',
                      },
                    },
                  }}
                />
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  backgroundColor: '#7c3aed',
                  color: 'white',
                  py: 1.5,
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#6d28d9',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(124, 58, 237, 0.5)',
                  },
                }}
              >
                Submit Message
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default ContactForm
