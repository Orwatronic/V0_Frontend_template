# Triage: "Loading chunk 7345 failed" on /crm

## Summary
Users may see an error like:
> Loading chunk 7345 failed. (error: .../_next/static/chunks/7345.78d78d210d5e6f05.js)

This occurs when the browser attempts to fetch a code-split JavaScript chunk that is no longer available (404 or network error). The most common cause is navigating on a client that loaded an older build and then moving into a route that requires chunk files from a newer deployment. The old client still references stale chunk IDs, which fail to load. [^1]

## Symptoms
- Console: "Loading chunk <id> failed" or "ChunkLoadError".
- Network: 404 for a _next/static/chunks/<id>.<hash>.js file.
- Happens more often right after a redeploy or on preview URLs.

## Quick Verification
1) Hard-refresh /crm (Shift+Reload or Ctrl/Cmd+Shift+R).
2) Open DevTools > Network and reproduce the navigation. Check the 404 on the chunk URL.
3) Try loading /crm directly in a fresh tab (no client-side navigation).

If the page loads after a hard refresh, the issue was likely due to stale assets between deployments.

## Recommended Fix

### A) Global Auto-Recovery Guard (preferred)
Add a small client component mounted in app/layout.tsx that:
- Listens for "unhandledrejection" and checks error messages including "Loading chunk" or "ChunkLoadError".
- On match, force a full reload (window.location.reload() or window.location.href = current URL).
- Optionally (for Pages Router), listen to `Router.events.on('routeChangeError', ...)`. For App Router, the unhandledrejection guard is sufficient.

Acceptance criteria:
- When a chunk load fails during client navigation, the guard reloads the page automatically.
- No regression on landing page or other routes.
- Guard is idle otherwise.

### B) Operational SOP
- After each deployment, if users report this error, ask them to hard refresh.
- Clear service worker caches if using one (we are not, by default).
- Validate the chunk URL returns 200 after refresh.

## Why this is safe
A hard reload swaps the old in-memory app (pointing to stale files) for the new build, ensuring chunk URLs and HTML are consistent.

## Long-term Considerations
- Keep the auto-recovery guard in place permanently to handle deploy transitions on previews.
- Minimize aggressive prefetching for rarely-used heavy routes to reduce cache staleness (optional).
- Monitor logs for repeated chunk failures; if frequent, review deploy cadence and client caching.

## Status / Next Step
- Pending: Implement the global auto-recovery guard.

## References
- Vercel deployments are immutable; navigating across fresh deployments on existing clients can surface asset mismatch errors. See general error guidance for applications on Vercel. [^1]
