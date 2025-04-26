import { useRoute, useRouter } from "#app";
import type { LocationQuery } from "vue-router";

export default function useUrlParams() {
  const route = useRoute();
  const router = useRouter();

  const setParam = (key: string, value: string | number | undefined) => {
    const newQuery = { ...route.query };

    if (value === undefined || value === null || value === "") {
      delete newQuery[key];
    } else {
      newQuery[key] = value.toString();
    }

    // router.push({ query: newQuery });
    router.replace({ query: newQuery });
  };

  const removeParam = (key: string) => {
    const newQuery = { ...route.query };
    delete newQuery[key];
    router.push({ query: newQuery });
  };

  const setParams = (params: Record<string, string | number | undefined>) => {
    const newQuery = { ...route.query };

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") {
        delete newQuery[key];
      } else {
        newQuery[key] = value.toString();
      }
    }

    router.push({ query: newQuery });
  };

  const getParam = (key: string): string | undefined => {
    return route.query[key] as string | undefined;
  };

  const getParams = (): LocationQuery => {
    return route.query;
  };

  return {
    setParam,
    removeParam,
    setParams,
    route,
    getParam,
    getParams,
  };
}
