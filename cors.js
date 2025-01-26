const corsOptions = {
  optionsSuccessStatus: 200,
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  optionsSuccessStatus: 204,
  exposedHeaders: ["Content-Length", "Access-Control-Allow-Private-Network"],
};

export default {
  corsOptions,
};
