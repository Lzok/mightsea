import { NextPage } from 'next';
import { ReactNode } from 'react';

type ModalProps = {
	children: ReactNode;
	show: boolean;
};

const Modal: NextPage<ModalProps> = ({ children, show }) => {
	return (
		<div
			className={`relative z-10 ${show ? '' : 'hidden'}`}
			aria-labelledby="modal-title"
			role="dialog"
			aria-modal="true"
		>
			<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
			<div className="fixed z-10 inset-0 overflow-y-auto">
				<div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
					<div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-4xl sm:w-full">
						<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							{children}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
