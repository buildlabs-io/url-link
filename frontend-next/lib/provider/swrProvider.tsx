"use client";

import { useEffect } from "react";
import {
  SWRConfig,
  unstable_serialize,
  useSWRConfig,
  type Cache,
  type Middleware,
  type State,
} from "swr";

import type { ReactNode } from "react";

export const SWR_CACHE_KEY = "url-link:swr-cache";

const STALE_AFTER_MS = 30_000;

type CacheState = State<unknown, Error>;
type StoredCache = {
  token: string | null;
  entries: [string, { data: unknown; ts: number }][];
};

const staleRestoredKeys = new WeakMap<Cache<unknown>, Set<string>>();

const reloadCache: Middleware = (useSWRNext) =>
  function useReloadCache(key, fetcher, config) {
    const { cache } = useSWRConfig();
    const cacheKey = unstable_serialize(key);
    const hasCachedData = cacheKey && cache?.get(cacheKey)?.data !== undefined;
    const revalidateOnMount =
      !hasCachedData ||
      !!(cache && staleRestoredKeys.get(cache)?.has(cacheKey));

    useEffect(() => {
      if (cacheKey && cache) staleRestoredKeys.get(cache)?.delete(cacheKey);
    }, [cache, cacheKey]);

    return useSWRNext(key, fetcher, {
      ...config,
      revalidateOnMount,
      revalidateIfStale: revalidateOnMount,
    });
  };

function localStorageProvider(): Cache<unknown> {
  const cache = new Map<string, CacheState>();
  const timestamps = new Map<string, number>();
  const staleKeys = new Set<string>();
  staleRestoredKeys.set(cache, staleKeys);
  if (typeof window === "undefined") return cache;

  const token = localStorage.getItem("token");

  try {
    const stored = JSON.parse(
      localStorage.getItem(SWR_CACHE_KEY) || "null",
    ) as StoredCache | null;
    if (stored?.token === token && Array.isArray(stored.entries)) {
      for (const [key, { data, ts }] of stored.entries) {
        const cachedAt = Number.isFinite(ts) ? ts : 0;
        cache.set(key, { data } as CacheState);
        timestamps.set(key, cachedAt);
        if (Date.now() - cachedAt > STALE_AFTER_MS) staleKeys.add(key);
      }
    }
  } catch {
    // An invalid or unavailable local cache should not block data fetching.
  }

  const save = () => {
    try {
      if (localStorage.getItem("token") !== token) return;
      const entries: StoredCache["entries"] = Array.from(cache.entries())
        .filter(([, state]) => state.data !== undefined)
        .map(([key, state]) => [
          key,
          { data: state.data, ts: timestamps.get(key) ?? Date.now() },
        ]);
      localStorage.setItem(SWR_CACHE_KEY, JSON.stringify({ token, entries }));
    } catch {
      // SWR still works in memory if storage is full or unavailable.
    }
  };

  const set = cache.set.bind(cache);
  const remove = cache.delete.bind(cache);
  cache.set = (key, state) => {
    const previous = cache.get(key);
    if (
      state.data !== undefined &&
      (state.data !== previous?.data ||
        (previous?.isValidating === true && state.isValidating === false)) &&
      !state.error
    ) {
      timestamps.set(key, Date.now());
    }
    const result = set(key, state);
    save();
    return result;
  };
  cache.delete = (key) => {
    timestamps.delete(key);
    staleKeys.delete(key);
    const result = remove(key);
    save();
    return result;
  };

  return cache;
}

export default function SwrProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        provider: localStorageProvider,
        use: [reloadCache],
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
