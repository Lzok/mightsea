import { NextPage } from 'next';
import Image from 'next/image';
import { UserBasicData } from '../@types/user';
import { useLogin } from '../hooks/useLogin';
import { useUserSession } from '../hooks/useUserSession';

type UserProps = {
	user: UserBasicData;
};

const UserInfoHeader: NextPage<UserProps> = ({ user }) => {
	console.log('user', user);
	return (
		<>
			<Image
				src={`/images/avatar.png`}
				className="rounded-full"
				width="40px"
				height="40px"
				alt="User Avatar"
			/>
			<div className="mx-5 font-bold">{user.name}</div>
		</>
	);
};

const LoginHeader: NextPage = () => {
	const authMutation = useLogin();

	function fakeLogin(user_id: UserBasicData['id']) {
		return authMutation.mutate(user_id);
	}

	return (
		<button
			onClick={() => fakeLogin('78f8ce6f-1940-404e-be23-60b8f77926f5')}
			className="flex items-center rounded-lg w-full p-3 bg-blue-700 hover:bg-blue-600 text-white"
		>
			<span>Login</span>
		</button>
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
