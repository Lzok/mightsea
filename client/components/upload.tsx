import { NextPage } from 'next';
import {
	ChangeEventHandler,
	DragEventHandler,
	forwardRef,
	LegacyRef,
} from 'react';

type UploadProps = {
	onFileDrop: DragEventHandler<HTMLLabelElement>;
	onFileChange: ChangeEventHandler<HTMLInputElement>;
};

const Upload: NextPage<UploadProps> = forwardRef(
	({ onFileDrop, onFileChange }, ref: LegacyRef<HTMLInputElement>) => {
		const dragOver = (e: React.DragEvent<HTMLLabelElement>) => {
			e.preventDefault();
		};

		const dragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
			e.preventDefault();
		};

		return (
			<label
				htmlFor="nft-upload"
				onDragEnter={dragEnter}
				onDragOver={(e) => dragOver(e)}
				onDrop={(e) => onFileDrop(e)}
			>
				<div className="mb-5 mx-5">
					<label className="flex justify-center w-full h-20 px-4 transition bg-blue-100 border-2 border-blue-700 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-400 focus:outline-none">
						<span className="flex items-center space-x-2">
							<i className="ri-add-line font-lg"></i>
							<span className="font-medium text-gray-600">
								Drag image here to mint it, or{' '}
								<span className="text-blue-600 underline">
									browse
								</span>
							</span>
						</span>
						<input
							type="file"
							name="file_upload"
							className="hidden"
							onChange={onFileChange}
							ref={ref}
						/>
					</label>
				</div>
			</label>
		);
	}
);

export default Upload;
