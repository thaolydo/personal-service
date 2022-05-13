import 'source-map-support/register';
import { CookingPostDao } from '../accessor/cooking-post.dao';
import { CookingPost } from '../model/cooking-post.model';

const cookingPostDao = new CookingPostDao();

export const handler = async (handlerInput: any) => {
    console.log("SaveCookingPost lambda is invoked with handlerInput", handlerInput);

    // Extract info from input
    const cookingPost = JSON.parse(handlerInput.body) as CookingPost;

    await cookingPostDao.saveCookingPost(cookingPost);

    // Build response
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'success',
        }),
    };
    return response;
}