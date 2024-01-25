import axios from "axios";

const base_URL_DPD = "https://dpd-hc-sc-apicast-production.api.canada.ca/v1";
var _ = require("lodash");

const axiosMeds = axios.create({
  baseURL: base_URL_DPD,
});

export const getActiveIngredients = async (drugCode, abortController) => {
  const init = {
    method: "GET",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "user-key": process.env.REACT_APP_MEDS_USER_KEY,
    },
    ...(abortController && { signal: abortController.signal }),
  };
  try {
    const response = await axiosMeds.get(
      `/activeingredient?lang=en&type=json&id=${drugCode}`,
      init
    );
    if (response.status === 200) {
      return response.data[0].ingredient_name;
    } else {
      let errorMsg = "";
      switch (response.status) {
        case 400:
          errorMsg = "400 : bad request, please contact admin";
          break;
        case 404:
          errorMsg = "404 : page not found, please contact admin";
          break;
        default:
          errorMsg = response.status;
      }
      throw new Error(errorMsg);
    }
  } catch (err) {
    if (err.name !== "CanceledError") {
      alert(err);
    }
  }
};

export const getRoute = async (drugCode, abortController) => {
  const init = {
    method: "GET",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "user-key": process.env.REACT_APP_MEDS_USER_KEY,
    },
    ...(abortController && { signal: abortController.signal }),
  };
  try {
    const response = await axiosMeds.get(
      `/route?lang=en&type=json&id=${drugCode}`,
      init
    );
    if (response.status === 200) {
      return response.data[0].route_of_administration_name;
    } else {
      let errorMsg = "";
      switch (response.status) {
        case 400:
          errorMsg = "400 : bad request, please contact admin";
          break;
        case 404:
          errorMsg = "404 : page not found, please contact admin";
          break;
        default:
          errorMsg = response.status;
      }
      throw new Error(errorMsg);
    }
  } catch (err) {
    if (err.name !== "CanceledError") {
      alert(err);
    }
  }
};

export const searchByBrandName = async (brandName, abortController) => {
  const init = {
    method: "GET",
    mode: "cors",
    headers: {
      Accept: "application/json",
      "user-key": process.env.REACT_APP_MEDS_USER_KEY,
    },
    ...(abortController && { signal: abortController.signal }),
  };
  try {
    const response = await axiosMeds.get(
      `/drugproduct?lang=en&type=json&brandname=${brandName}`,
      init
    );
    const uniqData = _.uniqBy(response.data, "drug_code");
    return uniqData;
  } catch (err) {
    if (err.name !== "CanceledError") {
      throw err;
    }
  }
};
