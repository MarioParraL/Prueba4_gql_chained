export const schema = `#graphql

    type Piloto{
        id: ID!
        name: String!
        phone: String!
        aviones: [Avion!]!
        airport: String!
    }

    type Avion{
        id: ID!
        modelo: String!
        year: Int!
    }

    type Query{
        getPilotos: [Piloto!]!
        getPiloto(id: ID!): Piloto!
        getAviones: [Avion!]!
        getAvion(id: ID!): Avion!
    }

    type Mutation{
        addPiloto(name: String!, phone: String!, aviones: [ID!]!, city: String!): Piloto!
        deletePiloto(id: ID!): Boolean!
        updatePiloto(id: ID!, name: String, phone: String, aviones: [ID!], city: String): Piloto!

        addAvion(modelo: String!, year: Int!): Avion!
        deleteAvion(id:ID!): Boolean!
        updateAvion(id: ID!, modelo: String, year: Int): Avion!
    }





`;
