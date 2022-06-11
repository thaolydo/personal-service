import { S3 } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";

export class S3Accessor {

    private client: S3;

    private static readonly BUCKET_NAME = 'peronsal-website-storage';

    constructor() {
        this.client = new S3();
    }

    async uploadFile(filePath: string, fileName: string, imageType: string, data: Buffer) {
        console.log(`Uploading file with filePath '${filePath}' fileName '${fileName}', imageType '${imageType}'`);
        const params: PutObjectRequest = {
            Bucket: S3Accessor.BUCKET_NAME,
            Key: `${filePath}/${fileName}`,
            Body: data,
            ACL: 'public-read',
            ContentEncoding: 'base64',
            ContentType: `image/${imageType}`
        };
        return this.client.upload(params).promise();
    }
}