module.exports = {
  index(req, res) {
    res.render("roles/index", { req });
  },
  add(req, res) {
    res.render("roles/add");
  },
  async handleAdd(req, res) {},
};
