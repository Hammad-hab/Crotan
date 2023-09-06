const cluster = require("cluster")
const { Exception } = require("../exceptionUtility");
const os = require("os");
const { pid } = require("process");
const { enable, disable, PR_EN_EXTENSIONS } = require("./enable");

const PREPROCESSORZ = {
    enable,
    disable,
    parserlog: (value="") => {
        if (!value) new Exception(0, `Error at @parserlog preprocessor. Cannot log NULL`).throw()
        value = value.replaceAll("-", " ")
        console.log(value)
    },
    multithread(value) {
        if (typeof value === "string") value = parseInt(value)
        const MAX_CPUS = os.cpus().length
        if (MAX_CPUS < 3) {
            return new Exception(
                0,
                `Your CPU doesn't support multithreading optomisation as it only has ${MAX_CPUS} cores. To use multithreading you need at least 3.`
              ).throw();
        }
        if (cluster.isPrimary) {
            if (value > MAX_CPUS - 1) {
                return new Exception(
                    0,
                    `Amount of CPU cores to utlise is too great. Using ${value} cores when your CPU has only ${MAX_CPUS} is risky.`
                  ).throw();
            } else {
                cluster.fork()
            }
        } 
    },
}
module.exports = {
    PREPROCESSORZ,
    PR_EN_EXTENSIONS
}