import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import multer from "multer";
import cors from "cors";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Configure Multer for file memory storage
  const storage = multer.memoryStorage();
  const upload = multer({ storage: storage });

  // API Route: File Hashing & IPFS Upload
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // 1. Generate SHA-256 Hash
      const hashSum = crypto.createHash("sha256");
      hashSum.update(req.file.buffer);
      const fileHash = hashSum.digest("hex");

      // 2. Upload to IPFS via Pinata
      const pinataApiKey = process.env.PINATA_API_KEY;
      const pinataSecretKey = process.env.PINATA_SECRET_API_KEY;

      if (!pinataApiKey || !pinataSecretKey) {
        return res.status(500).json({ 
          error: "Pinata API keys not configured in .env",
          fileHash 
        });
      }

      const formData = new FormData();
      const blob = new Blob([req.file.buffer], { type: req.file.mimetype });
      formData.append("file", blob, req.file.originalname);

      const pinataResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          headers: {
            "pinata_api_key": pinataApiKey,
            "pinata_secret_api_key": pinataSecretKey,
          },
        }
      );

      const cid = pinataResponse.data.IpfsHash;

      res.json({
        success: true,
        hash: fileHash,
        cid: cid,
        name: req.file.originalname
      });
    } catch (error: any) {
      console.error("Upload error:", error.response?.data || error.message);
      res.status(500).json({ error: "Failed to upload to IPFS", details: error.message });
    }
  });

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
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
