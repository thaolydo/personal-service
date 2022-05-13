import { DynamoDB } from "aws-sdk";
import { Converter, DeleteItemInput, PutItemInput, ScanInput } from "aws-sdk/clients/dynamodb";
import { TravelPost } from "../model/travel-post.model";

export class TravelPostDao {

    private client: DynamoDB;

    private TABLE_NAME = 'TravelPost';

    constructor() {
        this.client = new DynamoDB({
            params: {
                TableName: this.TABLE_NAME
            }
        });
    }

    saveTravelPost(travelPost: TravelPost) {
        console.log('Saving travel post', travelPost);
        const params: PutItemInput = {
            Item: Converter.marshall(travelPost),
            TableName: this.TABLE_NAME
        };

        return this.client.putItem(params).promise();
    }

    async getTravelPosts() {
        console.log('Getting travel posts');
        const params: ScanInput = {
            TableName: this.TABLE_NAME
        };

        const res = await this.client.scan(params).promise();
        return Promise.resolve(res.Items?.map(item => Converter.unmarshall(item)));
    }

    deleteTravelPost(pid: string) {
        console.log('Deleting travel post for pid', pid);
        const params: DeleteItemInput = {
            Key: Converter.marshall({pid}),
            ConditionExpression: 'attribute_exists(pid)',
            TableName: this.TABLE_NAME
        }
        return this.client.deleteItem(params).promise();
    }
}