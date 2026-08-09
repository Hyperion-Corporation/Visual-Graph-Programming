import { gql } from "@apollo/client";

/** Field shapes mirror src/graphql/schema.graphql's Query type exactly. */

export const GRAPH_NODES_QUERY = gql`
  query GraphNodes {
    graphNodes {
      id
      kind
      label
      x
      y
    }
  }
`;

export const GRAPH_EDGE_LANES_QUERY = gql`
  query GraphEdgeLanes {
    graphEdgeLanes {
      id
      kind
      label
    }
  }
`;

export const ROADMAP_STORIES_QUERY = gql`
  query RoadmapStories {
    roadmapStories {
      id
      title
      track
      summary
      tags
      docPath
    }
  }
`;

export const ROADMAP_STORY_QUERY = gql`
  query RoadmapStory($id: ID!) {
    roadmapStory(id: $id) {
      id
      title
      track
      summary
      tags
      docPath
    }
  }
`;
