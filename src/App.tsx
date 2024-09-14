import { useState, useEffect, useCallback, useRef, FormEvent } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Paginator } from "primereact/paginator";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputNumber } from "primereact/inputnumber";

import * as services from "./services";
import { APIHandler } from "./utils/api.utils";

const PER_PAGE_COUNT = 12;

const PER_PAGE_OPTIONS = [
	...new Array(3).fill(PER_PAGE_COUNT).map((v, i) => v * (i + 1)),
];

interface Artwork {
	id: number;
	title: string;
	place_of_origin?: string;
	artist_display?: string;
	inscriptions?: string;
	date_start?: string;
	date_end?: string;
	[key: string]: any;
}

interface PaginationState {
	offset: number;
	limit: number;
	total: number;
}

export default function BasicDemo() {
	const [arts, setArts] = useState<Artwork[]>([]);
	const [paginationState, setPaginationState] = useState<
		Partial<PaginationState>
	>({});
	const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);

	const op = useRef<OverlayPanel>(null);
	const selectedRowsRef = useRef<Artwork[]>(selectedRows); // ref to handle rerendering

	const feedRows = useCallback(
		async (page: number = 1, limit: number = PER_PAGE_COUNT) => {
			const resp = await APIHandler(services.fetchArtWorks)(page, limit);
			if (resp) {
				// Handle empty selection
				const indexOfFirstEmptySpace = selectedRowsRef.current.findIndex(
					(v) => v === null
				);
				const isSpaceLeftInSelectedRows = indexOfFirstEmptySpace > -1;

				//if there are spaces in the array
				if (isSpaceLeftInSelectedRows) {
					const selectedItems = [...selectedRowsRef.current];
					let respIndex = 0;

					//fill the remaining spaces
					for (
						let index = indexOfFirstEmptySpace;
						index < selectedItems.length;
						index++
					) {
						if (respIndex >= resp.data.length) {
							break;
						}
						selectedItems[index] = resp.data[respIndex];
						respIndex++;
					}

					selectedRowsRef.current = selectedItems;
				}

				setArts(resp.data);
				setPaginationState(resp.pagination);
			}
		},
		[]
	);

	const onPageChange = (event: any) => {
		const newPage = event.page + 1;
		const limit = event.rows;

		feedRows(newPage, limit);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const target = e.target as HTMLFormElement;
		const rowSelectionSize = parseInt(target.nrowsselect.value.trim());

		if (isNaN(rowSelectionSize)) {
			return;
		}

		//create spaces for the rows that are going to be added
		const selectedItems = [...new Array(rowSelectionSize).fill(null)];

		for (const [index] of selectedItems.entries()) {
			if (index >= arts.length) {
				break;
			}

			//fill the space
			selectedItems[index] = arts.at(index) as Artwork;
		}

		setSelectedRows(selectedItems);
		selectedRowsRef.current = selectedItems;
		op.current?.toggle(e); //closing the toggle right after selection
	};

	const handleSelectionChange = (e: any) => {
		selectedRowsRef.current = e.value as Artwork[];
		setSelectedRows(e.value as Artwork[]);
	};

	// Syncing ref and state
	if (selectedRowsRef.current !== selectedRows) {
		setSelectedRows(selectedRowsRef.current);
	}

	const headerTemplate = () => {
		return (
			<div>
				<Button
					icon="pi pi-chevron-down"
					className="p-button-text p-button-plain"
					style={{ marginLeft: "0.5rem" }}
					onClick={(e) => op.current?.toggle(e)}
				/>
			</div>
		);
	};

	useEffect(() => {
		feedRows();
	}, [feedRows]);

	return (
		<div className="card">
			<DataTable
				dataKey="id"
				value={arts}
				selectionMode={"checkbox"}
				tableStyle={{ minWidth: "50rem" }}
				selection={selectedRows}
				scrollable
				stripedRows
				scrollHeight="88vh"
				onSelectionChange={handleSelectionChange}>
				<Column selectionMode="multiple" header={headerTemplate()}></Column>

				<Column field="title" header="Title"></Column>
				<Column field="place_of_origin" header="Origin"></Column>
				<Column field="artist_display" header="Artist"></Column>
				<Column field="inscriptions" header="Inscriptions"></Column>
				<Column field="date_start" header="Date Started"></Column>
				<Column field="date_end" header="Date Ended"></Column>
			</DataTable>

			<OverlayPanel ref={op}>
				<form onSubmit={handleSubmit} className="select-rows-container">
					<InputNumber
						placeholder="select rows..."
						name="nrowsselect"
						required
					/>
					<Button type="submit">Submit</Button>
				</form>
			</OverlayPanel>

			<Paginator
				first={paginationState.offset}
				rows={paginationState.limit}
				totalRecords={paginationState.total}
				rowsPerPageOptions={PER_PAGE_OPTIONS}
				onPageChange={onPageChange}
			/>
		</div>
	);
}
