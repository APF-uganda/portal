# Atomic Design Structure

This project follows the **Atomic Design** methodology for organizing UI components, creating a scalable and maintainable component architecture.

## Structure Overview

```
src/components/
├── atoms/              # Basic building blocks
│   ├── Button/
│   ├── Typography/
│   └── Icon/
├── molecules/          # Simple combinations of atoms
│   ├── EventCard/
│   ├── NewsCard/
│   └── StatItem/
├── organisms/          # Complex UI sections
│   ├── Navbar/
│   ├── Footer/
│   ├── Hero/
│   ├── Stats/
│   ├── Partners/
│   ├── ChairMessage/
│   ├── LatestNews/
│   ├── FeaturedEvents/
│   └── ConnectingProfessionals/
└── aboutPage-components/  # About page specific components
    ├── Hero/
    ├── OurHistory/
    ├── Timeline/
    ├── OurWork/
    ├── VisionMission/
    ├── OurGovernance/
    └── JoinCTA/
```

## Component Hierarchy

### 🔹 Atoms
Basic building blocks that can't be broken down further without losing functionality.

- **Button**: Reusable button with variants (primary, secondary, outlined)
- **Typography**: Wrapper for MUI Typography with custom styling
- **Icon**: Icon wrapper component

**Usage:**
```typescript
import { Button, Typography } from '@/components/atoms'

<Button variant="primary">Click Me</Button>
<Typography variant="h1">Heading</Typography>
```

### 🔸 Molecules
Simple combinations of atoms that form functional units.

- **EventCard**: Displays event information with image, details, and register button
- **NewsCard**: Shows news articles with image, tag, title, and read more link
- **StatItem**: Animated statistic display with counter animation

**Usage:**
```typescript
import { EventCard, NewsCard, StatItem } from '@/components/molecules'

<EventCard 
  image="/event.jpg"
  title="Annual Conference"
  date="Jan 15, 2026"
  time="9:00 AM"
  location="Kampala"
  description="Join us for..."
/>
```

### 🔶 Organisms
Complex UI components composed of molecules and atoms.

- **Navbar**: Main navigation with mobile menu drawer
- **Footer**: Site footer with links and information
- **Hero**: Hero section for landing pages
- **Stats**: Statistics section with animated counters
- **Partners**: Partner logos carousel with infinite scroll
- **ChairMessage**: Chairman's message with image and CTA
- **LatestNews**: News articles carousel
- **FeaturedEvents**: Events carousel with drag/swipe functionality
- **ConnectingProfessionals**: Accordion section for professional connections

**Usage:**
```typescript
import { Navbar, Footer, Hero } from '@/components/organisms'

<Navbar />
<Hero />
<Footer />
```

### 📄 Pages
Complete pages that combine organisms, molecules, and atoms.

- **LandingPage**: Home page with all landing sections
- **AboutPage**: About APF with history, vision, mission, governance
- **NewsPage**: News and insights listing
- **EventsPage**: Events listing (under development)
- **MembershipPage**: Membership information (under development)
- **ContactPage**: Contact and enquiries (under development)

## Benefits of Atomic Design

1. **Reusability**: Components can be easily reused across the application
2. **Maintainability**: Clear separation of concerns makes updates easier
3. **Scalability**: Easy to add new components following the same pattern
4. **Testing**: Smaller components are easier to test in isolation
5. **Documentation**: Clear hierarchy makes component relationships obvious
6. **Consistency**: Shared atoms ensure consistent UI across the app
7. **Collaboration**: Team members can work on different levels independently

## Import Patterns

### Centralized Exports
Each level has an index file for clean imports:

```typescript
// Atoms
export { default as Button } from './Button'
export { default as Typography } from './Typography'

// Molecules
export { default as EventCard } from './EventCard'
export { default as NewsCard } from './NewsCard'

// Organisms
export { default as Navbar } from './Navbar'
export { default as Footer } from './Footer'
```

### Usage in Pages
```typescript
import { 
  Navbar, 
  Footer, 
  Hero, 
  Stats 
} from '../components/organisms'

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

## Migration Status

✅ **Atoms**: Created (Button, Typography, Icon)
✅ **Molecules**: Created (EventCard, NewsCard, StatItem)
✅ **Organisms**: Migrated all landing page components
✅ **Pages**: Updated all imports to use new structure
✅ **Build**: Successful compilation

## Adding New Components

### Creating a New Atom
```typescript
// src/components/atoms/Input/Input.tsx
import { TextField, TextFieldProps } from '@mui/material'

function Input(props: TextFieldProps) {
  return <TextField {...props} />
}

export default Input

// src/components/atoms/Input/index.ts
export { default } from './Input'

// Update src/components/atoms/index.ts
export { default as Input } from './Input'
```

### Creating a New Molecule
```typescript
// src/components/molecules/ProfileCard/ProfileCard.tsx
import { Card, CardContent } from '@mui/material'
import { Typography, Button } from '../../atoms'

interface ProfileCardProps {
  name: string
  role: string
}

function ProfileCard({ name, role }: ProfileCardProps) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{name}</Typography>
        <Typography variant="body2">{role}</Typography>
        <Button variant="primary">View Profile</Button>
      </CardContent>
    </Card>
  )
}

export default ProfileCard
```

## Best Practices

1. **Keep atoms simple**: Atoms should be basic, reusable elements
2. **Molecules should be functional**: Each molecule should serve a clear purpose
3. **Organisms are context-aware**: Can contain business logic and state
4. **Pages orchestrate**: Pages combine organisms and handle routing
5. **Use TypeScript**: Define clear interfaces for all props
6. **Export through index**: Always use index files for clean imports
7. **Consistent naming**: Use PascalCase for components, camelCase for utilities

## Styling Approach

- **Material-UI sx prop**: Primary styling method
- **No Tailwind**: Removed in favor of pure Material-UI
- **No custom CSS files**: All styles are component-scoped
- **Responsive design**: Use MUI breakpoints in sx prop
- **Animations**: Defined in sx prop using @keyframes

## Future Enhancements

- [ ] Create Templates layer for page layouts
- [ ] Add Storybook for component documentation
- [ ] Implement unit tests for atoms and molecules
- [ ] Create design tokens for consistent theming
- [ ] Add accessibility testing
- [ ] Document component props with JSDoc

---

**Last Updated**: January 12, 2026
**Migration Completed**: ✅ All components migrated to atomic structure
