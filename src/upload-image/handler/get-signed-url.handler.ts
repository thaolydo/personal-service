import 'source-map-support/register';

import { S3Accessor } from "../accessor/s3.accessor";

const s3Accessor = new S3Accessor();

export const handler = async (handlerInput: any) => {
    console.log("GetSignedUrl lambda was invoked by API Gateway with input:", JSON.stringify(handlerInput.queryStringParameters));

    // Extract info
    const queryParams = handlerInput.queryStringParameters;
    const fileName = queryParams.fileName;
    const contentType = queryParams.contentType;
    const filePath = queryParams.filePath;

    // const res = await s3Accessor.getSignedUrl(filePath, fileName, contentType);
    const customFields = {
        "Content-Type": contentType
    };
    const res = await s3Accessor.getSignedPostUrl(filePath, fileName, customFields);

    return {
        statusCode: 200,
        body: JSON.stringify({
            ...res
        }),
    };
}