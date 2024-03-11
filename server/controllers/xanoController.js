const {
  axiosXanoAdmin,
  axiosXanoStaff,
  axiosXanoPatient,
  axiosXanoReset,
} = require("./axiosXanoInstances");

const getAxiosInstance = (userType) => {
  switch (userType) {
    case "admin":
      return axiosXanoAdmin;
    case "staff":
      return axiosXanoStaff;
    case "patient":
      return axiosXanoPatient;
    case "reset":
      return axiosXanoReset;
    default:
      throw new Error("Type d'utilisateur non valide");
  }
};
//Dans la request => req.body: datas à poster-puter
//                => req.params: exemple www.api.com/5  (on va le mettre directement dans l'url donc pas besoin de le récupérer)
//                => req.query : exemple www.api.com?name="John" (!!!! pour axios c'est les params)

const getXano = async (req, res) => {
  try {
    const { url, userType, abortController, params } = req.query;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "get",
      url,
      headers,
    };
    if (params) config.params = params;
    if (abortController) {
      config.signal = abortController.signal;
    }
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    console.log(response);
    if (typeof response.data === "number") {
      res.status(response.status).send(response.data.toString());
    } else {
      res.status(response.status).send(response.data);
    }
  } catch (err) {
    res.status(err.response?.status).send(err);
  }
};

const postXano = async (req, res) => {
  try {
    const { url, userType, abortController } = req.query;
    const datasToPost = req.body;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "post",
      url,
      headers,
      data: datasToPost,
    };
    if (abortController) {
      config.signal = abortController.signal;
    }
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    if (typeof response.data === "number") {
      res.status(response.status).send(response.data.toString());
    } else {
      res.status(response.status).send(response.data);
    }
  } catch (err) {
    console.log(err.message);
    res.status(err.response?.status).send(err);
  }
};
const putXano = async (req, res) => {
  try {
    const { url, userType, abortController } = req.query;
    const datasToPut = req.body;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };
    const config = {
      method: "put",
      url,
      headers,
      data: datasToPut,
    };
    if (abortController) {
      config.signal = abortController.signal;
    }
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    if (typeof response.data === "number") {
      res.status(response.status).send(response.data.toString());
    } else {
      res.status(response.status).send(response.data);
    }
  } catch (err) {
    console.log(err);
    res.status(err.response?.status).send(err);
  }
};

const deleteXano = async (req, res) => {
  try {
    const { url, userType, abortController } = req.query;
    const authToken = req.cookies.token;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    };

    const config = {
      method: "delete",
      url,
      headers,
    };
    if (abortController) {
      config.signal = abortController.signal;
    }
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    res.status(response.status).send(response.data);
  } catch (err) {
    console.log(err);
    res.status(err.response?.status).send(err);
  }
};

const authXano = async (req, res) => {
  try {
    const { url, userType } = req.query;
    const datasToPost = req.body;
    let headers = {
      "Content-Type": "application/json",
    };
    const config = {
      method: "post",
      url,
      headers,
      data: datasToPost,
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    res.cookie("token", response.data.authToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
    });
    res.status(response.status).send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log(err.message);
    res.status(err.response?.status).send(err);
  }
};

const resetXano = async (req, res) => {
  try {
    const { url, userType, tempToken } = req.query;
    const datasToPost = req.body;
    let headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tempToken}`,
    };
    const config = {
      method: "post",
      url,
      headers,
      data: datasToPost,
    };
    const axiosXanoInstance = getAxiosInstance(userType);
    const response = await axiosXanoInstance(config);
    res.status(response.status).send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log(err.message);
    res.status(err.response?.status).send(err);
  }
};

module.exports = {
  getXano,
  postXano,
  putXano,
  deleteXano,
  authXano,
  resetXano,
};
