const { BulkOperationBase } = require('mongodb/lib/bulk/common');

BulkOperationBase.prototype.update = function (find, update) {
  this.find(find).update({ $set: update });
};

BulkOperationBase.prototype.aggregationUpdate = function (find, update) {
  this.find(find).update(update);
};
