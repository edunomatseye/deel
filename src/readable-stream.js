fetch("https://www.example.org")
  .then((response) => response.body)
  .then((rb) => {
    const reader = rb.getReader();

    return new ReadableStream({
      start(controller) {
        // The following function handles each data chunk
        function push() {
          // "done" is a Boolean and value a "Uint8Array"
          reader.read().then(({ done, value }) => {
            // If there is no more data to read
            if (done) {
              console.log("done", done);
              controller.close();
              return;
            }
            // Get the data and send it to the browser via the controller
            controller.enqueue(value);
            // Check chunks by logging to the console
            console.log(done, value);
            push();
          });
        }

        push();
      },
    });
  })
  .then((stream) =>
    // Respond with our stream
    new Response(stream, { headers: { "Content-Type": "text/html" } }).text(),
  )
  .then((result) => {
    // Do things with result
    console.log(result);
  });

const image = document.getElementById("image");
fetch("../tortoise.jpg")
  .then((response) => response.body)
  .then((body) => {
    const reader = body.getReader();
    return new ReadableStream({
      start(controller) {
        pump();

        function pump() {
          reader.read().then(({ done, value }) => {
            if (done) {
              controller.close();
              return;
            }

            controller.enqueue(value);
            return pump();
          });
        }
      },
    });
  })
  .then((stream) => new Response(stream))
  .then((response) => response.blob())
  .then((blob) => URL.createObjectURL(blob))
  .then((imageURL) => console.log((image.src = imageURL)))
  .catch(console.error);

const buffer = new ArrayBuffer(8);
const view = new Int32Array(buffer);
