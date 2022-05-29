-- BEGIN USERS SEED --
INSERT INTO users (id, name, email, balance)
VALUES ('1134e9e0-02ae-4567-9adf-220ead36a6ef', 'Calvin', 'ccleever0@discuz.net', 100);

INSERT INTO users (id, name, email, balance)
VALUES ('7dd619dd-b997-4351-9541-4d8989c58667', 'Reggi', 'rhay1@a8.net', 100);

INSERT INTO users (id, name, email, balance)
VALUES ('059ca92f-f505-40d3-9f80-c8822f0c9cdf', 'Peri', 'pallatt2@cornell.edu', 100);

INSERT INTO users (id, name, email, balance)
VALUES ('492851bb-dead-4c9d-b9f6-271dcf07a8bb', 'Shepard', 'sdoel3@youtu.be', 100);

INSERT INTO users (id, name, email, balance)
VALUES ('a3c79f45-ce04-49dc-b0f3-1327d0e0a367', 'Prissie', 'pupston4@merriam-webster.com', 100);

INSERT INTO users (id, name, email, balance)
VALUES ('23e3412f-e10d-4ff8-9953-3f805b532782', 'George', 'yobiyis122@sinyago.com', 100);

INSERT INTO users (id, name, email, balance)
VALUES ('78f8ce6f-1940-404e-be23-60b8f77926f5', 'Abraham', 'achid@silnmy.com', 100);

INSERT INTO users (id, name, email, balance)
VALUES ('a69374b6-4b5b-423d-927c-5a4debb6e448', 'Dandelion', 'pi87kvvye@mphaotu.com', 100);
-- END USERS SEED --

-- BEGIN NFTS SEED --
INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    '979134d8-ff87-4062-872f-fe0e204428f6',
    'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.',
    100,
    'static/hedgehog.jpg',
    'a69374b6-4b5b-423d-927c-5a4debb6e448'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    'f1f73544-72fa-482e-9600-72bf937a8a7f',
    'A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.',
    25.20,
    'static/turtle.jpg',
    'a69374b6-4b5b-423d-927c-5a4debb6e448'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    '07fe3003-c585-4ae7-9b36-40b60ef3c9a6',
    'Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.',
    72,
    'static/fox.jpg',
    '78f8ce6f-1940-404e-be23-60b8f77926f5'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    'efd779b5-3179-4997-b00c-2bd64f6df41d',
    'The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli, but the Little Blind Text did not listen',
    20,
    'static/koala.jpg',
    '23e3412f-e10d-4ff8-9953-3f805b532782'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    'b7b4a4e9-0f3f-42ca-b502-4ae0869037a9',
    'A wonderful serenity has taken possession of my entire soul, like these sweet mornings of spring which I enjoy with my whole heart. I am alone, and feel the charm of existence in this spot, which was created for the bliss of souls like mine.',
    110,
    'static/cat.jpg',
    'a3c79f45-ce04-49dc-b0f3-1327d0e0a367'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    'c9e12e57-590e-4f69-9d81-31ffa51a687a',
    'I am so happy, my dear friend, so absorbed in the exquisite sense of mere tranquil existence, that I neglect my talents. I should be incapable of drawing a single stroke at the present moment; and yet I feel that I never was a greater artist than now.',
    62,
    'static/deer_bambi.jpg',
    'a3c79f45-ce04-49dc-b0f3-1327d0e0a367'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    '6bca36e0-604f-41ae-908d-80f88f9287c1',
    'When, while the lovely valley teems with vapour around me, and the meridian sun strikes the upper surface of the impenetrable foliage of my trees, and but a few stray gleams steal into the inner sanctuary, I throw myself down among the tall grass by the trickling stream.',
    82.15,
    'static/dogs.jpg',
    '1134e9e0-02ae-4567-9adf-220ead36a6ef'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    '54885e7e-8a00-4b23-b124-76042037487d',
    'as I lie close to the earth, a thousand unknown plants are noticed by me: when I hear the buzz of the little world among the stalks, and grow familiar with the countless indescribable forms of the insects and flies, then I feel the presence of the Almighty, who formed us in his own image.',
    40.75,
    'static/ducks.jpg',
    '1134e9e0-02ae-4567-9adf-220ead36a6ef'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    'cc8f5527-e35d-402b-8c9a-14cd7b7ec1d5',
    'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim.',
    30,
    'static/panda.jpg',
    '7dd619dd-b997-4351-9541-4d8989c58667'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    '54a797a7-ac28-468d-9f71-7794449eb9f5',
    'Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt.',
    15,
    'static/rabbit.jpg',
    '059ca92f-f505-40d3-9f80-c8822f0c9cdf'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    '6bf53b69-0775-4b4b-962e-333af3ee9270',
    'Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim.',
    39.20,
    'static/raccoon.jpg',
    '059ca92f-f505-40d3-9f80-c8822f0c9cdf'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    '3501a27c-44bd-4ddb-8632-b6f1c8194563',
    'Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus. Phasellus viverra nulla ut metus varius laoreet. Quisque rutrum. Aenean imperdiet.',
    62,
    'static/seal.jpg',
    '492851bb-dead-4c9d-b9f6-271dcf07a8bb'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    'ed62aff6-1bcd-44e0-9434-981cc5b6a4d7',
    'Etiam ultricies nisi vel augue. Curabitur ullamcorper ultricies nisi. Nam eget dui.',
    78.40,
    'static/sloth.jpg',
    'a69374b6-4b5b-423d-927c-5a4debb6e448'
);

