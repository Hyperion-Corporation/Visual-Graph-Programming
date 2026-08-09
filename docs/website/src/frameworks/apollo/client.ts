import { ApolloClient, ApolloLink, InMemoryCache, Observable, type FetchResult } from "@apollo/client";
import { getOperationName } from "@apollo/client/utilities";
import { getRoadmapStories, getRoadmapStoryById, getGraphNodes, getGraphEdgeLanes } from "./data";

/**
 * There is no live GraphQL server for this docs site — content graph is
 * scaffolded ahead of a real backend. This link resolves
 * `schema.graphql`'s actual Query fields against this repo's real data
 * (src/stories/ roadmap tracks, the illustrative node/edge layout in
 * ./data.ts) instead of hitting the network — the same "real data, no live
 * server" bar src/graphql/schema.graphql's own header note sets, and the
 * same reuse ethic the Aurelia island applies to src/simulations/.
 */
const localSchemaLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    const name = getOperationName(operation.query);
    let data: FetchResult["data"];

    switch (name) {
      case "GraphNodes":
        data = { graphNodes: getGraphNodes() };
        break;
      case "GraphEdgeLanes":
        data = { graphEdgeLanes: getGraphEdgeLanes() };
        break;
      case "RoadmapStories":
        data = { roadmapStories: getRoadmapStories() };
        break;
      case "RoadmapStory":
        data = { roadmapStory: getRoadmapStoryById(operation.variables.id as string) };
        break;
      default:
        observer.error(new Error(`Apollo island: no local resolver for operation "${name}"`));
        return;
    }

    // Mirror real network latency so loading states are exercised too.
    const timer = setTimeout(() => {
      observer.next({ data });
      observer.complete();
    }, 120);

    return () => clearTimeout(timer);
  });
});

export const apolloClient = new ApolloClient({
  link: localSchemaLink,
  cache: new InMemoryCache(),
});
