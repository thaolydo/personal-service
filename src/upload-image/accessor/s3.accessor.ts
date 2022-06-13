import { S3 } from "aws-sdk";
import { PutObjectRequest } from "aws-sdk/clients/s3";

export class S3Accessor {

    private client: S3;

    private static readonly BUCKET_NAME = 'peronsal-website-storage';

    constructor() {
        this.client = new S3();
    }

    // Deprecating in favor of getSignedUrl flow
    uploadFile(filePath: string, fileName: string, imageType: string, data: Buffer) {
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

    // https://aws.amazon.com/blogs/compute/uploading-to-amazon-s3-directly-from-a-web-or-mobile-application
    async getSignedUrl(filePath: string, fileName: string, contentType: string) {
        console.log(`Getting signed url with filePath '${filePath}' fileName '${fileName}', contentType '${contentType}'`);
        const key = `${filePath}/${fileName}`;
        const params: any = {
            Bucket: S3Accessor.BUCKET_NAME,
            Key: key,
            Expires: 30, // in seconds
            ContentType: contentType,
            ACL: 'public-read',
        };
        const signedUrl = await this.client.getSignedUrlPromise('putObject', params);
        return {
            key,
            signedUrl
        };
    }
}