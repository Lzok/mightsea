import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import debounce from 'lodash.debounce';
import CreateNFT from '../components/create-nft';
import Modal from '../components/modal';

import Card from '../components/custom-card';
import Pagination from '../components/pagination';
import Upload from '../components/upload';
import { useFeedNft } from '../hooks/useFeed';
import { useMint } from '../hooks/useMintNft';
import { useUserSession } from '../hooks/useUserSession';

const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i;

type RefObjectFiles = {
	files: FileList | [];
};

const Home: NextPage = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>();
	const [showMintModal, setShowMintModal] = useState<boolean>(false);

	// Uploader handles
	const inputImage = useRef<null | RefObjectFiles>(null);
	const [nftPreview, setNftPreview] = useState<string>('');

	// NFT attributes handlers
	const [description, setDescription] = useState<string>('');
	const [creators, setCreators] = useState<string>('');
	const [price, setPrice] = useState<number>(0);
	const debouncedSetDescription = debounce(setDescription, 500);
	const debouncedSetCreators = debounce(setCreators, 500);
	const debouncedSetPrice = debounce(setPrice, 500);

	// Mint Mutation. This will be executed when we want to send the data to mint an NFT to the backend
	const mintMutation = useMint();

	const {
		data: user,
		isLoading: isLoadingUser,
		isError: isErrorUser,
	} = useUserSession({});

	const { data: feed, isLoading, isError } = useFeedNft(page);

	useEffect(() => {
		if (router.isReady) {
			const { page } = router.query;
			setPage(page ? (page as unknown as number) : 1);
		}
	}, [router.isReady]);

	const onPageClick = (page: unknown) => {
		setPage(() => (page ? (page as unknown as number) : 1));
	};

	const onFileChange = async () => {
		setShowMintModal(true);

		if (inputImage.current) {
			const objectUrl = URL.createObjectURL(inputImage.current.files[0]);
			setNftPreview(objectUrl);
		}
	};

	const closeModal = () => {
		setShowMintModal(false);
		if (inputImage.current) inputImage.current.files = [];
	};

	const onFileDrop = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		const { dataTransfer } = e;

		if (dataTransfer.files[0].type.startsWith('image/')) {
			if (inputImage.current) {
				inputImage.current.files = dataTransfer.files;
				onFileChange();
			}
		} else {
			alert('Only jpg and png are accepted.');
		}
	};

	const mint = () => {
		return mintMutation.mutate({
			file: nftPreview,
			creators,
			price,
			description,
		});
	};

	if (isLoading) return <>Loading feed...</>;
	if (isError) return <>Some error happened loading feed.</>;

	if (isLoadingUser) return <>Loading user...</>;
	if (isErrorUser) return <>Some error happened loading user.</>;

	return (
		<div className="md:container mx-auto">
			{user ? (
				<Upload
					onFileDrop={(e) => onFileDrop(e)}
					onFileChange={onFileChange}
					// @ts-ignore
					ref={inputImage}
				/>
			) : (
				<div className="mb-5 mx-5">
					<div className="flex justify-center w-full h-20 px-4 transition bg-blue-100 border-2 border-blue-700 border-dashed rounded-md appearance-none hover:border-blue-400 focus:outline-none">
						<span className="flex items-center space-x-2">
							Please Log In to mint your own NFTs!
						</span>
					</div>
				</div>
			)}

			<Modal show={showMintModal}>
				<CreateNFT
					nftPreview={nftPreview}
					onClose={closeModal}
					setPrice={(e) => debouncedSetPrice(Number(e.target.value))}
					setDescription={(e) =>
						debouncedSetDescription(e.target.value)
					}
					setCreators={(e) => debouncedSetCreators(e.target.value)}
					onClickMint={mint}
				></CreateNFT>
			</Modal>

			<div className="grid grid-cols-1 gap-10 md:grid-cols-3 mx-5">
				{feed?.rows.length &&
					feed.rows.map((nft) => {
						return <Card key={nft.id} nft={nft} />;
					})}
			</div>
			<Pagination
				page={page as number}
				totalPages={(feed?.total_pages as number) || 1}
				onPageClick={onPageClick}
			/>
		</div>
	);
};

export default Home;
