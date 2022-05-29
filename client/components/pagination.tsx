import { NextPage } from 'next';
import { range } from '../utils/range';

type PaginationProps = {
	page: number;
	totalPages: number;
	onPageClick: Function;
};

const getArrayPages = (page: number, totalPages: number) => {
	let result;
	const diff = totalPages - page;
	const superiorLimit = totalPages;

	if (totalPages < 6) result = range(1, superiorLimit);
	else if (page < 3) result = range(1, 6);
	else if (diff === 2) result = range(page - 2, superiorLimit);
	else if (diff === 1) result = range(page - 3, superiorLimit);
	else if (diff === 0) result = range(page - 4, superiorLimit);
	else result = range(page - 2, page + 3);

	return result;
};

const Pagination: NextPage<PaginationProps> = ({
	page,
	totalPages,
	onPageClick,
}) => {
	const arrayPages = getArrayPages(page, totalPages);
	const needStartTrim = !arrayPages.includes(1);
	const needFinalTrim = !arrayPages.includes(totalPages);
	const prevPage = page > 1 ? page - 1 : null;
	const nextPage = page < totalPages ? page + 1 : null;

	return (
		<div className="container mx-auto my-10">
			<ul className="flex items-center justify-center">
				<li className="px-5 py-3 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-lg mx-2">
					<button
						onClick={() =>
							prevPage ? onPageClick(prevPage) : false
						}
						disabled={page === 1}
					>
						<i className="ri-arrow-left-s-line" />
					</button>
				</li>
				{needStartTrim && (
					<>
						<li className="px-5 py-3 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-lg mx-2">
							<button
								onClick={() => onPageClick(1)}
								disabled={page === 1}
							>
								1
							</button>
						</li>
						<li>...</li>
					</>
				)}
				{arrayPages.map((pageNumber) => (
					<li key={`${page}-${pageNumber}-${totalPages}`}>
						<button
							onClick={() => onPageClick(pageNumber)}
							className="px-5 py-3 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-lg mx-2"
						>
							{pageNumber}
						</button>
					</li>
				))}
				{needFinalTrim && (
					<>
						<li>...</li>
						<li>
							<button
								onClick={() => onPageClick(totalPages)}
								className="px-5 py-3 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-lg mx-2"
							>
								{totalPages}
							</button>
						</li>
					</>
				)}
				<li>
					<button
						onClick={() =>
							nextPage ? onPageClick(nextPage) : false
						}
						className="px-5 py-3 cursor-pointer bg-gray-300 hover:bg-gray-400 rounded-lg mx-2"
					>
						<i className="ri-arrow-right-s-line" />
					</button>
				</li>
			</ul>
		</div>
	);
};

export default Pagination;
