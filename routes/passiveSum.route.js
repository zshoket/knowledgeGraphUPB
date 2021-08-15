var express = require("express");
var router = express.Router();
const driver = require("../neo4j-driver");

// Get all PassiveSum
router.get("/passivesums", async (req, res) => {
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (n:PassiveSum) RETURN id(n) as id, n.value as name,  head(labels(n)) as node"
      );
      const data = result.records.map((item) => {
        return {
          id: item.get("id"),
          name: item.get("name"),
          node: item.get("node"),
        };
      });
      res.send(data);
    } catch (e) {
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });
  
  // Get PassiveSum by Risk Id
  router.get("/passivesum/:id", async (req, res) => {
    const session = driver.session();
    try {
      const id = req.params.id;
      const result = await session.run(
        `MATCH  (n:RiskType)-[]-(d:PassiveSum) where id(n)=${id} return distinct id(d) as id , d.value as name, head(labels(d)) as node`
      );
      const data = result.records.map((item) => {
        return {
          id: item.get("id"),
          name: item.get("name"),
          node: item.get("node"),
        };
      });
      res.send(data);
    } catch (e) {
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });

  module.exports=router