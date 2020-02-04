import { ref } from "vue";
import html from "utils/html.js";

function isValidURL(str) {
  try {
    return new URL(str);
  } catch (error) {
    return false;
  }
}

async function Database() {
  const client = stitch.Stitch.initializeDefaultAppClient("library-01-mxjco");

  const db = client
    .getServiceClient(stitch.RemoteMongoClient.factory, "mongodb-atlas")
    .db("library");

  await client.auth
    .loginWithCredential(new stitch.AnonymousCredential())
    .catch(console.error);

  return {
    get: (query = {}) =>
      db
        .collection("futurs")
        .find(query, { limit: 100 })
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
    <nav>
      <div class="add">
        <span
          >Resource must be a valid HTML response embedding metadata following
          the Future vocabulary. Please refer to the
          <a href="">documentation</a>.</span
        >
        <span></span>
        <input type="text" v-model="input" />
        <div class="button" @click="add">Add Future Resource (URL)</div>
        <div class="result" :class="result.ok ? 'ok' : 'notok'" v-if="result">
          {{ result.message }}
        </div>
      </div>
      <div class="search"></div>
    </nav>
    <h2>
      <div></div>
      <div>Items</div>
    </h2>
    <table class="futur-item">
      <thead>
        <tr>
          <th>owner_id</th>
          <th>url</th>
          <th>metadata.era</th>
          <th>metadata.location</th>
          <th>metadata.theme</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="x in list">
          <td>{{ x.owner_id }}</td>
          <td><a :href="x.url">{{ x.url }}</a></td>
          <td>{{ x.metadata.era }}</td>
          <td>{{ x.metadata.location }}</td>
          <td>{{ x.metadata.theme }}</td>
        </tr>
      </tbody>
    </table>
    <h2>
      <div></div>
      <div>Libraries</div>
    </h2>
    <table class="futur-item">
      <thead>
        <tr>
          <th>owner_id</th>
          <th>url</th>
          <th>metadata.format</th>
        </tr>
      </thead>
    </table>
  `,
  async setup() {
    const db = await Database();
    const list = ref(await db.get());
    const input = ref("");
    const result = ref(null);

    async function addURL() {
      const url = isValidURL(input.value) ? new URL(input.value).href : null;
      if (!url) {
        throw Error("Invalid URL", input.value);
      }

      const fixurl = url.replace("://", ":/");
      const res = await fetch("https://extruct.nestarz.now.sh/" + fixurl);
      const metadata = await res.json();
      const futur = metadata["json-ld"].find(json => json["@type"] === "Futur");

      if (!futur) {
        throw Error("Resource have no JSON-LD with Future type.", input.value);
      }

      console.log(futur);
      await db.add({
        url,
        metadata: futur,
        date: new Date(Date.now()).toISOString()
      });

      list.value = await db.get();
    }

    return {
      list,
      input,
      result,
      add: () => {
        result.value = {
          ok: null,
          message: "Loading..."
        };
        addURL()
          .then(() => {
            result.value = {
              ok: true,
              message: "Successfuly added."
            };
          })
          .catch(err => {
            result.value = {
              ok: false,
              message: err.toString()
            };
          });
      }
    };
  }
};
