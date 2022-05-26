import { z } from 'zod';
import { nftInsertSchema } from '@src/schemas/nft';

export type NFTExtension = 'png' | 'jpg';

// Arguments to insert a new nft into the database
export type NewNftArgs = z.infer<typeof nftInsertSchema>;
