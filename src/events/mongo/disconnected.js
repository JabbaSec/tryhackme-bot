module.exports = {
  name: "disconnected",
  execute() {
    console.log("\x1b[31m%s\x1b[0m", "[MONGODB] Disconnected.");
  },
};
