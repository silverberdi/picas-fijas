// Replaced by the owner at deploy time; it contains public routing only, never secrets.
// Preserve executor-injected configuration so real E2E can bind an isolated API.
globalThis.__PICAS_FIJAS_CONFIG__ = globalThis.__PICAS_FIJAS_CONFIG__ || {};
globalThis.__PICAS_FIJAS_CONFIG__.basePath ??= '/';
globalThis.__PICAS_FIJAS_CONFIG__.wsUrl ??= '';
