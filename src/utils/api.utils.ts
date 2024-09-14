import constants from "../constants";
import { setLoader } from "./helpers";

export const APIHandler = (
	fn: (...args: any[]) => Promise<any>, 
	openLoader: boolean = true, 
	isalert: boolean = false
) => 
	async (...params: any[]): Promise<any> => {
		try {
			if (openLoader) {
				setLoader(true);
			}
			return await fn(...params);
		} catch (error: unknown) {
			if (isalert) {
				alert("something went wrong");
			}

			if (!constants.IS_PROD) {
				console.log(error);
			}
		} finally {
			if (openLoader) {
				setLoader(false);
			}
		}
	};