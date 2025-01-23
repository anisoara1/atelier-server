const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  optionsSuccessStatus: 204,
  exposedHeaders: ["Content-Length", "Access-Control-Allow-Private-Network"], // Include relevant headers
};

module.exports = {
  corsOptions,
};
