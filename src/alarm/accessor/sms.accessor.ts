import { SNS, STS } from "aws-sdk";
import { PublishInput, PublishResponse } from "aws-sdk/clients/sns";
import { AssumeRoleRequest } from "aws-sdk/clients/sts";

export class SmsAccessor {

    private client: SNS;

    constructor() {
        // this.client = new SNS();
    }

    async init() {
        if (this.client) {
            return;
        }

        console.log('Initializing sns client');

        const sts = new STS();
        const assumeRoleRequest: AssumeRoleRequest = {
            RoleArn: 'arn:aws:iam::096328248765:role/ly-personal-service-send-sms-role',
            RoleSessionName: 'send-sms',
        }
        const stsRes = await sts.assumeRole(assumeRoleRequest).promise();
        const credentials = stsRes.Credentials;

        this.client = new SNS({
            region: 'us-east-1',
            credentials: {
                accessKeyId: credentials.AccessKeyId,
                secretAccessKey: credentials.SecretAccessKey,
                expireTime: credentials.Expiration,
                sessionToken: credentials.SessionToken
            }
        });
    }

    sendSMS(phone: string, subject: string, message: string): Promise<PublishResponse> {
        console.log(`Sending SMS to phone '${phone} with subject '${subject}'`);
        const params: PublishInput = {
            Subject: subject,
            Message: message,
            PhoneNumber: phone
        }
        return this.client.publish(params).promise();
    }
}