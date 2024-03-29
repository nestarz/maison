import path from "/www/utils/path.js";
import "components/render-markdown.js";

const html = (str, ...args) =>
  str
    .map((e, i) => [e, args[i]])
    .flat()
    .join("");

export const PreviewHTML = url =>
  html`
    <iframe src="${url}"></iframe>
  `;

export const Preview = files =>
  html`
    <div class="container files-${files.length}">
      ${files
        .map(file => {
          if (file.getcontenttype.includes("image/")) {
            return html`
              <div tabindex="0" class="image-container">
                <img src="${file.href}" />
              </div>
            `;
          } else if (
            file.getcontenttype.includes("text/markdown") ||
            file.getcontenttype.includes("text/plain")
          ) {
            return html`
              <div tabindex="0" class="text-container">
                <render-markdown src="${file.href}"></render-markdown>
              </div>
            `;
          }
        })
        .join("")}
    </div>
  `;

export const Parent = prev =>
  prev &&
  html`
    <li>
      🔙
      <span class="parent link" onclick="browseRender('${prev}')">${prev}</span>
    </li>
  `;

export const Folders = folders =>
  folders
    .filter(folder => folder.href !== "/www/")
    .map(
      folder =>
        html`
          <li>
            📁
            <span class="link" onclick="browseRender('${folder.href}')"
              >${folder.displayname}</span
            >
          </li>
        `
    )
    .join("");

export const Files = files =>
  files
    .filter(file => !file.displayname.startsWith("."))
    .map(
      file =>
        html`
          <li>
            📄
            <a href="${path.join("/", file.href)}" target="_blank"
              >${file.displayname}</a
            >
          </li>
        `
    )
    .join("");