INSERT INTO nfts (id, description, price, path, owner_id)
VALUES (
    '637917df-cf94-4a9a-9a07-694310a7247a',
    'Donec vitae sapien ut libero venenatis faucibus. Nullam quis ante. Etiam sit amet orci eget eros faucibus tincidunt. Duis leo. Sed fringilla mauris sit amet nibh. Donec sodales sagittis magna.',
    58.20,
    'static/tiger.jpg',
    '23e3412f-e10d-4ff8-9953-3f805b532782'
);
-- END NFTS SEED --


-- BEGIN USERS_NFTS RELATION TABLE SEED --
INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '637917df-cf94-4a9a-9a07-694310a7247a',
    '23e3412f-e10d-4ff8-9953-3f805b532782'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    'ed62aff6-1bcd-44e0-9434-981cc5b6a4d7',
    'a69374b6-4b5b-423d-927c-5a4debb6e448'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '3501a27c-44bd-4ddb-8632-b6f1c8194563',
    '492851bb-dead-4c9d-b9f6-271dcf07a8bb'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '6bf53b69-0775-4b4b-962e-333af3ee9270',
    '059ca92f-f505-40d3-9f80-c8822f0c9cdf'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '54a797a7-ac28-468d-9f71-7794449eb9f5',
    '059ca92f-f505-40d3-9f80-c8822f0c9cdf'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    'cc8f5527-e35d-402b-8c9a-14cd7b7ec1d5',
    '7dd619dd-b997-4351-9541-4d8989c58667'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '54885e7e-8a00-4b23-b124-76042037487d',
    '1134e9e0-02ae-4567-9adf-220ead36a6ef'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '6bca36e0-604f-41ae-908d-80f88f9287c1',
    '1134e9e0-02ae-4567-9adf-220ead36a6ef'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    'c9e12e57-590e-4f69-9d81-31ffa51a687a',
    'a3c79f45-ce04-49dc-b0f3-1327d0e0a367'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    'b7b4a4e9-0f3f-42ca-b502-4ae0869037a9',
    'a3c79f45-ce04-49dc-b0f3-1327d0e0a367'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    'efd779b5-3179-4997-b00c-2bd64f6df41d',
    '23e3412f-e10d-4ff8-9953-3f805b532782'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '07fe3003-c585-4ae7-9b36-40b60ef3c9a6',
    '78f8ce6f-1940-404e-be23-60b8f77926f5'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    'f1f73544-72fa-482e-9600-72bf937a8a7f',
    'a69374b6-4b5b-423d-927c-5a4debb6e448'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '979134d8-ff87-4062-872f-fe0e204428f6',
    'a69374b6-4b5b-423d-927c-5a4debb6e448'
);

-- CO CREATORS
INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '979134d8-ff87-4062-872f-fe0e204428f6',
    '23e3412f-e10d-4ff8-9953-3f805b532782'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '979134d8-ff87-4062-872f-fe0e204428f6',
    '78f8ce6f-1940-404e-be23-60b8f77926f5'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    '6bf53b69-0775-4b4b-962e-333af3ee9270',
    '492851bb-dead-4c9d-b9f6-271dcf07a8bb'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    'c9e12e57-590e-4f69-9d81-31ffa51a687a',
    '1134e9e0-02ae-4567-9adf-220ead36a6ef'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    'c9e12e57-590e-4f69-9d81-31ffa51a687a',
    '7dd619dd-b997-4351-9541-4d8989c58667'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    'f1f73544-72fa-482e-9600-72bf937a8a7f',
    '492851bb-dead-4c9d-b9f6-271dcf07a8bb'
);

INSERT INTO users_nfts(nft_id, user_id)
VALUES (
    'f1f73544-72fa-482e-9600-72bf937a8a7f',
    '23e3412f-e10d-4ff8-9953-3f805b532782'
);
-- END USERS_NFTS RELATION TABLE SEED --