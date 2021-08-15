
var express = require("express");
var router = express.Router();
const driver = require("../neo4j-driver");

// Get all Use Cases
router.get("/usecases", async (req, res) => {
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (n:UseCase) RETURN id(n) as id, n.name as name, head(labels(n)) as node, n.dimension as dimension"
      );
      const data = result.records.map((item) => {
        return {
          id: item.get("id"),
          name: item.get("name"),
          node: item.get("node"),
          dimension: item.get("dimension"),
        };
      });
      res.send(data);
    } catch (e) {
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });
  
  // Get UseCase by Risk Id
  router.get("/usecase/:id", async (req, res) => {
    const session = driver.session();
    try {
      const id = req.params.id;
      const result = await session.run(
        `MATCH  (n:Risikofeld)-[]-(d:UseCase) where id(n) IN [${id}] return distinct id(d) as id , d.name as name,  head(labels(d)) as node, d.dimension as dimension`
      );
      const data = result.records.map((item) => {
        return {
          id: item.get("id"),
          name: item.get("name"),
          node: item.get("node"),
          dimension: item.get("dimension"),
        };
      });
      res.send(data);
    } catch (e) {
      res.status(500).send(e);
    } finally {
      session.close();
    }
  });

  module.exports = router;