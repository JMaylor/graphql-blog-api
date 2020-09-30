const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const mongoose = require("mongoose");

const schema = require("./graphql/schema/index");
const rootValue = require("./graphql/resolvers/index");

const port = process.env.PORT || 4000;

// Create an express server and a GraphQL endpoint
const app = express();
app.use(
    "/graphql",
    graphqlHTTP({
        schema,
        rootValue,
        graphiql: true,
    })
);

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.mwipt.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`,
        {
            useNewUrlParser: true,
			useUnifiedTopology: true,
			autoIndex: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
    .then(() => {
        app.listen(port, () => console.log(`listening on port ${port}`));
    })
    .catch((err) => console.log(err));
