const Upload = () => {
	return (
		<div className="mb-5 mx-5">
			<label className="flex justify-center w-full h-20 px-4 transition bg-blue-100 border-2 border-blue-700 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-400 focus:outline-none">
				<span className="flex items-center space-x-2">
					<i className="ri-add-line font-lg"></i>
					<span className="font-medium text-gray-600">
						Drag image here to mint it, or{' '}
						<span className="text-blue-600 underline">browse</span>
					</span>
				</span>
				<input type="file" name="file_upload" className="hidden" />
			</label>
		</div>
	);
};

export default Upload;
