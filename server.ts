import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- YOUR CUSTOM API STARTS HERE ---
  
  // Example: A simple custom endpoint
  app.get("/api/hello", (req, res) => {
    res.json({ 
      message: "Hello from your custom API!",
      timestamp: new Date().toISOString() 
    });
  });

  // Example: An endpoint that handles data
  app.post("/api/data", (req, res) => {
    const { input } = req.body;
    res.json({ 
      received: input,
      processed: `You sent: ${input}` 
    });
  });

  // Example: An endpoint that returns a list of resources
  app.get("/api/resources", (req, res) => {
    const resources = [
      { id: 1, title: "JAMB Success Tips", category: "Exam Prep", link: "#" },
      { id: 2, title: "Top 10 Tech Skills for 2026", category: "Career", link: "#" },
      { id: 3, title: "Scholarship Opportunities in Nigeria", category: "Funding", link: "#" },
    ];
    res.json(resources);
  });

  // --- YOUR CUSTOM API ENDS HERE ---

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PathBridge Server running on http://localhost:${PORT}`);
  });
}

startServer();
