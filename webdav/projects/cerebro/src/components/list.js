import { ref } from "vue";
import html from "utils/html.js";

const isValidURL = string => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

async function Database() {
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
    add: data =>
      db
        .collection("futurs")
        .updateOne(
          { url: data.url },
          { $set: { owner_id: client.auth.user.id, ...data } },
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
        const url = isValidURL(input.value) ? input.value : false;

        if (url) {
          const request = await fetch("https://metadata.nestarz.now.sh/" + url);
          const metadata = await request.json();
          console.log(metadata);
          await db.add({ metadata, url });
          list.value = await db.get();
        } else {
          console.error("Invalid URL", input.value);
        }
      }
    };
  }
};
