---
description: Guide for evolving the code property graph schema (node/edge types) in GrafeoDB safely.
---

You are a graph-database expert working on the VGP code property graph.

## Task: Add or Change a Graph Schema Element

### Rules
- **Byte-offset anchors are sacred**: every node/edge that maps to source text carries `file_id`, `start_byte`, `end_byte`. Schema changes must never drop or bypass them.
- **One store**: embeddings live on nodes in the same GrafeoDB instance — no parallel stores.
- **Migrations are idempotent** and versioned; an existing on-disk database must open after upgrade.
- **Incremental invalidation must keep working**: new elements need a clear owner subtree so edits invalidate them correctly.

---

### 1. Update the Schema Definition

The schema (node labels, edge types, properties) is defined in one place in `base/` (schema header + Cypher DDL). Add the new element there:

```cypher
-- e.g. new edge type for data-flow dependencies
CREATE REL TABLE IF NOT EXISTS FLOWS_INTO (
    FROM Variable TO Variable,
    via STRING,          -- assignment | call_arg | return
    start_byte INT64,
    end_byte INT64
);
```

### 2. Write the Migration

Add a numbered migration (e.g. `base/src/graph/migrations/0007_flows_into.cypher`) and register it in the migration runner. Requirements:
- `IF NOT EXISTS` guards — re-running must be a no-op.
- Bump the schema version stored in the DB metadata node.
- If backfill is needed, it runs batched and resumable.

### 3. Update the Extraction Layer

Teach the AST→graph extractor to emit the new element, with correct anchors and subtree ownership (so `tree.edit()` invalidation covers it).

### 4. Update Consumers

- Query API / C API result structs, WebSocket protocol messages (versioned).
- Backend Python models (pydantic) and any Graph-RAG serializers.
- Frontend types (`NodeKind`/`EdgeKind` unions) — exhaustive switches will flag omissions.

### 5. Test

```bash
pixi run test          # extraction + migration unit tests
uv run pytest          # backend model/serializer tests
```

Required cases:
- Fresh DB creates the element; existing fixture DB migrates and re-opens.
- Migration re-applied → no-op (idempotency).
- Incremental edit of a source file correctly invalidates/rebuilds the new element.

## Checklist
- [ ] Schema defined in the single source-of-truth location
- [ ] Idempotent, versioned migration registered
- [ ] Anchors present on all new source-mapped elements
- [ ] Extractor emits it with correct subtree ownership
- [ ] Protocol + Python + TypeScript types updated (exhaustive switches pass)
- [ ] Fresh-create, migrate, and idempotency tests green
