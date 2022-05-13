import 'source-map-support/register';

export const handler = async (handlerInput: any) => {
    console.log("SaveTravelPost lambda is invoked with handlerInput", handlerInput);

    // Build response
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: 'success',
        }),
    };
    return response;
}