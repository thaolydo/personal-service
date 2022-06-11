import 'source-map-support/register';

import { S3Accessor } from "../accessor/s3.accessor";

const s3Accessor = new S3Accessor();

export const handler = async (handlerInput: any) => {
    console.log("UploadImage lambda was invoked by API Gateway with input:", JSON.stringify(handlerInput.queryStringParameters));

    // Extract info
    const queryParams = handlerInput.queryStringParameters;
    const fileName = queryParams.fileName;
    const imageType = queryParams.imageType;
    const data = handlerInput.body;
    const base64Data = Buffer.from(data, 'base64');
    const filePath = queryParams.postType;

    const res = await s3Accessor.uploadFile(filePath, fileName, imageType, base64Data);

    return {
        statusCode: 200,
        body: JSON.stringify({
            imageUrl: res.Location,
        }),
    };
}