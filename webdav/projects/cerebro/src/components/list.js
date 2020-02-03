import { ref } from "vue";
import html from "utils/html.js";

function isValidURL(str) {
  var a = document.createElement("a");
  a.href = str;
  return a.host && a.host != window.location.host;
}

async function Database() {
  window.global = global; // fix
  const stitch = await import("mongodb-stitch-browser-sdk");
  const client = stitch.Stitch.initializeDefaultAppClient("library-01-mxjco");

  const db = client
    .getServiceClient(stitch.RemoteMongoClient.factory, "mongodb-atlas")
    .db("library");

  await client.auth
    .loginWithCredential(new stitch.AnonymousCredential())
    .catch(console.error);

  return {
    get: () =>
      db
        .collection("futurs")
        .find({}, { limit: 100 })
        .asArray(),
    add: url =>
      db
        .collection("futurs")
        .updateOne(
          { url },
          { $set: { owner_id: client.auth.user.id, url } },
          { upsert: true }
        )
  };
}

export default {
  template: html`
    <div v-for="x in list">{{ x.owner_id }} {{ x.url }}</div>
    <div class="add">
      <input type="text" v-model="input" />
      <button type="button" @click="add">Add task</button>
    </div>
  `,
  async setup() {
    const db = await Database();
    const list = ref(await db.get());
    const input = ref("");
    return {
      list,
      input,
      add: async () => {
        if (isValidURL(input.value)) {
          await db.add(input.value);
          list.value = await db.get();
        } else {
          console.error("Invalid URL", input.value);
        }
      }
    };
  }
};
