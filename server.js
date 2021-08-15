require("dotenv").config();
const express = require("express");
const activeSumRoutes = require("./routes/activeSum.route");
const activitiesRoutes = require("./routes/activities.route");
const dimensionRoutes = require("./routes/dimension.route");
const optionForActionRoutes = require("./routes/optionForAction.route");
const passiveSumRoutes = require("./routes/passiveSum.route");
const relationshipRoutes = require("./routes/relationship.route");
const riskFieldRoutes = require("./routes/riskField.route");
const riskImpactsRoutes = require("./routes/riskImpacts.route");
const riskTypeRoutes = require("./routes/riskType.route");
const specifiRisksRoutes = require("./routes/specifiRisks.route");
const useCasesRoutes = require("./routes/useCases.route");

const app = express();
const port = process.env.port || 5000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(activeSumRoutes);
app.use(activitiesRoutes);
app.use(dimensionRoutes);
app.use(optionForActionRoutes);
app.use(passiveSumRoutes);
app.use(relationshipRoutes);
app.use(riskFieldRoutes);
app.use(riskImpactsRoutes);
app.use(riskTypeRoutes);
app.use(specifiRisksRoutes);
app.use(useCasesRoutes);

app.listen(port, () => {
  console.log(`Server is running in port ${port}`);
});
