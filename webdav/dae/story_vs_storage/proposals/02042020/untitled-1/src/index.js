import workerTimer from "worker-timer";
import browse from "https://chez.eliasrhouzlane.com/www/utils/browse.js";
import "components/track.js";
import "render-markdown";

const endpoint = "http://localhost:2000/";
const folder =
  "/dae/story_vs_storage/data/from_martina/images/2019-08-14.2019-08-20.Martina/";

const random = arr => arr[Math.floor(Math.random() * arr.length)];

function Recorder() {
  const context = new AudioContext();
  const dest = context.createMediaStreamDestination();
  document.querySelectorAll("audio-track").forEach(track => {
    console.log(track.audio);
    const audioSource = context.createMediaElementSource(track.audio);
    audioSource.connect(dest);
  });
  const mixedTracks = dest.stream.getTracks();
  const stream = new MediaStream(mixedTracks);
  const recorder = new MediaRecorder(stream);
  var clicked = false;
  var chunks = [];
  const button = document.querySelector("button");
  button.addEventListener("click", async function(e) {
    if (!clicked) {
      recorder.start();
      e.target.innerHTML = "Stop recording";
      clicked = true;
    } else {
      e.target.disabled = true;
      await recorder.stop();
      e.target.disabled = false;
      e.target.innerHTML = "Record";
      clicked = false;
      chunks = [];
    }
  });

  recorder.ondataavailable = function(evt) {
    // push each chunk (blobs) in an array
    chunks.push(evt.data);
  };

  recorder.onstop = function(evt) {
    // Make blob out of our blobs, and open it.
    var blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
    document.querySelector("audio").src = URL.createObjectURL(blob);
  };
}

async function main() {
  const docs = await browse(endpoint, folder);
  const images = docs.files
    .filter(file => file.getcontenttype === "image/jpeg")
    .map(image => endpoint + image.href);
  document.querySelectorAll("audio-track").forEach((track, index) => {
    const length = Math.pow(index + 1, 2) * 5 * 1000 + Math.random() * 1; // Durée d'une boucle sonore
    const window = 0.2 * length; // Fenêtre d'enregistrement
    function sequencer() {
      track.recorder.start();
      track.classList.toggle("recording");
      track.style.cssText = `background-image: url(${random(
        images
      )}); background-size: contain;`;

      workerTimer.setTimeout(() => {
        track.recorder.stop();
        track.classList.toggle("recording");
        track.style.cssText = `background-image: none;`;
      }, window);
    }
    workerTimer.setInterval(sequencer, length);
    sequencer();
  });

  Recorder();
}

main();
