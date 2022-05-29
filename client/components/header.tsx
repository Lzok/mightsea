import { useState } from 'react';
import { NextPage } from 'next';
import Image from 'next/image';
import { UserBasicData } from '../@types/user';
import { useLogin } from '../hooks/useLogin';
import { useLogout } from '../hooks/useLogout';
import { useUserSession } from '../hooks/useUserSession';
import Modal from '../components/modal';
import Login from '../components/login';

type UserProps = {
	user: UserBasicData;
};

const UserInfoHeader: NextPage<UserProps> = ({ user }) => {
	const logoutMutation = useLogout();

	function logout() {
		return logoutMutation.mutate();
	}

	return (
		<>
			<Image
				src={`/images/avatar.png`}
				className="rounded-full"
				width="40px"
				height="40px"
				alt="User Avatar"
			/>
			<div className="mx-5 flex flex-col">
				<div className="font-bold">{user.name}</div>
				<div className="font-bold">${user.balance}</div>
			</div>
			<i onClick={logout} className="ri-shut-down-line"></i>
		</>
	);
};

const LoginHeader: NextPage = () => {
	const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
	const [userId, setUserId] = useState<string>('');
	const authMutation = useLogin();

	const fakeLogin = () => {
		if (userId === '') alert('User ID cannot be an empty string');
		return authMutation.mutate(userId);
	};

	const onModalClose = () => {
		setShowLoginModal(false);
		setUserId('');
	};

	return (
		<>
			<button
				onClick={() => setShowLoginModal(true)}
				className="flex items-center rounded-lg w-full p-3 bg-blue-700 hover:bg-blue-600 text-white"
			>
				<span>Login</span>
			</button>
			<Modal show={showLoginModal}>
				<Login
					setUserId={(e) => setUserId(e.target.value)}
					onClickLogin={fakeLogin}
					onClose={onModalClose}
				></Login>
			</Modal>
		</>
	);
};

const Header = () => {
	const { data: user, isLoading, isError } = useUserSession({});

	if (isLoading) return <>Loading user...</>;
	if (isError) return <>Error fetching, please try again.</>;

	return (
		<div className="md:container mx-auto">
			<header className="position-fixed position-top background-white padding-m box-shadow-l">
				<div className="flex justify-between mb-2">
					<h1 className="text-3xl font-bold text-clifford py-5 px-5 cursor-pointer">
						Mightsea
					</h1>
					<div className="flex items-center cursor-pointer">
						{user ? (
							<UserInfoHeader user={user} />
						) : (
							<LoginHeader />
						)}
					</div>
				</div>
			</header>
		</div>
	);
};

export default Header;
