# APF Portal - Project Structure

## Overview
This document outlines the complete structure of the APF (Accountancy Practitioners Forum) portal landing page.

## Folder Structure

```
portal/src/
├── assets/
│   ├── css/                          # All CSS files
│   │   ├── App.css                   # Global app styles
│   │   ├── Navbar.css                # Navigation bar styles
│   │   ├── Footer.css                # Footer styles
│   │   ├── Hero.css                  # Hero section styles
│   │   ├── Stats.css                 # Statistics section styles
│   │   ├── ChairMessage.css          # Chairman message styles
│   │   ├── ConnectingProfessionals.css
│   │   ├── FeaturedEvents.css        # Events section styles
│   │   ├── LatestNews.css            # News section styles
│   │   ├── Partners.css              # Partners carousel styles
│   │   ├── EventCard.css             # Event card component styles
│   │   └── NewsCard.css              # News card component styles
│   │
│   └── images/                       # All image assets
│       ├── chairman.jpg              # Chairman photo
│       ├── connecting.jpeg           # Connecting professionals image
│       ├── event1.jpg                # Event images
│       ├── event2.jpeg
│       ├── event3.jpeg
│       ├── landing_halo-section.jpg  # Hero background
│       ├── news1.webp                # News images
│       ├── news2.webp
│       └── news3.png
│
├── components/
│   ├── landingPage-components/       # Landing page specific components
│   │   ├── Hero.tsx                  # Hero section with CTA
│   │   ├── Stats.tsx                 # Animated statistics
│   │   ├── ChairMessage.tsx          # Message from chairman
│   │   ├── ConnectingProfessionals.tsx # Accordion section
│   │   ├── FeaturedEvents.tsx        # Events showcase
│   │   ├── LatestNews.tsx            # News carousel
│   │   └── Partners.tsx              # Infinite scrolling partners
│   │
│   ├── cards/                        # Reusable card components
│   │   ├── EventCard.tsx             # Event card component
│   │   └── NewsCard.tsx              # News card component
│   │
│   ├── Navbar.tsx                    # Global navigation (with mobile menu)
│   └── Footer.tsx                    # Global footer
│
├── hooks/
│   └── useScrollAnimation.ts         # Custom hook for scroll animations
│
├── pages/
│   └── LandingPage.tsx               # Main landing page
│
├── App.tsx                           # Root component
└── main.tsx                          # Entry point
```

## Key Features

### 1. Navigation (Navbar)
- Transparent white background with backdrop blur
- Responsive hamburger menu for mobile
- Sticky positioning
- Smooth animations

### 2. Hero Section
- Full-width background image with overlay
- Animated text and CTA button
- Responsive design

### 3. Statistics Section
- Animated counters (count up on scroll)
- Three key metrics
- Repeatable animations

### 4. Chairman Message
- Image with text layout
- Scroll-triggered heading animation
- Responsive stacking on mobile

### 5. Connecting Professionals
- Accordion-style content
- Side-by-side layout
- Scroll animations

### 6. Featured Events
- Grid of event cards (3 columns)
- Reusable EventCard component
- Registration buttons
- Responsive (3 → 2 → 1 columns)

### 7. Latest News
- Horizontal scrolling carousel
- 8 news articles
- Functional prev/next buttons
- Reusable NewsCard component
- Responsive grid

### 8. Partners Section
- Infinite horizontal scroll animation
- 8 partner logos
- Pauses on hover
- Smooth looping

### 9. Footer
- Three-column layout
- Social media links
- Quick links and contact info
- Responsive stacking

## Component Architecture

### Reusable Cards
Both `EventCard` and `NewsCard` are fully reusable components with:
- TypeScript interfaces for props
- Individual CSS files
- Hover animations
- Callback functions for actions

### Custom Hooks
- `useScrollAnimation`: Intersection Observer hook for scroll-triggered animations
  - Repeatable animations
  - Configurable threshold
  - Returns ref and visibility state

## Styling Approach

### Global Styles (App.css)
- CSS reset
- Smooth scrolling
- Custom scrollbar
- Global animation classes
- Rounded button styles

### Component Styles
- Each component has its own CSS file
- Consistent color scheme (Purple: #7c3aed)
- Responsive breakpoints:
  - Desktop: > 1024px
  - Tablet: 768px - 1024px
  - Mobile: < 768px
  - Small Mobile: < 480px

## Animations

### Scroll Animations
- Headings: Scale and fade in
- Cards: Fade in from bottom with stagger
- Stats: Counter animation

### Hover Effects
- Buttons: Lift and shadow
- Cards: Lift and scale
- Images: Zoom
- Links: Underline and color change

### Continuous Animations
- Partners: Infinite scroll
- Hero overlay: Gradient shift
- Stats icons: Bounce

## Color Palette
- Primary Purple: #7c3aed
- Dark Blue: #2c3e50
- Light Purple: #e9d5ff
- White: #ffffff
- Gray: #666666

## Typography
- Font Family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto'
- Headings: Bold, 2rem - 3rem
- Body: 0.9rem - 1.1rem
- Line Height: 1.6 - 1.8

## Build & Deployment
- Build command: `npm run build`
- TypeScript check: `npx tsc --noEmit`
- All files compile without errors
- Production-ready

## Future Enhancements
- Add more pages (About, Events, News, Contact)
- Implement routing (React Router)
- Connect to backend API
- Add authentication
- Implement search functionality
- Add more interactive features
