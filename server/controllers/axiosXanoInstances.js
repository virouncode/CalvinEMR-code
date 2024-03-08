var axios = require("axios");

const axiosXanoAdmin = axios.create({
  baseURL: "https://xsjk-1rpe-2jnw.n7c.xano.io/api:oKv2hfrk",
});

const axiosXanoStaff = axios.create({
  baseURL: "https://xsjk-1rpe-2jnw.n7c.xano.io/api:-df3kO6B",
});

const axiosXanoPatient = axios.create({
  baseURL: "https://xsjk-1rpe-2jnw.n7c.xano.io/api:OGgWewIL",
});

const axiosXanoReset = axios.create({
  baseURL: "https://xsjk-1rpe-2jnw.n7c.xano.io/api:Ax6hPdKr",
});

module.exports = {
  axiosXanoAdmin,
  axiosXanoStaff,
  axiosXanoPatient,
  axiosXanoReset,
};
