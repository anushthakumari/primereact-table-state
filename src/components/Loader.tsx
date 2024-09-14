import { FC } from "react";

const Loader: FC = () => {
	return (
		<div id="loader-container" className="loader-overlay hidden">
			<div className="loader"></div>
		</div>
	);
};

export default Loader;
