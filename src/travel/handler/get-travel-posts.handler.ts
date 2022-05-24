import 'source-map-support/register';
import { TravelPostDao } from '../accessor/travel-post.dao';

const travelPostDao = new TravelPostDao();

export const handler = async (handlerInput: any) => {
    console.log("GetTravelPosts lambda is invoked with handlerInput", handlerInput);

    const gettingSinglePost = handlerInput.routeKey == 'GET /travel/{pid}';
    let res;
    if (gettingSinglePost) {
        const pid = handlerInput.pathParameters.pid;
        const travelPost = await travelPostDao.getTravelPost(pid);
        res = { travelPost };
    } else {
        const travelPosts = await travelPostDao.getTravelPosts();
        res = { travelPosts };
    }

    // Build response
    const response = {
        statusCode: 200,
        body: JSON.stringify(res),
    };
    return response;
}