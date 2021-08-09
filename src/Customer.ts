export const MapCustomerDocument = (document: any) =>
{
    return {
        first_name: document["first_name"],
        last_name: document["last_name"],
        email: document["email"],
        gender: document["gender"],
        balance: document["balance"],
        id: document["_id"],
    };
}