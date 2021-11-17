const Work = require('../../../models/work');
const WorkImage = require('./work-image');

class DeleteWork {
  constructor(workId) {
    this.id = workId;
  }

  async delete() {
    const { id } = this;

    const image = new WorkImage(id);
    image.deleteFS();

    await Work.deleteOne({ _id: id });
  }
}

module.exports = DeleteWork;
