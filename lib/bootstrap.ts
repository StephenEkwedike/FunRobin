import { getDb } from "@/lib/mongo"

let indexesEnsured = false

export async function ensureIndexes() {
  if (indexesEnsured) return

  const database = await getDb()

  await Promise.all([
    database.collection("users").createIndex({ email: 1 }, { unique: true }),
    database.collection("users").createIndex({ usernameLower: 1 }, { unique: true, sparse: true }),
    database.collection("symbols").createIndex({ symbol: 1 }, { unique: true }),
    database.collection("snapshots").createIndex({ symbol: 1 }, { unique: true }),
    database.collection("trades").createIndex({ userId: 1 }),
    database.collection("trades").createIndex({ status: 1, closedAt: -1 }),
    database.collection("trades").createIndex({ openedAt: -1 }),
    database.collection("autofill_payloads").createIndex({ code: 1 }, { unique: true }),
  ])

  const ttlSeconds = Number(process.env.AUTOFILL_CODE_TTL_SEC ?? 180)
  const ttl = Number.isFinite(ttlSeconds) ? ttlSeconds : 180

  await database
    .collection("autofill_payloads")
    .createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl })

  indexesEnsured = true
}
