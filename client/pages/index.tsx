import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Card from '../components/custom-card';
import Upload from '../components/upload';
import { useFeedNft } from '../hooks/useFeed';

const Home: NextPage = () => {
	const router = useRouter();
	const [page, setPage] = useState<number>();

	const { data: feed, isLoading, isError } = useFeedNft(page);

	useEffect(() => {
		if (router.isReady) {
			const { page } = router.query;
			setPage(page ? (page as unknown as number) : 1);
		}
	}, [router.isReady]);

	if (isLoading) return <>Loading feed...</>;
	if (isError) return <>Some error happened loading feed.</>;

	return (
		<div className="md:container mx-auto">
			<Upload />
			<div className="grid grid-cols-1 gap-10 md:grid-cols-3 mx-5">
				{feed?.rows.length &&
					feed.rows.map((nft) => {
						return <Card key={nft.id} nft={nft} />;
					})}
			</div>
		</div>
	);
};

export default Home;
