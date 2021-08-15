var neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  process.env.NEO4J_BOLT_URL,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PASSWORD),
  { disableLosslessIntegers: true }
);

module.exports = driver;
