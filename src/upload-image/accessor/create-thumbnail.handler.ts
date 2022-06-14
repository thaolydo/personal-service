import 'source-map-support/register';

import { S3Accessor } from "../accessor/s3.accessor";
const sharp = require('sharp');

const s3Accessor = new S3Accessor();

// https://docs.aws.amazon.com/lambda/latest/dg/with-s3-tutorial.html#with-s3-tutorial-configure-event-source
export const handler = async (handlerInput: any) => {
    console.log("CreateThumbnail lambda was invoked by API Gateway with input:", JSON.stringify(handlerInput));

    const record = handlerInput.Records[0];
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, " "));

    // Infer the image type from the file suffix.
    const typeMatch = key.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Could not determine the image type.");
        return;
    }

    // Check that the image type is supported
    const imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "jpeg" && imageType != "png") {
        console.log(`Unsupported image type: ${imageType}`);
        return;
    }

    // Download the image from the S3 source bucket.
    const srcImage = await s3Accessor.getObject(key);

    // set thumbnail width. Resize will set the height automatically to maintain aspect ratio.
    const width = parseInt(process.env.THUMBNAIL_WIDTH);

    // Use the sharp module to resize the image and save in a buffer.
    const buffer = await sharp(srcImage.Body as Buffer).resize(width).toBuffer() as Buffer;

    // Upload the thumbnail image to the destination bucket
    await s3Accessor.putObject(key, buffer);

    console.log(`successfully creating thumbnail for ${key}`);
}