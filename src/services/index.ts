const API_BASE_URL: string = "https://api.artic.edu/api/v1";

export const fetchArtWorks = async (page: number = 1, limit: number = 12): Promise<any> => {
	const resp: Response = await fetch(
		API_BASE_URL +
			"/artworks?page=" +
			encodeURIComponent(page) +
			"&limit=" +
			limit
	);

	return await resp.json();
};