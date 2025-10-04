# LinkedIn AI Assistant

An AI-powered LinkedIn automation system that records conversations, analyzes them with AI, and automatically manages LinkedIn connections and messaging.

## 🌟 Features

- **📱 PWA Mobile App**: Record conversations via QR code scanning
- **🤖 AI Processing**: Transcribe and analyze conversations using OpenAI Whisper + GPT-4
- **🔗 LinkedIn Integration**: Chrome extension for automated connection requests and messaging
- **⚡ Auto-Pilot Mode**: AI automatically responds to LinkedIn messages based on conversation context
- **📊 Real-time Sync**: Live synchronization between mobile app and Chrome extension

## 🏗️ Architecture

### Three-Component System

1. **PWA Mobile App** - Record and manage conversations
2. **Supabase Backend** - Database, auth, storage, and AI processing
3. **Chrome Extension** - LinkedIn automation and contact management

### Tech Stack

- **Frontend**: React 18+ with TypeScript, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **AI**: OpenAI Whisper API (transcription) + GPT-4 (analysis/responses)
- **Chrome Extension**: Manifest v3 with content scripts and service worker

## 📁 Project Structure

```
yc_hackathon/
├── docs/                          # Documentation and build logs
├── shared/                        # Shared TypeScript types
├── supabase/                      # Backend database and functions
│   ├── functions/                 # Edge Functions for AI processing
│   │   ├── process-audio/         # Audio transcription and analysis
│   │   ├── generate-response/     # AI message generation
│   │   └── send-connection-request/ # LinkedIn connection automation
│   └── migrations/                # Database schema
├── pwa-app/                       # Progressive Web App
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── hooks/                 # Custom React hooks
│   │   └── lib/                   # Utilities and Supabase client
│   └── public/                    # PWA manifest and icons
└── chrome-extension/              # Chrome Extension
    ├── src/
    │   ├── sidebar/               # React popup/sidebar app
    │   ├── content/               # LinkedIn DOM monitoring
    │   └── background/            # Service worker coordination
    └── public/                    # Extension manifest and icons
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Supabase account
- OpenAI API key
- Chrome browser (for extension development)

### 1. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database migration:
   ```sql
   -- Copy and run the contents of supabase/migrations/20250101000000_initial_schema.sql
   ```
3. Set up Supabase Edge Functions environment variables:
   - `OPENAI_API_KEY`: Your OpenAI API key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### 2. PWA Mobile App

```bash
cd pwa-app
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase URL and anon key

# Development
npm run dev

# Build for production
npm run build
```

### 3. Chrome Extension

```bash
cd chrome-extension
npm install

# Configure environment variables
cp .env.local.example .env.local
# Edit .env.local with your Supabase URL and anon key

# Development
npm run dev

# Build for production
npm run build
```

To install the extension:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `chrome-extension/dist` folder

### 4. Supabase Edge Functions

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy functions
supabase functions deploy process-audio
supabase functions deploy generate-response
supabase functions deploy send-connection-request
```

## 📱 Usage

### Recording Conversations

1. Open the PWA mobile app
2. Sign in with email/password
3. Tap "Scan QR Code"
4. Scan your contact's LinkedIn QR code
5. Start recording your conversation
6. Stop recording when done
7. AI will process and analyze the conversation

### LinkedIn Automation

1. Install and configure the Chrome extension
2. Open LinkedIn in Chrome
3. The extension sidebar shows your contacts
4. Enable "Auto-Pilot" for specific contacts
5. AI will automatically:
   - Send personalized connection requests
   - Respond to incoming messages based on conversation context

## 🔧 Configuration

### Environment Variables

**PWA App & Chrome Extension (.env.local):**
```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Supabase Edge Functions:**
```bash
OPENAI_API_KEY=sk-...
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Schema

The system uses 4 main tables:
- `contacts` - LinkedIn contact information
- `conversations` - Recorded conversation data and AI analysis
- `ai_actions` - Log of automated LinkedIn actions
- `linkedin_messages` - Message history between user and contacts

## 🤖 AI Features

### Conversation Analysis
- **Transcription**: OpenAI Whisper converts audio to text
- **Summarization**: GPT-4 creates concise conversation summaries
- **Topic Extraction**: Identifies key discussion points
- **Sentiment Analysis**: Determines conversation tone
- **Action Items**: Suggests follow-up actions

### Automated Responses
- **Context-Aware**: Uses conversation history and relationship type
- **Personalized**: Incorporates custom instructions per contact
- **Professional**: Maintains appropriate tone and style
- **Real-time**: Responds automatically when auto-pilot is enabled

## 🔒 Security & Privacy

- **Row Level Security**: Database access restricted to authenticated users
- **Client-side Audio**: Audio processing happens in secure Edge Functions
- **Encrypted Storage**: All data encrypted at rest in Supabase
- **Permission-based**: Chrome extension only accesses LinkedIn when needed

## 🧪 Development

### Available Scripts

**PWA App:**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

**Chrome Extension:**
```bash
npm run dev          # Start development with hot reload
npm run build        # Build extension for production
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

### Browser Testing

- **PWA**: Test on mobile devices using the development server URL
- **Chrome Extension**: Load unpacked extension in Chrome for testing
- **LinkedIn Integration**: Test on [linkedin.com](https://linkedin.com) messaging

## 🐛 Troubleshooting

### Common Issues

1. **Audio Recording Fails**: Check microphone permissions in browser
2. **QR Scanner Not Working**: Ensure camera permissions are granted
3. **Extension Not Loading**: Verify manifest.json and permissions
4. **AI Processing Slow**: Check OpenAI API key and rate limits
5. **Database Errors**: Verify Supabase connection and RLS policies

### Debugging

- **PWA**: Use browser DevTools console
- **Chrome Extension**: Use `chrome://extensions/` developer tools
- **Edge Functions**: Check Supabase function logs
- **Database**: Use Supabase dashboard SQL editor

## 🚢 Deployment

### PWA Mobile App
Deploy to any static hosting service (Vercel, Netlify, etc.):
```bash
npm run build
# Deploy the dist/ folder
```

### Chrome Extension
1. Build the extension: `npm run build`
2. Package the `dist/` folder as a .zip file
3. Upload to Chrome Web Store Developer Dashboard

### Supabase Functions
Deploy using Supabase CLI:
```bash
supabase functions deploy --project-ref YOUR_PROJECT_REF
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for Whisper and GPT-4 APIs
- Supabase for backend infrastructure
- LinkedIn for the professional networking platform
- React and TypeScript communities for excellent tooling

---

**Built with ❤️ for automating professional networking**
