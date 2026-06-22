import { useFetch } from "../hooks/useFetch";
import type { ResponseType } from "../types/fetchTypes";

export function Wrapper() {
	const { data, fetchData, requestState } = useFetch<ResponseType>(
		"https://jsonplaceholder.typicode.com/posts"
	);

	console.log(data);

	return (
		<div className="wrapper">
			<div className="wrapper_content">
				<h1>Fetch Data</h1>

				<div className="action">
					<button onClick={() => fetchData()}>Fetch Data</button>
				</div>
				<div className="content_main">
					<div className="content">
						{requestState.isLoading ? (
							<div className="loadingState">Loading...</div>
						) : (
							<>
								<div className="content_head">Data:</div>
								<div className="content_body">
									{data
										? JSON.stringify(
												data.slice(0, 5),
												null,
												6
											)
										: "Data not fetched yet!"}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
