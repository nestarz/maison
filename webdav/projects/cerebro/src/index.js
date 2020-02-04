import { createApp, onMounted } from "vue";
import html from "utils/html.js";
import { type } from "utils/typical.js";

import FuturList from "components/list.js";

const app = createApp({
  components: { FuturList },
  template: html`
    <header>
    <div class="line" style="width: 6px;"></div>
    <div class="line blur" style="transform: translate(20%, -40rem) rotate(61deg) scale(1, 2); width: 6px;"></div>
      <h1><div>Future</div><div id="search"></div></h1>
      <p><div>Building the open</div><div>web index of all future</div></p>
    </header>
    <main>
      <Suspense>
        <template #default>
          <futur-list></futur-list>
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </main>
  `,
  setup() {
    onMounted(() => {
      type(document.querySelector("#search"), "X", 300, "Y", 300, "Z", 310, "Search");
    });
  }
});

app.mount("#app");
