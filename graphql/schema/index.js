const { buildSchema } = require("graphql");

// GraphQL schema
// '!' in schema means non-nullable
const schema = buildSchema(`
	type Post {
		_id: ID!
		title: String!
		description: String!
		content: String!
		author: User!
	}

	type User {
		_id: ID!
		email: String!
		password: String
		createdPosts: [Post!]
	}

	input PostInput {
		title: String!
		description: String!
		content: String!
	}

	input UserInput {
		email: String!
		password: String!
	}

    type RootQuery {
		posts: [Post!]!
	}
	
	type RootMutation {
		createPost(postInput: PostInput): Post
		createUser(userInput: UserInput): User
	}

	schema {
		query: RootQuery
		mutation: RootMutation
	}
`);

module.exports = schema;