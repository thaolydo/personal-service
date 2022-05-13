import 'source-map-support/register';
import { CookingPostDao } from '../accessor/cooking-post.dao';

const cookingPostDao = new CookingPostDao();

export const handler = async (handlerInput: any) => {
    console.log("GetCookingPosts lambda is invoked with handlerInput", handlerInput);

    const cookingPosts = await cookingPostDao.getCookingPosts();

    // Build response
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            cookingPosts,
        }),
    };
    return response;
}