/* tslint:disable:no-console */
import 'dotenv/config';
import {IgApiClient} from 'instagram-private-api';
import {environment} from './environments/env';

(async () => {
  const ig = new IgApiClient();
  console.log(environment);
  ig.state.generateDevice(process.env.IG_USERNAME);
  ig.state.proxyUrl = process.env.IG_PROXY;
  await ig.simulate.preLoginFlow();
  const auth = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
  const followersFeed = ig.feed.accountFollowers(auth.pk);
  const wholeResponse = await followersFeed.request();
  console.log(wholeResponse); // You can reach any properties in instagram response
  const items = await followersFeed.items();
  console.log(items); // Here you can reach items. It's array.
  const thirdPageItems = await followersFeed.items();
  // Feed is stateful and auto-paginated. Every subsequent request returns results from next page
  console.log(thirdPageItems); // Here you can reach items. It's array.
  const feedState = followersFeed.serialize(); // You can serialize feed state to have an ability to continue get next pages.
  console.log(feedState);
  followersFeed.deserialize(feedState);
  const fourthPageItems = await followersFeed.items();
  console.log(fourthPageItems);
  // You can use RxJS stream to subscribe to all results in this feed.
  // All the RxJS powerful is beyond this example - you should learn it by yourself.
  followersFeed.items$.subscribe(
    followers => console.log(followers),
    error => console.error(error),
    () => console.log('Complete!'),
  );
})();

// import { sample } from 'lodash';
// const ig = new IgApiClient();
// // You must generate device id's before login.
// // Id's generated based on seed
// // So if you pass the same value as first argument - the same id's are generated every time
// ig.state.generateDevice(process.env.IG_USERNAME);
// // Optionally you can setup proxy url
// ig.state.proxyUrl = process.env.IG_PROXY;
// (async () => {
//   // Execute all requests prior to authorization in the real Android application
//   // Not required but recommended
//   await ig.simulate.preLoginFlow();
//   const loggedInUser = await ig.account.login(process.env.IG_USERNAME, process.env.IG_PASSWORD);
//   // The same as preLoginFlow()
//   // Optionally wrap it to process.nextTick so we dont need to wait ending of this bunch of requests
//   process.nextTick(async () => await ig.simulate.postLoginFlow());
//   // Create UserFeed instance to get loggedInUser's posts
//   const userFeed = ig.feed.user(loggedInUser.pk);
//   const myPostsFirstPage = await userFeed.items();
//   // All the feeds are auto-paginated, so you just need to call .items() sequentially to get next page
//   const myPostsSecondPage = await userFeed.items();
//   await ig.media.like({
//     // Like our first post from first page or first post from second page randomly
//     mediaId: sample([myPostsFirstPage[0].id, myPostsSecondPage[0].id]),
//     moduleInfo: {
//       module_name: 'profile',
//       user_id: loggedInUser.pk,
//       username: loggedInUser.username,
//     },
//     d: sample([0, 1]),
//   });
// })();
