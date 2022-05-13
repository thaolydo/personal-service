import 'source-map-support/register';
import { TravelPostDao } from '../accessor/travel-post.dao';

const travelPostDao = new TravelPostDao();

export const handler = async (handlerInput: any) => {
    console.log("GetTravelPosts lambda is invoked with handlerInput", handlerInput);

    const travelPosts = await travelPostDao.getTravelPosts();

    // Build response
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            travelPosts,
        }),
    };
    return response;
}