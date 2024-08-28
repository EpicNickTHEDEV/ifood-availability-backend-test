import { createSchema, createYoga } from 'graphql-yoga'

// Mock data
const products = [
  { _id: "p1", name: "Banner Supermarca" },
  { _id: "p2", name: "Banner Carrosel" },
  { _id: "p3", name: "Banner" },
];

const locations = [
  { _id: "l1", name: "Home" },
  { _id: "l2", name: "Subhomes" },
  { _id: "l3", name: "Promoções" },
];

const verticals = [
  { _id: "v1", name: "Mercado" },
  { _id: "v2", name: "Bebidas" },
  { _id: "v3", name: "Farmácia" },
];

const availabilityItems = [
  { _id: "DISP-1000", product: "p1", location: "l1", vertical: "v1", quantity: 5, startDate: "2024-07-01", endDate: "2024-07-07" },
  { _id: "DISP-1001", product: "p2", location: "l2", vertical: "v2", quantity: 3, startDate: "2024-08-20", endDate: "2024-08-30" },
  { _id: "DISP-1002", product: "p3", location: "l3", vertical: "v3", quantity: 2, startDate: "2024-07-01", endDate: "2024-07-10" },
  { _id: "DISP-1003", product: "p1", location: "l1", vertical: "v1", quantity: 4, startDate: "2024-08-16", endDate: "2024-08-30" },
  { _id: "DISP-1004", product: "p2", location: "l2", vertical: "v2", quantity: 3, startDate: "2024-07-01", endDate: "2024-07-15" },
];

const yoga = createYoga({
  schema: createSchema({
    typeDefs: `
      type Query {
        availabilityItems: [AvailabilityItem!]!
        products: [Product!]!
        locations: [Location!]!
        verticals: [Vertical!]!
      }

      type AvailabilityItem {
        _id: ID!
        product: Product!
        location: Location!
        vertical: Vertical!
        quantity: Int!
        startDate: String!
        endDate: String!
      }

      type Product {
        _id: ID!
        name: String!
      }

      type Location {
        _id: ID!
        name: String!
      }

      type Vertical {
        _id: ID!
        name: String!
      }
    `,
    resolvers: {
      Query: {
        availabilityItems: () => availabilityItems,
        products: () => products,
        locations: () => locations,
        verticals: () => verticals,
      },
      AvailabilityItem: {
        product: (parent) => products.find(p => p._id === parent.product),
        location: (parent) => locations.find(l => l._id === parent.location),
        vertical: (parent) => verticals.find(v => v._id === parent.vertical),
      }
    }
  })
})

const server = Bun.serve({
  fetch: yoga
})

console.info(
  `Server is running on ${new URL(
    yoga.graphqlEndpoint,
    `http://${server.hostname}:${server.port}`
  )}`
)