import { z } from 'zod';
import { nftInsertSchema } from '@src/schemas/nft';
import { idSchema } from '@src/schemas/shared';

export type NFTExtension = 'png' | 'jpg';

// Arguments to insert a new nft into the database
export type NewNftArgs = z.infer<typeof nftInsertSchema>;
export type NftId = z.infer<typeof idSchema>;