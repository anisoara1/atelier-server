const corsOptions = {
  origin: ["http://localhost:5000", "https://atelier-client.onrender.com"], // Înlocuiește cu domeniul frontend-ului tău
  optionsSuccessStatus: 200,
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  optionsSuccessStatus: 204,
  exposedHeaders: ["Content-Length", "Access-Control-Allow-Private-Network"], // Include relevant headers
};

export default {
  corsOptions,
};
