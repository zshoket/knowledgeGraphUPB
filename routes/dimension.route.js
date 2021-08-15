var express = require("express");
var router = express.Router();
const driver = require("../neo4j-driver");

// Get all dimensions
router.get("/dimensions", async (req, res) => {
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (n:Dimension) RETURN id(n) as id, n.name as name, head(labels(n)) as node"
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
  
  // Get dimension by risk id
  router.get("/dimension/:id", async (req, res) => {
    const session = driver.session();
    try {
      const id = req.params.id;
      const result = await session.run(
        `MATCH  (n:RiskType)-[]-(d:Dimension) where id(n)=${id} return distinct id(d) as id , d.name as name, head(labels(d)) as node`
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

  module.exports=router;