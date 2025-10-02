const app = require("../src/app");

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`The server is running on port: ${PORT}`);
});