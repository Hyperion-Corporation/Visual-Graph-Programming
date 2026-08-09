import { ApolloProvider, useQuery } from "@apollo/client";
import { apolloClient } from "./client";
import { ROADMAP_STORIES_QUERY, GRAPH_NODES_QUERY, GRAPH_EDGE_LANES_QUERY } from "./queries";
import type { RoadmapStory, GraphNode, GraphEdgeLane } from "../../interfaces/types";
import "./ApolloGraphPanel.css";

function RoadmapStoriesGrid() {
  const { data, loading, error } = useQuery<{ roadmapStories: RoadmapStory[] }>(ROADMAP_STORIES_QUERY);
  const { data: nodeData } = useQuery<{ graphNodes: GraphNode[] }>(GRAPH_NODES_QUERY);
  const { data: laneData } = useQuery<{ graphEdgeLanes: GraphEdgeLane[] }>(GRAPH_EDGE_LANES_QUERY);

  if (loading) return <p className="apollo-status">Querying docs/content graph…</p>;
  if (error) return <p className="apollo-status apollo-error">{error.message}</p>;

  return (
    <>
      <div className="apollo-stats">
        <div className="apollo-stat">
          <span className="apollo-stat-value">{nodeData?.graphNodes.length ?? "—"}</span>
          <span className="apollo-stat-label">Graph nodes</span>
        </div>
        <div className="apollo-stat">
          <span className="apollo-stat-value">{laneData?.graphEdgeLanes.length ?? "—"}</span>
          <span className="apollo-stat-label">Edge lanes</span>
        </div>
        <div className="apollo-stat">
          <span className="apollo-stat-value">{data?.roadmapStories.length ?? 0}</span>
          <span className="apollo-stat-label">Roadmap tracks</span>
        </div>
      </div>

      <ul className="apollo-story-list">
        {data?.roadmapStories.map((story) => (
          <li key={story.id} className="apollo-story-card">
            <div className="apollo-story-header">
              <h3>{story.title}</h3>
              <span className="apollo-story-track">{story.track}</span>
            </div>
            <p>{story.summary}</p>
            <div className="apollo-story-footer">
              <div className="apollo-story-tags">
                {story.tags.map((tag) => (
                  <span key={tag} className="apollo-tag">
                    {tag}
                  </span>
                ))}
              </div>
              {story.docPath && (
                <a className="apollo-story-link" href={story.docPath}>
                  Read more →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * Framework island · Apollo/GraphQL — queries src/graphql/schema.graphql's
 * real Query fields (graphNodes, graphEdgeLanes, roadmapStories), served
 * from this repo's own roadmap/graph-layout data (see ./client.ts) since
 * there's no live docs backend yet.
 */
export default function ApolloGraphPanel() {
  return (
    <ApolloProvider client={apolloClient}>
      <section className="apollo-island-wrap panel">
        <p className="island-label">Framework island · Apollo/GraphQL — docs/content graph (src/graphql/)</p>
        <RoadmapStoriesGrid />
      </section>
    </ApolloProvider>
  );
}
