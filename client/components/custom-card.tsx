import { NextPage } from 'next';
import { NFT } from '../@types/nfts';
import { UserBasicData } from '../@types/user';
import { APP_BASE_URL } from '../constants/urls';
import { useBuyNft } from '../hooks/useBuyNft';
import { useUserSession } from '../hooks/useUserSession';

type Props = {
	nft: NFT;
};

const CustomCard: NextPage<Props> = ({ nft }) => {
	const { data: user, isLoading, isError } = useUserSession({});
	const buyMutation = useBuyNft();

	if (isLoading) return <>Loading user...</>;
	if (isError) return <>Error fetching, please try again.</>;

	const onBuyNft = (nft: NFT) => {
		if (user && user.id === nft.owner_id)
			alert('You are already the owner.');
		if (user && user.balance < nft.price)
			alert('Your balance is not enough :(');

		return buyMutation.mutate(nft.id);
	};

	const getBuyNode = (user: UserBasicData, nft: NFT) => {
		if (user.id === nft.owner_id)
			return (
				<div className="flex items-center rounded-lg w-full p-3 bg-green-500 hover:bg-green-600 text-white">
					<i className="ri-money-dollar-circle-fill mr-3 text-xl"></i>
					<span>{nft.price} This NFT is yours!</span>
				</div>
			);

		return (
			<button
				onClick={() => onBuyNft(nft)}
				className="flex items-center rounded-lg w-full p-3 bg-blue-700 hover:bg-blue-600 text-white"
			>
				<i className="ri-money-dollar-circle-fill mr-3 text-xl"></i>
				<span>{nft.price} Buy now</span>
			</button>
		);
	};

	return (
		<div className="bg-white rounded-lg">
			<img
				src={`${APP_BASE_URL}/${nft.path}`}
				alt={nft.description}
				className="p-5 rounded-lg w-full"
				style={{ width: '600px', height: '400px' }}
			/>
			<div className="px-5 py-5 pt-0">{nft.description}</div>
			<div className="p-5 pt-0">
				{user ? (
					getBuyNode(user, nft)
				) : (
					<div className="flex items-center rounded-lg w-full p-3 bg-blue-500 hover:bg-blue-600 text-white">
						<i className="ri-money-dollar-circle-fill mr-3 text-xl"></i>
						<span>{nft.price} Log In to buy!</span>
					</div>
				)}
			</div>
			<div className="px-5 py-5 pt-0">Owner: {nft.owner_name}</div>
			<div className="px-5 py-5 pt-0">
				Creators: {nft.creators.map((c) => c.name).join(', ')}
			</div>
		</div>
	);
};

export default CustomCard;
