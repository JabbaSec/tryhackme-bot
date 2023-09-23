module.exports = {
  name: "reconnected",
  execute() {
    console.log("\x1b[32m%s\x1b[0m", "[MONGODB] Reconnected.");
  },
};
