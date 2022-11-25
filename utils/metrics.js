const express = require("express");
const promClient = require("prom-client");
const processlog = require("./processlog");

const app = express();

module.exports.restResponseTimeHistogram = new promClient.Histogram({
    name: "rest_response_time_duration_seconds",
    help: "REST API response time in seconds",
    labelNames: ["method", "route", "status_code"],
});

module.exports.databaseResponseTimeHistogram = new promClient.Histogram({
    name: "db_response_time_duration_seconds",
    help: "Database response time in seconds",
    labelNames: ["operation", "success"],
});

module.exports.startMetricsServer = function () {
    const collectDefaultMetrics = promClient.collectDefaultMetrics;

    collectDefaultMetrics();
    //TODO: make array of ips from env var and check req ip against them return nothing for ip not in list

    app.get("/metrics", async (req, res) => {
        res.set("Content-Type", promClient.register.contentType);
        return res.send(await promClient.register.metrics());
    });

    app.listen(process.env.METRICS_PORT, () => {
        processlog.info(`Metrics server started on port ${process.env.METRICS_PORT} will accept connections from ${process.env.METRICS_ALLOWED_IPS}`);
    });
}