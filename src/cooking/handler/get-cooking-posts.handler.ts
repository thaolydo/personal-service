import 'source-map-support/register';
import { CookingPostDao } from '../accessor/cooking-post.dao';

const cookingPostDao = new CookingPostDao();

export const handler = async (handlerInput: any) => {
    console.log("GetCookingPosts lambda is invoked with handlerInput", handlerInput);

    const gettingSinglePost = handlerInput.routeKey == 'GET /cooking/{pid}';
    let res;
    if (gettingSinglePost) {
        const pid = handlerInput.pathParameters.pid;
        const cookingPost = await cookingPostDao.getCookingPost(pid);
        res = { cookingPost };
    } else {
        const cookingPosts = await cookingPostDao.getCookingPosts();
        res = { cookingPosts };
    }

    // Build response
    const response = {
        statusCode: 200,
        body: JSON.stringify(res),
    };
    return response;
}