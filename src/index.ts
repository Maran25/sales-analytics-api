import app from "./app";
import { connectToDatabase } from "./config/db";

(async () => {
  try {
    await connectToDatabase(); 
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start the server:", error);
    process.exit(1);
  }
})();
