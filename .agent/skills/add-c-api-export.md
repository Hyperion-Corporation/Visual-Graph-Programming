---
description: Guide for adding a new function to the base/ core and exposing it through the stable C API consumed by the extension, app, and plugin.
---

You are a C++ systems expert working on the VGP `base/` core library.

## Task: Add a New Core Function Exposed via the C API

### 1. Implement the C++ Function

Add the implementation under `base/src/` in the owning component (parsing, graph, query, server):

```cpp
// base/src/query/blast_radius.cpp
#include "vgp/query/blast_radius.hpp"

namespace vgp::query {

Result<SubGraph> blast_radius(GraphDb& db, NodeId root, int max_hops) {
    // Run the traversal inside the database; shape results here.
    // Never throw across component boundaries — return Result<T>.
    return db.run_traversal(make_blast_radius_query(root, max_hops));
}

} // namespace vgp::query
```

**Key rules:**
- Heavy work runs on core worker threads — the function must be callable from the WebSocket server without blocking request dispatch.
- Return `Result<T>`; exceptions never escape the component.
- Multi-hop logic belongs in the Cypher/GQL query, not in C++ loops.

### 2. Expose It in the C API

The C API is `extern "C"`, versioned, and uses only plain structs + opaque handles:

```cpp
// base/include/vgp/c_api.h
typedef struct vgp_subgraph vgp_subgraph;  // opaque

VGP_API vgp_status vgp_query_blast_radius(
    vgp_db* db, uint64_t root_node_id, int max_hops,
    vgp_subgraph** out /* free with vgp_subgraph_free */);

VGP_API void vgp_subgraph_free(vgp_subgraph* g);
```

```cpp
// base/src/c_api/query.cpp — convert Result<T> -> vgp_status at the seam,
// catch everything, never let C++ exceptions cross.
```

**C API rules:**
- No STL types across the boundary; every allocation has an explicit `_free`.
- Additive changes only; breaking changes bump `vgp_api_version()` and update all consumers in the same PR.

### 3. Extend the WebSocket Protocol (if frontends need it)

Add a request/response message pair to the protocol schema, bump the protocol minor version, and handle it in the server dispatch. Mirror the typed message in `extension/src/protocol.ts` and the Rust enums in `app/src-tauri`.

### 4. Rebuild and Test

```bash
pixi run build
pixi run test
```

Add a GoogleTest in `base/test/` covering: normal input, empty graph, max-hops boundary, and concurrent ingest during query.

## Checklist
- [ ] Implementation returns `Result<T>`, no exceptions across boundaries
- [ ] C API entry uses opaque handles + explicit free function
- [ ] Protocol message added and versioned (if frontend-facing)
- [ ] Consumers updated (extension protocol.ts / Rust enums) in the same PR
- [ ] `pixi run test` passes, including a new regression test
