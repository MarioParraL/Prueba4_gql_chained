import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import { MongoClient } from "mongodb";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const env = await load();
const MONGO_URL = env.MONGO_URL || Deno.env.get("MONGO_URL");
if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();
console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("Prueba4DB");
const PilotosCollection = mongoDB.collection("pilotos");
const AvionesCollection = mongoDB.collection("aviones");
