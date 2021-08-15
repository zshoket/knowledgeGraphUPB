
var express = require("express");
var router = express.Router();
const driver = require("../neo4j-driver");

// Get All RiskTypes
router.get("/risktypes", async (req, res) => {
  const session = driver.session();
  try {
    const result = await session.run(
      "MATCH (n:RiskType) return id(n) as id , n.name as name, head(labels(n)) as node ORDER BY n.name"
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

// Get Risk Type by Risk Id
router.get("/risktype/:id", async (req, res) => {
  const session = driver.session();
  try {
    const id = req.params.id;
    const result = await session.run(
      `MATCH (n:RiskType) where id(n)=${id} return id(n) as id , n.name as name, head(labels(n)) as node`
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
    console.log(e);
    res.status(500).send(e);
  } finally {
    session.close();
  }
});


//Create Risk Type
router.post("/risktype", async (req, res) => {
  const session = driver.session();
  try {
    const riskType = req.body.riskType;
    const dimensionId = req.body.dimensionId;
    const dimenstionRelations = req.body.dimenstionRelations;
    const activeSum = req.body.activeSum;
    const passiveSum = req.body.passiveSum;
    const riskFields = req.body.riskFields;
    const specificRisk = req.body.specificRisk;
    const specificRiskRelations = req.body.specificRiskRelations;

    //Check if Risk Type already exists
    const query_checkIfExists = `MATCH (n:RiskType) where toLower(n.name)='${riskType.toLowerCase()}' return n`;
    const result_exists = await session.run(query_checkIfExists);
    if (result_exists.records.length) {
      return res.status(400).json({ error: "Risk type already exists" });
    } else {
      const txc = session.beginTransaction();
      //Create Risk type
      const query_create_risktype = `CREATE (n:RiskType {name: '${riskType}'}) return id(n) as id`;
      const result_create_risktype = await txc.run(query_create_risktype);

      const risk_id = result_create_risktype.records.map((record) =>
        record.get("id")
      )[0];

      //Create relationship Risk Type <-> Dimension
      dimenstionRelations.forEach(async (relation) => {
        if (relation.value.toLowerCase() === "has") {
          const query_merge_dimension_has = `MATCH (n:RiskType) , (m:Dimension) where n.name='${riskType}' and id(m)=${dimensionId} merge (n)<-[r:has]-(m)`;
          await txc.run(query_merge_dimension_has);
        }
        if (relation.value.toLowerCase() === "belongs_to") {
          const query_merge_dimension_belongsTo = `MATCH (n:RiskType) , (m:Dimension) where n.name='${riskType}' and id(m)=${dimensionId} merge (n)-[r:Belongs_To]->(m)`;
          await txc.run(query_merge_dimension_belongsTo);
        }
      });

      //Create or merge active sum
      const query_checkIfActiveSumExists = `MATCH (n:ActiveSum) where n.value='${activeSum}' return n`;
      const result_activesum_exists = await txc.run(
        query_checkIfActiveSumExists
      );

      if (!result_activesum_exists.records.length) {
        //Create active sum
        const query_create_active_sum = `CREATE (n:ActiveSum {value: '${activeSum}'}) return id(n) as id`;
        await txc.run(query_create_active_sum);
      }

      //Link with Active Sum
      const query_active_sum = `MATCH (n:RiskType) , (m:ActiveSum) where n.name='${riskType}' and m.value='${activeSum}' merge (n)-[r:contains]->(m)`;
      await txc.run(query_active_sum);

      //Create or merge passive sum

      const query_checkIfPassiveSumExists = `MATCH (n:PassiveSum) where n.value='${passiveSum}' return n`;
      const result_passiveSum_exists = await txc.run(
        query_checkIfPassiveSumExists
      );

      if (!result_passiveSum_exists.records.length) {
        //Create passive sum
        const query_create_passive_sum = `CREATE (n:PassiveSum {value: '${passiveSum}'}) return id(n) as id`;
        await txc.run(query_create_passive_sum);
      }

      const query_passive_sum = `MATCH (n:RiskType) , (m:PassiveSum) where n.name='${riskType}' and m.value='${passiveSum}' merge (n)-[r:contains]->(m)`;
      await txc.run(query_passive_sum);

      //Create or merge Specific Risk

      if(specificRisk){
        const query_checkIfSpecificRisk = `MATCH (n:SpezifischeRisiken) where n.name='${specificRisk}' return id(n) as id`;
        const result_specificRisk_exists = await txc.run(
          query_checkIfSpecificRisk
        );
        var specificRiskId;
  
        if (!result_specificRisk_exists.records.length) {
          //Create active sum
          const query_create_specificRisk = `CREATE (n:SpezifischeRisiken {name: '${specificRisk}'}) return id(n) as id`;
          const result_create_specific_risk = await txc.run(
            query_create_specificRisk
          );
          specificRiskId = result_create_specific_risk.records.map((record) =>
            record.get("id")
          )[0];
        } else {
          specificRiskId = result_specificRisk_exists.records.map((record) =>
            record.get("id")
          )[0];
        }
  
        //Create Links for Specific Risk
  
        specificRiskRelations.forEach(async (relation) => {
          if (relation.value.toLowerCase() === "has") {
            const query_merge_specificRisk_has = `MATCH (n:RiskType) , (m:SpezifischeRisiken) where n.name='${riskType}' and id(m)=${specificRiskId} merge (n)<-[r:has]-(m)`;
            await txc.run(query_merge_specificRisk_has);
          }
          if (relation.value.toLowerCase() === "belongs_to") {
            const query_merge_specificRisk_belongsTo = `MATCH (n:RiskType) , (m:SpezifischeRisiken) where n.name='${riskType}' and id(m)=${specificRiskId} merge (n)-[r:Belongs_To]->(m)`;
            await txc.run(query_merge_specificRisk_belongsTo);
          }
        });
      }
      

      //Create relationship Risk Type <-> Risk Field

      riskFields.forEach(async (item) => {
        const riskFieldId = item.riskField.value;
        const relations = item.relation;
        relations.forEach(async (relation) => {
          if (relation.value.toLowerCase() === "has") {
            const query_merge_riskfield_has = `MATCH (n:RiskType) , (m:Risikofeld) where n.name='${riskType}' and id(m)=${riskFieldId} merge (n)-[r:has]->(m)`;
            await txc.run(query_merge_riskfield_has);
          }
          if (relation.value.toLowerCase() === "belongs_to") {
            const query_merge_riskfield_belongsTo = `MATCH (n:RiskType) , (m:Risikofeld) where n.name='${riskType}' and id(m)=${riskFieldId} merge (n)<-[r:Belongs_To]-(m)`;
            await txc.run(query_merge_riskfield_belongsTo);
          }
        });
      });

      await txc.commit();

      res.json({ data: risk_id });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  } finally {
    session.close();
  }
});

module.exports = router;
