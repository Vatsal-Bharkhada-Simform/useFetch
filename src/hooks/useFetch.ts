import { useCallback, useEffect, useRef, useState } from "react";

interface UseFetchReturnType<T> {
	data: T | null;
	requestState: {
		isLoading: boolean;
		error: string;
	};
	fetchData: () => void;
}

export function useFetch<T>(
	url: string,
	config?: RequestInit
): UseFetchReturnType<T> {
	const [data, setData] = useState<T | null>(null);
	const [requestState, setRequestState] = useState({
		isLoading: false,
		error: "",
	});

	const controllerRef = useRef<AbortController>(null);

	if (controllerRef.current === null) {
		controllerRef.current = new AbortController();
	}

	const fetchData = useCallback(
		async function fetchData() {
			if (controllerRef.current) {
				controllerRef.current.abort();
			}
			controllerRef.current = new AbortController();
			setRequestState({
				isLoading: true,
				error: "",
			});

			try {
				const response = await fetch(url, {
					...config,
					signal: controllerRef.current.signal,
				});

				if (!response.ok) {
					throw new Error(
						response.statusText ||
							"Error while fetching data. Response status code: " +
								response.status
					);
				}

				const responseData = (await response.json()) as T;
				setData(responseData);
				setRequestState({
					isLoading: false,
					error: "",
				});
			} catch (err) {
				if (
					controllerRef.current &&
					!controllerRef.current.signal.aborted
				) {
					setRequestState({
						isLoading: false,
						error:
							err instanceof Error
								? err.message
								: "Unexpected error occured",
					});
				}
			}
		},
		[url, config]
	);

	useEffect(() => {
		return () => {
			if (controllerRef.current)
				controllerRef.current.abort("Hook unmounted");
		};
	}, []);

	return {
		data,
		requestState,
		fetchData,
	};
}
