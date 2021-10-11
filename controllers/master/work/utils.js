const Work = require("../../../models/work/work");

const onError = async () => await Work.deleteOne({ _id });

module.exports = { onError };
