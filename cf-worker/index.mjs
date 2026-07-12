// Cloudflare Worker shim — routes all traffic to the BEAT admin (Next.js) container.
import { Container, getContainer } from "@cloudflare/containers";

export class BeatAdminContainer extends Container {
  defaultPort = 3000;
  sleepAfter = "20m";

  constructor(ctx, env) {
    super(ctx, env);
    this.envVars = {
      API_URL: env.API_URL ?? "",
      NEXT_PUBLIC_API_URL: env.API_URL ?? "",
    };
  }
}

export default {
  async fetch(request, env) {
    return getContainer(env.BEAT_ADMIN_CONTAINER).fetch(request);
  },
};
