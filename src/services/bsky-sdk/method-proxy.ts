import { Agent } from '@atproto/api';

function getSuggestedFeeds(agent: Agent) {
  return agent.app.bsky.feed.getSuggestedFeeds.bind(agent.app.bsky.feed);
}

function getFeed(agent: Agent) {
  return agent.app.bsky.feed.getFeed.bind(agent.app.bsky.feed);
}

const methodOverrides: { [key: string]: Function } = {
  getSuggestedFeeds,
  getFeed
};

/**
 * Accept custom method calls and method calls to the atproto SDK
 * @param agent atproto SDK Agent
 * @returns SDKMethodProxy
 */
export const SDKMethodProxy = function (agent: Agent) {
  const proxy = new Proxy(agent, {
    get(agent, method: string) {
      return methodOverrides[method]
        ? methodOverrides[method](agent)
        : (agent[method as keyof typeof agent] as Function)!.bind(agent);
    },
  });

  return proxy;
};

export default SDKMethodProxy;
