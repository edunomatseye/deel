const autocannon = require("autocannon");
require("dotenv").config();

function startBench() {
  const url = "http://localhost:" + (process.env.PORT || 3001);

  const args = process.argv.slice(2);
  const connections = args[0] || 1000;
  const maxConnectionRequests = args[1] || 1000;

  const instance = autocannon(
    {
      title: "Deel concurrent connections",
      url,
      connections,
      duration: 10,
      maxConnectionRequests,
      headers: {
        "content-type": "application/json",
        profile_id: "3",
      },
      requests: [
        {
          method: "GET",
          path: "/",
        },
      ],
    },
    finishedBench,
  );

  autocannon.track(instance);

  function finishedBench(err, res) {
    console.log("Finished Bench", err, res);
  }
}

startBench();
