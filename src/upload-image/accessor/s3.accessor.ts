import { S3 } from "aws-sdk";

export class S3Accessor {

    private client: S3;

    private static readonly BUCKET_NAME = 'peronsal-website-storage';

    constructor() {
        this.client = new S3();
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