module.exports = {
  name: "error",
  execute(error) {
    console.log(
      "\x1b[31m%s\x1b[0m",
      `[MONGODB] An error has occured! \n${error}`
    );
  },
};
