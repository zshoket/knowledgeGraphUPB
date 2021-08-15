
var express = require("express");
var router = express.Router();
const driver = require("../neo4j-driver");

// Get all Risk Impacts
router.get("/riskimpacts", async (req, res) => {
    const session = driver.session();
    try {
      const result = await session.run(
        "MATCH (n:RisikoUrsachen) RETURN id(n) as id, n.name as name,  head(labels(n)) as node"
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
  
  // Get Risk Impact by Risk Field Id
  router.get("/riskimpact/:id", async (req, res) => {
    const session = driver.session();
    try {
      const id = req.params.id;
      const result = await session.run(
        `MATCH  (n:Risikofeld)-[]-(d:RisikoUrsachen) where id(n) IN [${id}] return distinct id(d) as id , d.name as name,  head(labels(d)) as node`
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