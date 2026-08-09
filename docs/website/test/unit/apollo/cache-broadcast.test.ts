import { describe, expect, it, vi } from 'vitest';
import { apolloClient } from '../../../src/frameworks/apollo/client';
import { GRAPH_NODES_QUERY } from '../../../src/frameworks/apollo/queries';
import * as dataModule from '../../../src/frameworks/apollo/data';

// Per-island test matrix, "cache broadcast" row. client.ts's local
// ApolloLink resolves Query fields by calling into data.ts's plain
// getGraphNodes()/getGraphEdgeLanes()/etc — proves the shared InMemoryCache
// (not the link) serves a second read of the same entity, the same
// guarantee a live GraphQL server + normalized cache gives multiple
// `useQuery` call sites (e.g. two ApolloGraphPanel instances) reading the
// same data.
describe('Apollo island — InMemoryCache broadcast', () => {
  it('serves a second query for the same data from cache, not the local resolver again', async () => {
    const getGraphNodesSpy = vi.spyOn(dataModule, 'getGraphNodes');

    const first = await apolloClient.query({ query: GRAPH_NODES_QUERY, fetchPolicy: 'cache-first' });
    expect(getGraphNodesSpy).toHaveBeenCalledTimes(1);
    expect(first.data.graphNodes.length).toBeGreaterThan(0);

    const second = await apolloClient.query({ query: GRAPH_NODES_QUERY, fetchPolicy: 'cache-first' });
    // Still 1 — the second call site read the InMemoryCache, it didn't
    // re-invoke the local resolver (the same behavior a real network
    // round-trip would skip on a cache hit).
    expect(getGraphNodesSpy).toHaveBeenCalledTimes(1);
    expect(second.data).toEqual(first.data);

    getGraphNodesSpy.mockRestore();
  });
});
