import { loaderProgressOff } from "vueless";

import { http } from "@/utils/http";

export default async (to, from, next) => {
  // stop the top loader and cancel all pending requests
  loaderProgressOff("any");

  if (to.name !== from.name) {
    http.cancelPendingRequests();
  }

  next();
};
