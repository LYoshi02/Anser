const bucket = require("../firebaseStorage");

module.exports.deleteBucketFile = async (prefix) => {
  await bucket.deleteFiles({
    force: true,
    prefix,
  });
};
