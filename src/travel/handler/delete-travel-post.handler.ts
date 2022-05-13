import 'source-map-support/register';
import { TravelPostDao } from '../accessor/travel-post.dao';

const travelPostDao = new TravelPostDao();

export const handler = async (handlerInput: any) => {
    console.log("DeleteTravelPost lambda is invoked with handlerInput", handlerInput);

    // Extract info from input
    const queryParams = handlerInput.queryStringParameters;
    const pid = queryParams.pid;

    let resMessage = 'success';

    try {
        await travelPostDao.deleteTravelPost(pid);
    } catch (e) {
        console.error(e);
        if ((e as any).code === 'ConditionalCheckFailedException') {
            resMessage = `pid '${pid}' doesn't exist`;
        }
    }

    // Build response
    const response = {
        statusCode: 404,
        body: JSON.stringify({
            message: resMessage,
        }),
    };
    return response;
}