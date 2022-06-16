import 'source-map-support/register';

import { SNSEventRecord } from "aws-lambda";
import { SmsAccessor } from "../accessor/sms.accessor";

const smsAccessor = new SmsAccessor();

// This lambda is not in used currently due to SMS cost too high
// Alarms are notified to emails instead.
export const handler = async (handlerInput: any) => {
    console.log("PersonalServiceAlarm lambda is invoked with handlerInput", JSON.stringify(handlerInput));
    const records: SNSEventRecord[] = handlerInput.Records;
    const sns = records[0].Sns;
    console.log('sns =', JSON.stringify(sns));

    await smsAccessor.init();

    // Send sms to my phone
    const requests = Promise.allSettled([
        smsAccessor.sendSMS('+17142610933', sns.Subject, sns.Message),
        smsAccessor.sendSMS('+19493946149', sns.Subject, sns.Message),
    ]);

    const res = await requests;
    console.log('res =', res);
}