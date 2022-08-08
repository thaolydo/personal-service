import 'source-map-support/register';
import { S3Accessor } from '../../upload-image/accessor/s3.accessor';
import { CookingPostDao } from '../accessor/cooking-post.dao';

const cookingPostDao = new CookingPostDao();
const s3Accessor = new S3Accessor();

const BLOCK_LIST_PIDS = new Set(['crawfish-', 'bb', 'ceviche', 'hi', 'wonton']);

export const handler = async (handlerInput: any) => {
    console.log("DeleteCookingPost lambda is invoked with handlerInput", handlerInput);

    // Extract info from input
    const queryParams = handlerInput.queryStringParameters;
    const pid = queryParams.pid;

    let resMessage = 'success';

    const promises = [] as any[];

    // Skip deleting initial pics
    if (BLOCK_LIST_PIDS.has(pid)) {
        return {
            statusCode: 403,
            body: JSON.stringify({
                message: 'Unable to delete this post',
            }),
        }
    }

    // Remove the images in S3
    const cookingPost = await cookingPostDao.getCookingPost(pid);
    if (cookingPost.imageUrl) {
        const key = `cooking/${pid}.${cookingPost.imageUrl.split('.').pop()}`;
        promises.push(s3Accessor.deleteObject(key));
    }

    // Remove from DDB
    promises.push(cookingPostDao.deleteCookingPost(pid));

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