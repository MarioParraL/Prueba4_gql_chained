import { ObjectId, OptionalId } from "mongodb";

export type PilotoModel = OptionalId<{
  name: string;
  phone: string;
  aviones: ObjectId[];
  city: string;
}>;
export type AvionModel = OptionalId<{
  modelo: string;
  year: number;
}>;

export type Piloto = {
  id: string;
  name: string;
  aviones: Avion[];
  airport: string;
};

export type Avion = {
  id: string;
  modelo: string;
  year: number;
};

export type APIAirport = {
  name: string;
};
