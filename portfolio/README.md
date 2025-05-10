# Personal Portfolio Website

A modern, responsive personal portfolio website built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 Modern and responsive design
- ⚡ Fast performance with Next.js
- 🔒 Type-safe with TypeScript
- 🎭 Beautiful animations with Framer Motion
- 📱 Mobile-first approach
- 🧪 Comprehensive test coverage
- 🔍 SEO optimized
- 🚀 CI/CD with GitHub Actions

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [Jest](https://jestjs.io/) - Testing
- [Testing Library](https://testing-library.com/) - Component testing
- [ESLint](https://eslint.org/) - Linting
- [Prettier](https://prettier.io/) - Code formatting

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your environment variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
portfolio/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   ├── styles/           # Global styles
│   ├── utils/            # Utility functions
│   ├── types/            # TypeScript types
│   ├── hooks/            # Custom React hooks
│   ├── context/          # React context
│   └── lib/              # Library code
├── public/               # Static files
├── tests/               # Test files
└── ...config files
```

## Testing

The project uses Jest and Testing Library for testing. Run tests with:

```bash
npm test
```

For test coverage:

```bash
npm run test:coverage
```

## Deployment

The project is configured to deploy to Vercel automatically when changes are pushed to the main branch. The deployment process is handled by GitHub Actions.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/docs/)
