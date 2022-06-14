import 'source-map-support/register';
import { S3Accessor } from '../../upload-image/accessor/s3.accessor';
import { TravelPostDao } from '../accessor/travel-post.dao';

const travelPostDao = new TravelPostDao();
const s3Accessor = new S3Accessor();

export const handler = async (handlerInput: any) => {
    console.log("DeleteTravelPost lambda is invoked with handlerInput", handlerInput);

    // Extract info from input
    const queryParams = handlerInput.queryStringParameters;
    const pid = queryParams.pid;

    let resMessage = 'success';

    const promises = [] as any[];

    // Remove the images in S3
    const travelPost = await travelPostDao.getTravelPost(pid);
    const key = `travel/${pid}.${travelPost.imageUrl.split('.').pop()}`;
    promises.push(s3Accessor.deleteObject(key));

    // Remove from DDB
    promises.push(travelPostDao.deleteTravelPost(pid));

    try {
        const res = await Promise.allSettled(promises);
        for (const result of res) {
            if (result.status != 'rejected') {
                continue;
            }
            const reason = (result.reason as Object).toString();
            console.error('rejected reason: ', reason);
        }
    } catch (e) {
        console.error(e);
        if ((e as any).code === 'ConditionalCheckFailedException') {
            resMessage = `pid '${pid}' doesn't exist`;
        }
    }

    // Build response
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: resMessage,
        }),
    };
    return response;
}