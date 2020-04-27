const graphql = require('graphql');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLBoolean,
} = graphql;

const LaunchType = new GraphQLObjectType({
  name: 'Launch',
  fields: () => ({
    flight_number: { type: GraphQLInt },
    mission_name: { type: GraphQLString },
    launch_year: { type: GraphQLString },
    launch_date_local: { type: GraphQLString },
    launch_success: { type: GraphQLBoolean },
    rocket: { type: RocketType },
  }),
});

const RocketType = new GraphQLObjectType({
  name: 'Rocket',
  fields: () => ({
    rocket_id: { type: GraphQLString },
    rocket_name: { type: GraphQLString },
    rocket_type: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    launch: {
      type: LaunchType,
      args: { flight_number: { type: GraphQLInt } },
      resolve(parent, args) {
        return axios
          .get('https://api.spacexdata.com/v3/launches/' + args.flight_number)
          .then((res) => res.data);
      },
    },
    launches: {
      type: new GraphQLList(LaunchType),
      resolve(parent, args) {
        return axios
          .get('https://api.spacexdata.com/v3/launches')
          .then((res) => res.data);
      },
    },
    rocket: {
      type: RocketType,
      args: { rocket_id: { type: GraphQLString } },
      resolve(parent, args) {
        return axios
          .get('https://api.spacexdata.com/v3/rockets/' + args.rocket_id)
          .then((res) => res.data);
      },
    },
    rockets: {
      type: new GraphQLList(RocketType),
      resolve(parent, args) {
        return axios
          .get('https://api.spacexdata.com/v3/rockets')
          .then((res) => res.data);
      },
    },
  },
});

// const Mutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: {
//     addAuthor: {
//       type: AuthorType,
//       args: {
//         name: { type: new GraphQLNonNull(GraphQLString) },
//         age: { type: new GraphQLNonNull(GraphQLInt) },
//       },
//       resolve(parent, args) {
//         let author = new Author({
//           name: args.name,
//           age: args.age,
//         });
//         return author.save();
//       },
//     },
//     addBook: {
//       type: BookType,
//       args: {
//         name: { type: new GraphQLNonNull(GraphQLString) },
//         genre: { type: new GraphQLNonNull(GraphQLString) },
//         authorId: { type: new GraphQLNonNull(GraphQLID) },
//       },
//       resolve(parent, args) {
//         let book = new Book({
//           name: args.name,
//           genre: args.genre,
//           authorId: args.authorId,
//         });
//         return book.save();
//       },
//     },
//   },
// });

module.exports = new GraphQLSchema({
  query: RootQuery,
  //   mutation: Mutation,
});
