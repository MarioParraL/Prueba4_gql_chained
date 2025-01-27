import { Collection } from "mongodb";
import { AvionModel, PilotoModel } from "./types.ts";
import { ObjectId } from "mongodb";
import { GraphQLError } from "graphql";
import { APIAirport } from "./types.ts";

type Context = {
  PilotosCollection: Collection<PilotoModel>;
  AvionesCollection: Collection<AvionModel>;
};

type QueryGetPilotoArgs = {
  id: string;
};

type QueryGetAvionArgs = {
  id: string;
};

type MutationAddPilotoArgs = {
  name: string;
  phone: string;
  aviones: string[];
  city: string;
};

type MutationAddAvionArgs = {
  modelo: string;
  year: number;
};

type MutationDeletePilotoArgs = {
  id: string;
};

type MutationDeleteAvionArgs = {
  id: string;
};

export const resolvers = {
  Query: {
    getPilotos: async (
      _: unknown,
      __: unknown,
      ctx: Context,
    ): Promise<PilotoModel[]> => {
      return await ctx.PilotosCollection.find().toArray();
    },

    getPiloto: async (
      _: unknown,
      args: QueryGetPilotoArgs,
      ctx: Context,
    ): Promise<PilotoModel | null> => {
      return await ctx.PilotosCollection.findOne({
        _id: new ObjectId(args.id),
      });
    },

    getAviones: async (
      _: unknown,
      __: unknown,
      ctx: Context,
    ): Promise<AvionModel[]> => {
      return await ctx.AvionesCollection.find().toArray();
    },

    getAvion: async (
      _: unknown,
      args: QueryGetAvionArgs,
      ctx: Context,
    ): Promise<AvionModel | null> => {
      return await ctx.AvionesCollection.findOne({
        _id: new ObjectId(args.id),
      });
    },
  },

  Mutation: {
    addPiloto: async (
      _: unknown,
      args: MutationAddPilotoArgs,
      ctx: Context,
    ): Promise<PilotoModel> => {
      const { name, phone, aviones, city } = args;

      const existePiloto = await ctx.PilotosCollection.findOne({ phone });
      if (existePiloto) throw new GraphQLError("Piloto ya existe");

      const { insertedId } = await ctx.PilotosCollection.insertOne({
        name,
        phone,
        aviones: aviones.map((a) => new ObjectId(a)),
        city,
      });

      return {
        _id: insertedId,
        name,
        phone,
        aviones: aviones.map((a) => new ObjectId(a)),
        city,
      };
    },

    addAvion: async (
      _: unknown,
      args: MutationAddAvionArgs,
      ctx: Context,
    ): Promise<AvionModel> => {
      const { modelo, year } = args;

      const { insertedId } = await ctx.AvionesCollection.insertOne({
        modelo,
        year,
      });

      return {
        _id: insertedId,
        modelo,
        year,
      };
    },

    deletePiloto: async (
      _: unknown,
      args: MutationDeletePilotoArgs,
      ctx: Context,
    ): Promise<boolean> => {
      const { deletedCount } = await ctx.PilotosCollection.deleteOne({
        _id: new ObjectId(args.id),
      });
      return deletedCount === 1;
    },

    deleteAvion: async (
      _: unknown,
      args: MutationDeleteAvionArgs,
      ctx: Context,
    ): Promise<boolean> => {
      const { deletedCount } = await ctx.AvionesCollection.deleteOne({
        _id: new ObjectId(args.id),
      });
      return deletedCount === 1;
    },
  },

  Piloto: {
    id: (parent: PilotoModel) => {
      return parent._id!.toString();
    },

    aviones: async (parent: PilotoModel, _: unknown, ctx: Context) => {
      const ids = parent.aviones;
      return await ctx.AvionesCollection.find({ _id: { $in: ids } }).toArray();
    },

    airport: async (
      parent: PilotoModel,
      _: unknown,
      ctx: Context,
    ): Promise<string> => {
      const API_KEY = Deno.env.get("API_KEY");
      if (!API_KEY) throw new GraphQLError("Need an API NINJAS API_KEY");

      const city = parent.city;
      const url = `https://api.api-ninjas.com/v1/airports?city=${city}`;

      const data = await fetch(url, {
        headers: {
          "X-API-KEY": API_KEY,
        },
      });

      if (data.status !== 200) throw new GraphQLError("API_KEY ERROR");

      const response: APIAirport[] = await data.json();
      return response[0].name;
    },
  },

  Avion: {
    id: (parent: AvionModel) => {
      return parent._id!.toString();
    },
  },
};
