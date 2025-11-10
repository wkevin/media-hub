# CogniCanvas: AI-Powered Media Hub
[cloudflarebutton]
CogniCanvas is a visually stunning web application designed for users to upload, analyze, and interact with their media and PDF files. Upon uploading a file, the application leverages a powerful AI agent to perform a deep analysis of the content. This analysis generates a concise summary and a set of relevant tags, making the content easily discoverable. The core of the application is a beautiful, modern, and illustrative user interface that presents the user's files in a gallery-style grid.
## ✨ Key Features
*   **AI-Powered Analysis**: Automatically generates summaries and relevant tags for all uploaded media and documents.
*   **Seamless Uploads**: Upload files directly to Cloudflare R2 via pre-signed URLs for speed and reliability.
*   **Interactive Gallery**: View all your files in a beautiful, responsive, grid-based dashboard.
*   **In-Browser Viewers**: Play videos/audio and view PDFs directly in the browser without needing to download them.
*   **Powerful Search & Filter**: Easily find your files by searching for keywords or filtering by AI-generated tags.
*   **Modern UI/UX**: A visually stunning interface built with the latest web technologies for a delightful user experience.
## 🚀 Technology Stack
*   **Frontend**: React, Vite, TypeScript, Tailwind CSS
*   **UI Components**: shadcn/ui, Lucide React
*   **Animation**: Framer Motion
*   **State Management**: Zustand
*   **Backend**: Hono on Cloudflare Workers
*   **Stateful Services**: Cloudflare Agents (Durable Objects)
*   **AI**: Ollama (or any OpenAI-compatible API)
*   **Storage**: Cloudflare R2
## 🏁 Getting Started
Follow these instructions to get a local copy of the project up and running for development and testing purposes.
### Prerequisites
*   [Node.js](https://nodejs.org/en/) (v18 or later)
*   [Bun](https://bun.sh/)
*   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
*   [Ollama](https://ollama.com/) (for local AI processing)
### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cognicanvas.git
    cd cognicanvas
    ```
2.  **Install dependencies:**
    ```bash
    bun install
    ```
### Environment Variables
The backend worker requires environment variables to connect to your AI model provider. This project is configured to use Ollama by default.
1.  **Ensure Ollama is running:**
    Make sure you have [Ollama](https://ollama.com/) installed and running on your local machine. You can pull a model like Llama 3 by running:
    ```bash
    ollama pull llama3
    ```
2.  **Create a `.dev.vars` file:**
    If it doesn't exist, create a `.dev.vars` file in the root of the project:
    ```bash
    touch .dev.vars
    ```
3.  **Configure environment variables:**
    Add the following variables to your `.dev.vars` file. These are used by Wrangler for local development.
    ```ini
    CF_AI_BASE_URL="http://localhost:11434/v1"
    CF_AI_API_KEY="ollama"
    ```
    *   `CF_AI_BASE_URL`: This should point to your Ollama API endpoint. The default is `http://localhost:11434/v1`. If you are running Ollama on a different machine or port, update this value accordingly.
    *   `CF_AI_API_KEY`: For Ollama, the API key is not typically required, so you can use a placeholder value like `ollama`.
## ��� Development
To run the application locally, you'll need to start both the frontend Vite server and the backend Wrangler dev server.
1.  **Start the local worker:**
    Open a terminal and run:
    ```bash
    bun wrangler dev --remote
    ```
    This command starts a local server for your Hono backend and connects to your Cloudflare resources (like Durable Objects) remotely.
2.  **Start the frontend development server:**
    In a separate terminal, run:
    ```bash
    bun dev
    ```
    This will start the Vite development server. The application will be available at `http://localhost:3000` (or another port if 3000 is in use). The Vite server is configured to proxy API requests to the Wrangler server.
## �� Deployment
This project is designed for easy deployment to Cloudflare Pages.
1.  **One-Click Deploy:**
    You can deploy this project to your own Cloudflare account with a single click.
    [cloudflarebutton]
2.  **Manual Deployment via CLI:**
    If you've set up the project locally, you can deploy it using the Wrangler CLI.
    First, ensure you have logged into your Cloudflare account:
    ```bash
    bun wrangler login
    ```
    Then, run the deployment script from `package.json`:
    ```bash
    bun deploy
    ```
    This command will build the frontend application and deploy it along with the worker to your Cloudflare account.
    **Important**: After deploying, you must configure the production environment variables (`CF_AI_BASE_URL`, `CF_AI_API_KEY`) as secrets in your Worker's settings in the Cloudflare dashboard. For example, you could use a service like Groq or another OpenAI-compatible API provider for your production AI endpoint.
## 📂 Project Structure
*   `src/`: Contains all the frontend React application code.
    *   `components/`: Reusable UI components.
    *   `pages/`: Top-level page components.
    *   `lib/`: Utility functions and client-side libraries.
    *   `hooks/`: Custom React hooks.
*   `worker/`: Contains all the backend Hono application code that runs on Cloudflare Workers.
    *   `index.ts`: The entry point for the worker.
    *   `agent.ts`: The core `ChatAgent` Durable Object class.
    *   `userRoutes.ts`: Defines the API routes for the application.
*   `wrangler.jsonc`: Configuration file for the Cloudflare Worker.
*   `vite.config.ts`: Configuration for the Vite frontend build tool.
## 🤝 Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs, feature requests, or improvements.
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
## 📄 License
This project is licensed under the MIT License. See the `LICENSE` file for more details.