import 'source-map-support/register';
import { TravelPostDao } from '../accessor/travel-post.dao';
import { TravelPost } from '../model/travel-post.model';

const travelPostDao = new TravelPostDao();

export const handler = async (handlerInput: any) => {
    console.log("SaveTravelPost lambda is invoked with handlerInput", handlerInput);

    // Extract info from input
    const travelPost = JSON.parse(handlerInput.body) as TravelPost;

    await travelPostDao.saveTravelPost(travelPost);

    // Build response
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'success',
        }),
    };
    return response;
}