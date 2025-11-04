import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "funrobin"

if (!uri) {
  throw new Error("MONGODB_URI is not set. Add it to your environment variables.")
}

declare global {
  // eslint-disable-next-line no-var
  var __FUNROBIN_MONGO_PROMISE__: Promise<MongoClient> | undefined
  // eslint-disable-next-line no-var
  var __FUNROBIN_MONGO_CLIENT__: MongoClient | undefined
}

const clientPromise = (() => {
  if (!globalThis.__FUNROBIN_MONGO_PROMISE__) {
    const mongoClient = new MongoClient(uri)
    globalThis.__FUNROBIN_MONGO_PROMISE__ = mongoClient.connect().then((client) => {
      globalThis.__FUNROBIN_MONGO_CLIENT__ = client
      return client
    })
  }
  return globalThis.__FUNROBIN_MONGO_PROMISE__
})()

async function connect(): Promise<Db> {
  const client = await clientPromise
  return client.db(dbName)
}

export async function getDb(): Promise<Db> {
  return connect()
}

export async function colUsers() {
  return (await getDb()).collection("users")
}

export async function colSubs() {
  return (await getDb()).collection("subscriptions")
}

export async function colSymbols() {
  return (await getDb()).collection("symbols")
}

export async function colSnapshots() {
  return (await getDb()).collection("snapshots")
}

export async function colTrades() {
  return (await getDb()).collection("trades")
}

export async function colAutofill() {
  return (await getDb()).collection("autofill_payloads")
}

export async function colClicks() {
  return (await getDb()).collection("clicks")
}

export default clientPromise
