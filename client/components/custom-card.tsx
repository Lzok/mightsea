import { NextPage } from 'next';
import { NFT } from '../@types/nfts';
import { APP_BASE_URL } from '../constants/urls';

type Props = {
	nft: NFT;
};

const CustomCard: NextPage<Props> = ({ nft }) => {
	return (
		<div className="bg-white rounded-lg">
			{/* <Image
				src={`${APP_BASE_URL}/${nft.path}`}
				width="600px"
				height="400px"
				className="p-5 rounded-lg w-full"
				alt={nft.description}
			/> */}
			<img
				src={`${APP_BASE_URL}/${nft.path}`}
				alt={nft.description}
				className="p-5 rounded-lg w-full"
				style={{ width: '600px', height: '400px' }}
			/>
			<div className="px-5 py-5 pt-0">{nft.description}</div>
			<div className="p-5 pt-0">
				<button className="flex items-center rounded-lg w-full p-3 bg-blue-700 hover:bg-blue-600 text-white">
					<i className="ri-money-dollar-circle-fill mr-3 text-xl"></i>
					<span>{nft.price} Buy now</span>
				</button>
			</div>
		</div>
	);
};

export default CustomCard;
