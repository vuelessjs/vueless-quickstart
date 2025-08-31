import { createRouter, createWebHistory } from "vue-router";

import mainLayout from "./layouts/mainLayout";

import beforeEachMiddleware from "./middlewares/beforeEach.middleware";
import afterEachMiddleware from "./middlewares/afterEach.middleware";

/**
 * Create Vue Router instance.
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes: [
    mainLayout,
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
});

/**
 * Add global middlewares.
 */
router.beforeEach(beforeEachMiddleware);
router.afterEach(afterEachMiddleware);

/**
 * Load routes dynamically from modules and add them into related layouts.
 */
async function initModuleRoutes(defaultLayoutName = "MainLayout") {
  const modules = import.meta.glob("@/modules/**/routes.js");

  for (const path in modules) {
    const { default: routes } = await modules[path]();

    routes.forEach((route) => {
      route.meta = {
        ...route.meta,
        module: path.split("modules").pop().split("/").at(1),
      };

      const parentName = route.meta?.layout;

      /* Define routes for specific layouts. */
      router.addRoute(parentName ?? defaultLayoutName, route);
    });
  }
}

export { router, initModuleRoutes };
