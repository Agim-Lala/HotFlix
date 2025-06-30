import { useCallback, useEffect, useState } from "react";

export type Query<TResponse> =
  | { status: "success"; response: TResponse }
  | { status: "loading" | "idle"; response: undefined }
  | { status: "error"; response: undefined; error: string };

const useQuery = <TResponse,>(fetchResponse: () => Promise<TResponse>) => {
  const [query, setQuery] = useState<Query<TResponse>>({
    status: "loading",
    response: undefined,
  });

  const excecute = useCallback(async () => {
    try {
      setQuery({ status: "loading", response: undefined });
      const response = await fetchResponse();
      setQuery({ status: "success", response });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching: ", error);
        setQuery({
          status: "error",
          response: undefined,
          error: error.message || "Failed to fetch",
        });
      }
    }
  }, [fetchResponse]);

  useEffect(() => {
    (async () => await excecute())();
  }, [excecute]);

  return { query, refetch: excecute };
};

export default useQuery;
