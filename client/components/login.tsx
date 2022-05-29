import { NextPage } from 'next';
import { ChangeEventHandler, MouseEventHandler } from 'react';

type LoginProps = {
	onClose: MouseEventHandler<HTMLDivElement>;
	onClickLogin: MouseEventHandler<HTMLButtonElement>;
	setUserId: ChangeEventHandler<HTMLInputElement>;
};

const Login: NextPage<LoginProps> = ({ onClose, onClickLogin, setUserId }) => {
	return (
		<>
			<div className="mt-3 text-center sm:mt-0 sm:text-left">
				<h3
					className="text-lg leading-6 font-medium text-gray-900"
					id="modal-title"
				>
					Login
				</h3>
				<div
					onClick={onClose}
					className="mt-2 absolute right-5 top-2 cursor-pointer"
				>
					<i className="ri-close-line"></i>
				</div>
				<div className="mt-2 flex justify-between">
					<div className="ml-4 w-full">
						<div className="mt-5 mb-2 font-bold text-sm text-gray-500">
							User ID
						</div>

						<div>
							<div className="flex items-center cursor-pointer">
								<input
									type="text"
									onChange={setUserId}
									placeholder="78f8ce6f-1940-404e-be23-60b8f77926f5"
									className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
				<button
					onClick={onClickLogin}
					className="items-center text-center align-center rounded-lg w-full p-3 bg-green-700 hover:bg-green-600 text-white"
				>
					<span>Login</span>
				</button>
			</div>
		</>
	);
};

export default Login;
