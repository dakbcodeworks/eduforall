import { MongoClient, ServerApiVersion, Db } from 'mongodb';

const uri = process.env.MONGODB_URI; // Your MongoDB connection string from .env.local

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the client is not recreated on every hot-reload
  // @ts-expect-error - MongoDB types are not properly exported from mongodb package
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
    // @ts-expect-error - MongoDB types are not properly exported from mongodb package
    global._mongoClientPromise = client.connect();
  }
  // @ts-expect-error - MongoDB types are not properly exported from mongodb package
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// @ts-expect-error - MongoDB types are not properly exported from mongodb package
export const db: Db = client.db(process.env.MONGODB_DB); 