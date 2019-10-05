const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const mongoose  =  require('mongoose');
const dotenv = require('dotenv').config();
const chalk = require('chalk');
const debug = require('debug')('app');

const graphQlSchema = require('./graphql/schema/');
const graphQlResolvers = require('./graphql/resolvers/');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use('/graphql',
  graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);


const MONGO_USER = process.env.MONGO_USER;
const MONGO_PASSWORD = process.env.MONGO_PASSWORD;
const MONGO_DB = process.env.MONGO_DB;
const port = process.env.PORT || 3000;

mongoose.connect(`mongodb+srv://${
  MONGO_USER
}:${MONGO_PASSWORD}@cluster0-vuyon.mongodb.net/${MONGO_DB}?retryWrites=true&w=majority`
).then(() => {
  app.listen(port, () => {
    debug(`listening on port ${chalk.green(port)}`);
  });
}).catch(err => {
  console.log(err);
})


