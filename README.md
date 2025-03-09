# Customer Service AI Assistant

A modern customer service application built with Next.js that leverages LangGraph and OpenAI to intelligently process customer inquiries, feedback, and support requests.

## Features

- **Smart Message Processing**: Automatically categorizes and processes customer messages using LangGraph
- **Feedback Analysis**: Identifies positive and negative feedback in customer messages
- **Technical Support**: Handles bug reports and technical questions with appropriate responses
- **Modern UI**: Clean, responsive interface built with Tailwind CSS and Radix UI components
- **Real-time Interactions**: Immediate responses to customer inquiries

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **AI/ML**: LangGraph, OpenAI
- **Styling**: Tailwind CSS, Radix UI components
- **Type Safety**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/hamidfarmani/customer-service.git
   cd customer-service
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Add your OpenAI API key and other required variables

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router pages and layouts
- `/src/components`: Reusable UI components
- `/src/features`: Feature-specific components, models, and services
- `/src/lib`: Utility functions and LangGraph implementation
- `/src/hooks`: Custom React hooks

## Usage

1. Navigate to the dashboard
2. Enter customer messages in the chat interface
3. The system will automatically:
   - Categorize the message (feedback, bug report, technical question)
   - Generate appropriate responses
   - Provide support information when needed
