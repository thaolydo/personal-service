import { DynamoDB } from "aws-sdk";
import { Converter, DeleteItemInput, PutItemInput, ScanInput } from "aws-sdk/clients/dynamodb";
import { CookingPost } from "../model/cooking-post.model";

export class CookingPostDao {

    private client: DynamoDB;

    private TABLE_NAME = 'CookingPost';

    constructor() {
        this.client = new DynamoDB({
            params: {
                TableName: this.TABLE_NAME
            }
        });
    }

    saveCookingPost(cookingPost: CookingPost) {
        console.log('Saving cooking post', cookingPost);
        const params: PutItemInput = {
            Item: Converter.marshall(cookingPost),
            TableName: this.TABLE_NAME
        };

        return this.client.putItem(params).promise();
    }

    async getCookingPosts() {
        console.log('Getting cooking posts');
        const params: ScanInput = {
            TableName: this.TABLE_NAME
        };

        const res = await this.client.scan(params).promise();
        return Promise.resolve(res.Items?.map(item => Converter.unmarshall(item)));
    }

    deleteCookingPost(pid: string) {
        console.log('Deleting cooking post for pid', pid);
        const params: DeleteItemInput = {
            Key: Converter.marshall({pid}),
            ConditionExpression: 'attribute_exists(pid)',
            TableName: this.TABLE_NAME
        }
        return this.client.deleteItem(params).promise();
    }
}