import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { gql } from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import mongoose from "mongoose";

// Connect to MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/historical_events";
mongoose.connect(MONGODB_URI);

// Define MongoDB Schema
const CommentSchema = new mongoose.Schema({
  text: String,
  author: String,
  createdAt: { type: Date, default: Date.now },
  layer: Number,
  parentCommentId: mongoose.Schema.Types.ObjectId,
});

const EventSchema = new mongoose.Schema({
  date: Date,
  year: Number,
  location: {
    type: { type: String, enum: ["region", "country", "city"] },
    name: String,
  },
  title: String,
  text: String,
  pictures: [String],
  videos: [String],
  links: [String],
  comments: [CommentSchema],
});

const Event = mongoose.models.Event || mongoose.model("Event", EventSchema);

// Define GraphQL Schema
const typeDefs = gql`
  type Comment {
    id: ID!
    text: String!
    author: String!
    createdAt: String!
    layer: Int!
    parentCommentId: ID
  }

  type Location {
    type: String!
    name: String!
  }

  type Event {
    id: ID!
    date: String!
    year: Int!
    location: Location!
    title: String!
    text: String!
    pictures: [String!]!
    videos: [String!]!
    links: [String!]!
    comments: [Comment!]!
  }

  type Query {
    events(date: String, year: Int, location: String): [Event!]!
    event(id: ID!): Event
  }

  type Mutation {
    createEvent(
      date: String!
      year: Int!
      locationType: String!
      locationName: String!
      title: String!
      text: String!
      pictures: [String!]
      videos: [String!]
      links: [String!]
    ): Event!
    addComment(
      eventId: ID!
      text: String!
      author: String!
      layer: Int!
      parentCommentId: ID
    ): Comment!
  }
`;

// Define Resolvers
const resolvers = {
  Query: {
    events: async (
      _: any,
      {
        date,
        year,
        location,
      }: { date?: string; year?: number; location?: string }
    ) => {
      let query: any = {};
      if (date) query.date = new Date(date);
      if (year) query.year = year;
      if (location) query["location.name"] = location;
      return await Event.find(query);
    },
    event: async (_: any, { id }: { id: string }) => {
      return await Event.findById(id);
    },
  },
  Mutation: {
    createEvent: async (_: any, args: any) => {
      const event = new Event({
        date: new Date(args.date),
        year: args.year,
        location: {
          type: args.locationType,
          name: args.locationName,
        },
        title: args.title,
        text: args.text,
        pictures: args.pictures || [],
        videos: args.videos || [],
        links: args.links || [],
      });
      await event.save();
      return event;
    },
    addComment: async (
      _: any,
      {
        eventId,
        text,
        author,
        layer,
        parentCommentId,
      }: {
        eventId: string;
        text: string;
        author: string;
        layer: number;
        parentCommentId?: string;
      }
    ) => {
      const event = await Event.findById(eventId);
      if (!event) throw new Error("Event not found");

      const comment = {
        text,
        author,
        layer,
        parentCommentId: parentCommentId
          ? new mongoose.Types.ObjectId(parentCommentId)
          : null,
      };

      event.comments.push(comment);
      await event.save();
      return comment;
    },
  },
};

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Apollo Server
const server = new ApolloServer({ schema });

// Export the handler
export default startServerAndCreateNextHandler(server);
