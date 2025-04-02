# AI Council

AI Council is an interactive application that provides multiple perspectives on your questions through different AI archetypes. Each archetype offers a unique viewpoint, helping you gain a well-rounded understanding of your queries.

## Features

### AI Archetypes
- **The Strategist**: Analytical and detail-oriented advisor providing structured, methodical insights
- **The Empath**: Emotionally intelligent counselor focusing on emotional aspects and supportive guidance
- **The Innovator**: Creative thinker generating unique perspectives and unconventional solutions

### Conversation Features
- **Multi-threaded Discussions**: Engage in separate conversations with each archetype
- **Focused Dialogues**: Have a dedicated conversation with any single archetype while keeping others visible
- **Context Awareness**: Each archetype maintains conversation history and context
- **Independent Responses**: Reply to specific archetype's answers individually

### Technical Features
- Built with Next.js and TypeScript
- Anthropic's Claude AI integration
- Dark mode interface
- Responsive design
- Real-time responses
- Error handling and loading states
- Keyboard shortcuts (Cmd/Ctrl + Enter to submit)

## Prerequisites

Before you begin, ensure you have:
- Node.js (v18 or newer)
- npm (comes with Node.js)
- A Claude API key from Anthropic

## Installation

1. Clone the repository:
```bash
git clone https://github.com/codyburke970/ai-council.git
cd ai-council
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory:
```bash
CLAUDE_API_KEY=your_claude_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Enter your question in the text area
2. Click "Ask the Council" or press Cmd/Ctrl + Enter
3. Receive three unique perspectives from:
   - The Strategist (analytical view)
   - The Empath (emotional perspective)
   - The Innovator (creative solutions)

## Environment Variables

The following environment variables are required:

| Variable | Description |
|----------|-------------|
| CLAUDE_API_KEY | Your Anthropic Claude API key |

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Claude API](https://console.anthropic.com/) - AI integration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Anthropic for Claude AI
- The Next.js team for the framework
- The open-source community for inspiration 