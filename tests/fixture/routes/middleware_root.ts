import { MultiHandler } from "../../../server.ts";

interface State {
  root: string;
}

export const handler: MultiHandler<undefined, State> = {
  GET(_req: Request, { state }) {
    return new Response(JSON.stringify(state));
  },
};
