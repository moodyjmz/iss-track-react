# ISS Tracker

A real-time International Space Station (ISS) tracking application that visualizes the current position of the ISS on an interactive map, shows telemetry data with smooth animations, and predicts future overhead passes for any location on Earth.

## 🌍 What It Does

The ISS Tracker provides a comprehensive view of the International Space Station's current status and location:

- **Real-time tracking** of the ISS position with live updates
- **Interactive world map** showing the ISS location and ground track
- **Telemetry display** with animated values for altitude, velocity, and coordinates
- **Location intelligence** showing the nearest city to the ISS
- **Future pass predictions** - select any city and see when the ISS will be overhead in the next 12 hours
- **Smart resource management** - automatically pauses updates when the browser tab is inactive

## ✨ Key Features

### 🎯 Core Functionality
- **Live ISS Position**: Real-time tracking with coordinates, altitude, and velocity
- **Interactive Map**: Leaflet-powered world map with the ISS position marker
- **Nearest City Display**: Shows which city the ISS is currently closest to
- **Future Pass Calculator**: Predicts when the ISS will be visible from any selected location
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### 🎨 User Experience
- **Smooth Animations**: Custom scrambler element with animated number transitions
- **Internationalized Formatting**: Locale-aware number and unit formatting
- **Performance Optimized**: Intelligent polling that respects browser focus state
- **Error Handling**: Robust error boundaries with graceful fallbacks
- **Loading States**: Clear loading indicators during data fetching

### 🔧 Technical Features
- **TypeScript**: Fully typed codebase with comprehensive type definitions
- **Modular Architecture**: Clean separation of concerns with feature-based organization
- **Custom Web Components**: Animated value display with scrambler effects
- **Smart API Management**: AbortController-based request handling with retry logic
- **Performance Hooks**: Custom hooks for page focus detection and async data management

## 🛠 Technical Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Testing**: Vitest with React Testing Library for comprehensive test coverage
- **Mapping**: Leaflet with React-Leaflet for interactive maps
- **Styling**: CSS with custom properties and modular stylesheets
- **APIs**:
  - [wheretheiss.at](https://wheretheiss.at) for current ISS position
  - [g7vrd.co.uk](https://api.g7vrd.co.uk) for future pass predictions
- **Deployment**: GitHub Pages with automated deployment

## 🚀 Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd my-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development
npm run start          # Start development server
npm run build          # Build for production
npm run serve          # Preview production build

# API Development
npm run json           # Start mock JSON server on port 8000

# Testing
npm run test           # Run tests in watch mode
npm run test:run       # Run tests once
npm run test:ui        # Run tests with visual UI
npm run test:coverage  # Run tests with coverage report

# Quality Assurance
npm run lint           # Run ESLint (when configured)
npm run typecheck      # Run TypeScript type checking
npm audit              # Check for security vulnerabilities
```

## 🏗 Architecture

The application follows a modular architecture with clear separation of concerns:

- **`src/components/`** - Reusable UI components
- **`src/features/`** - Feature-specific code (ISS tracker)
- **`src/services/`** - API service layer with error handling
- **`src/hooks/`** - Custom React hooks for state management
- **`src/types/`** - TypeScript type definitions
- **`src/utils/`** - Utility functions and helpers
- **`src/context/`** - React context providers

## 🌟 Future Enhancements

- [ ] Historical tracking with ISS orbit visualization
- [ ] Push notifications for upcoming passes
- [ ] Multiple satellite tracking
- [ ] Augmented reality features for mobile
- [ ] Social sharing of ISS sightings
- [ ] Advanced filtering and search capabilities

## 📱 Live Demo

Visit the live application: [ISS Tracker](https://jamesmanuel.github.io/iss-track-react/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).