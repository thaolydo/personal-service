import { S3 } from "aws-sdk";
import { PresignedPost } from "aws-sdk/clients/s3";

export class S3Accessor {

    private client: S3;

    private static readonly BUCKET_NAME = 'peronsal-website-storage';

    constructor() {
        this.client = new S3();
    }

    // Deprecated in favor of getSignedPostUrl() below
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

    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_presigned_post.html
    async getSignedPostUrl(filePath: string, fileName: string, contentType: string): Promise<any> {
        console.log(`Getting signed post url with filePath '${filePath}' fileName '${fileName}', contentType '${contentType}'`);
        const key = `${filePath}/${fileName}`;
        const params: PresignedPost.Params = {
            Bucket: S3Accessor.BUCKET_NAME,
            Fields: {
                key,
                "Content-Type": contentType
            },
            Conditions: [
                ['content-length-range', 0, 10_000_000], // 10MB
                { acl: 'public-read' },
            ],
            Expires: 30, // in seconds
        };

        return new Promise((resolve, reject) => {
            this.client.createPresignedPost(params, (err, data) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(data);
            });

        });
    }
}