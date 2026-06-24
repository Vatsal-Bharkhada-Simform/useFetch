import { useEffect, useRef, useState } from "react";

export function useFetch<T>(url: string, config?: RequestInit) {
	const [data, setData] = useState<T>();
	const [requestState, setRequestState] = useState({
		isLoading: false,
		error: "",
	});

	const controllerRef = useRef<AbortController>(new AbortController());

	async function fetchData() {
		controllerRef.current.abort();
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

			const data = (await response.json()) as T;

			setData(data);

			setRequestState({
				isLoading: false,
				error: "",
			});
		} catch (err) {
			if (!controllerRef.current.signal.aborted) {
				setRequestState({
					isLoading: false,
					error:
						err instanceof Error
							? err.message
							: "Unexpected error occured",
				});
			}
		}
	}

	useEffect(() => {
		return () => {
			controllerRef.current.abort("Hook unmounted");
		};
	}, []);

	return {
		data,
		requestState,
		fetchData,
	};
}
