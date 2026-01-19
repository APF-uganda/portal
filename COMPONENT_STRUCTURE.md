# Component Structure

This project uses a simplified component architecture focused on reusability and maintainability.

## Structure Overview

```
src/components/
├── common/                    # Reusable components used across pages
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── EventCard.tsx
│   └── NewsCard.tsx
├── landingPage-components/    # Landing page specific sections
│   ├── Hero.tsx
│   ├── Stats.tsx
│   ├── ChairMessage.tsx
│   ├── ConnectingProfessionals.tsx
│   ├── FeaturedEvents.tsx
│   ├── LatestNews.tsx
│   └── Partners.tsx
└── aboutPage-components/      # About page specific sections
    ├── Hero.tsx
    ├── OurHistory.tsx
    ├── Timeline.tsx
    ├── OurWork.tsx
    ├── VisionMission.tsx
    ├── OurGovernance.tsx
    └── JoinCTA.tsx
```

## Component Categories

### 🔹 Common Components
Reusable components that can be used across multiple pages.

**Navbar** - Main navigation with mobile menu drawer
- Responsive design with hamburger menu for mobile
- Active link highlighting
- Smooth animations

**Footer** - Site footer with links and information
- Multi-column layout
- Social media links
- Copyright information

**EventCard** - Displays event information
- Props: image, title, date, time, location, description, onRegister
- Hover animations
- Register button with callback

**NewsCard** - Shows news articles
- Props: image, tag, title, description, date, readTime, onReadMore
- Category tags
- Read more link with callback

### 📄 Page-Specific Components

**Landing Page Components:**
- Hero: Hero section with call-to-action
- Stats: Animated statistics counters
- ChairMessage: Chairman's message with image
- ConnectingProfessionals: Accordion section
- FeaturedEvents: Events carousel with drag/swipe
- LatestNews: News articles carousel
- Partners: Partner logos with infinite scroll

**About Page Components:**
- Hero: About page hero section
- OurHistory: History section with timeline links
- Timeline: Visual timeline of milestones
- OurWork: Work description with image
- VisionMission: Vision and mission cards
- OurGovernance: Team member cards
- JoinCTA: Call-to-action section

## Usage Examples

### Using Common Components

```typescript
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import EventCard from '../components/common/EventCard'

function MyPage() {
  return (
    <>
      <Navbar />
      <EventCard 
        image="/event.jpg"
        title="Annual Conference"
        date="Jan 15, 2026"
        time="9:00 AM"
        location="Kampala"
        description="Join us for..."
        onRegister={() => console.log('Register clicked')}
      />
      <Footer />
    </>
  )
}
```

### Using Page-Specific Components

```typescript
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import Hero from '../components/landingPage-components/Hero'
import Stats from '../components/landingPage-components/Stats'

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Footer />
    </>
  )
}
```

## Design Principles

1. **Reusability**: Common components can be used across multiple pages
2. **Simplicity**: No complex folder nesting or index files
3. **Clarity**: Component names clearly indicate their purpose
4. **Maintainability**: Easy to locate and update components
5. **Consistency**: Shared components ensure consistent UI

## Styling Approach

- **Material-UI sx prop**: Primary styling method
- **No custom CSS files**: All styles are component-scoped
- **Responsive design**: Use MUI breakpoints in sx prop
- **Animations**: Defined in sx prop using @keyframes
- **Theme colors**: 
  - Primary: #7c3aed (purple)
  - Secondary: #2c3e50 (dark blue)
  - Accent: #6d28d9 (darker purple)

## Component Props Pattern

All components use TypeScript interfaces for type safety:

```typescript
interface ComponentProps {
  // Required props
  title: string
  description: string
  
  // Optional props
  image?: string
  onAction?: () => void
}

function Component({ title, description, image, onAction }: ComponentProps) {
  // Component implementation
}
```

## Adding New Components

### Creating a Common Component

1. Create file in `src/components/common/`
2. Define TypeScript interface for props
3. Implement component with Material-UI
4. Export as default

```typescript
// src/components/common/MyComponent.tsx
import { Box, Typography } from '@mui/material'

interface MyComponentProps {
  title: string
  content: string
}

function MyComponent({ title, content }: MyComponentProps) {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">{title}</Typography>
      <Typography variant="body1">{content}</Typography>
    </Box>
  )
}

export default MyComponent
```

### Creating a Page-Specific Component

1. Create file in appropriate folder (`landingPage-components/` or `aboutPage-components/`)
2. Follow same pattern as common components
3. Import and use in the relevant page

## Best Practices

1. **Keep components focused**: Each component should have a single responsibility
2. **Use TypeScript**: Always define prop interfaces
3. **Responsive design**: Test on mobile, tablet, and desktop
4. **Accessibility**: Use semantic HTML and ARIA labels
5. **Performance**: Optimize images and avoid unnecessary re-renders
6. **Consistent naming**: Use PascalCase for components
7. **Props validation**: Use TypeScript for compile-time checking

## File Organization

```
component/
├── ComponentName.tsx    # Component implementation
└── (no index files)     # Direct imports for simplicity
```

## Migration Notes

- Removed complex atomic design structure (atoms/molecules/organisms)
- Removed index.ts files for simpler imports
- Consolidated reusable components into `common/` folder
- Kept page-specific components in their respective folders
- All imports are direct (no barrel exports)

---

**Last Updated**: January 12, 2026
**Structure**: Simplified component architecture
