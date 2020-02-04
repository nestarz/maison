function Filter(audio) {
  const context = new AudioContext();
  const audioSource = context.createMediaElementSource(audio);
  const filter = context.createBiquadFilter();
  audioSource.connect(filter);
  filter.connect(context.destination);

  filter.type = "lowshelf";
  filter.frequency.value = 3000;
  filter.gain.value = 2;

  return filter;
}

class AudioTrack extends HTMLElement {
  async connectedCallback() {
    const recorder = new MediaRecorder(await AudioTrack.stream);
    const audio = Object.assign(new Audio(), {
      class: "audio-track",
      autoplay: true,
      loop: true
    });

    this.recorder = recorder;
    this.audio = audio;

    Filter(audio);

    recorder.ondataavailable = async function(event) {
      const src = URL.createObjectURL(event.data);
      audio.setAttribute("src", src);
    };
  }
}

AudioTrack.stream = navigator.mediaDevices.getUserMedia({ audio: true });
customElements.define("audio-track", AudioTrack);
