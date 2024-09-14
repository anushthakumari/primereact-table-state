export const setLoader = (bool: boolean = false): void => {
	const loaderContainer: HTMLElement | null = document.getElementById("loader-container");

	if (loaderContainer) {
		if (bool) {
			loaderContainer.classList.remove("hidden");
		} else {
			loaderContainer.classList.add("hidden");
		}
	}
};