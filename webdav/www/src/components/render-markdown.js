import markdown from "./micro-down.js";

const trigger = {
  src: (host, _, newValue) =>
    fetch(newValue)
      .then(r => r.text())
      .then(content => (host.innerHTML = markdown.parse(content)))
      .catch(err => (host.innerHTML = JSON.stringify(err)))
};

class RenderMarkdown extends HTMLElement {
  static get observedAttributes() {
    return ["src"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    const fn = trigger[name];
    fn(this, oldValue, newValue);
  }
}

customElements.define("render-markdown", RenderMarkdown);
