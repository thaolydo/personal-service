import 'source-map-support/register';
import { CookingPostDao } from '../accessor/cooking-post.dao';

const cookingPostDao = new CookingPostDao();

export const handler = async (handlerInput: any) => {
    console.log("DeleteCookingPost lambda is invoked with handlerInput", handlerInput);

    // Extract info from input
    const queryParams = handlerInput.queryStringParameters;
    const pid = queryParams.pid;

    let resMessage = 'success';

    try {
        await cookingPostDao.deleteCookingPost(pid);
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