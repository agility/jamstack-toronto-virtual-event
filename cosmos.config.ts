// @ts-check
import crypto from 'crypto';

const cosmosConfig = {
    endpoint: process.env.AZURE_COSMOS_URI,
    key: process.env.AZURE_COSMOS_KEY,
    databaseId: process.env.AZURE_COSMOS_DATABASE_ID,
    containerId: process.env.AZURE_COSMOS_DATABASE_CONTAINER_ID,
    partitionKey: process.env.AZURE_COSMOS_PARTITIONKEY
}


const emailToId = function (email: string) {
    if (process.env.EMAIL_TO_ID_SECRET) {
      const hmac = crypto.createHmac('sha1', process.env.EMAIL_TO_ID_SECRET);
      hmac.update(email);
      const result = hmac.digest('hex');
      return result;
    } else {
      throw new Error('EMAIL_TO_ID_SECRET is missing');
    }
  }

const generateRandomNumber = function() {
  return Array.from(myRandomInts(8, 9)).join('') // {7, 15, 4, 19, 14, 3} -> 715419143
}

const myRandomInts = function(quantity: number, max: number){
  const arr = []
  while(arr.length < quantity) {
    arr.push(Math.floor(Math.random() * max) + 1)
  }
  return arr
}


export {
    cosmosConfig,
    emailToId,
    generateRandomNumber
};