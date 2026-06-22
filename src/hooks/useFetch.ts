import { useEffect, useRef, useState } from "react";

export function useFetch<T>(url: string, config?: RequestInit) {
	const [data, setData] = useState<T>(null);
	const [requestState, setRequestState] = useState({
		isLoading: false,
		error: "",
	});

	const controllerRef = useRef<AbortController>(new AbortController());

	async function fetchData() {
		console.log("Fetch Data Called!!!");
		setRequestState({
			isLoading: true,
			error: "",
		});
		try {
			const response = await fetch(url, {
				...config,
				signal: controllerRef.current.signal,
			});

			console.log(response);

			if (!response.ok) {
				throw new Error(response.statusText);
			}

			const data = (await response.json()) as T;

			setData(data);
			setRequestState({
				isLoading: false,
				error: "",
			});
		} catch (err) {
			setRequestState({
				isLoading: false,
				error: err instanceof Error ? err.message : err,
			});
		}
	}

	useEffect(() => {
		return () => {
			console.log("COMPONENT UNMOUNTED");
			controllerRef.current.abort("Hook unmounted");
		};
	}, []);

	return {
		data,
		requestState,
		fetchData,
	};
}
