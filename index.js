const { app: server } = require("./server");

server()
  .then((app) => {
    app
      .listen(3000, "0.0.0.0")
      // .then((_) => {})
      .catch((err) => {
        console.log("Error starting server: ", err);
        process.exit(1);
      });
  })
  .catch((err) => console.log(err));
