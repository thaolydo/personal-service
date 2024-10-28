import 'source-map-support/register';

import { S3Accessor } from "../accessor/s3.accessor";

const s3Accessor = new S3Accessor();

export const handler = async (handlerInput: any) => {
    console.log("GetWeddingUrls lambda was invoked by API Gateway with input:", JSON.stringify(handlerInput.queryStringParameters));

    const data = await s3Accessor.getWeddingUrls();
    const objects = data.Contents || [];

    // Sort objects by LastModified date in descending order (latest first)
    // for (const obj of objects) {
    //     console.log('ts =', obj.LastModified!.getTime(), obj.LastModified!);
    // }
    objects.sort((a, b) => b.LastModified!.getTime() - a.LastModified!.getTime());
    // for (const obj of objects) {
    //     console.log('ts2 =', obj.LastModified!.getTime(), obj.LastModified!);
    // }

    return {
        statusCode: 200,
        body: JSON.stringify({
            objects,
        }),
    };
}
