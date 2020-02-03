import { createApp } from "vue";
import html from "utils/html.js";

import FuturList from "components/list.js";

const app = createApp({
  components: { FuturList },
  template: html`
    <Suspense>
      <template #default>
        <futur-list></futur-list>
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  `
});

app.mount("#app");
