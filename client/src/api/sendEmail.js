import emailjs from "@emailjs/browser";

export const sendEmail = async (
  to_email,
  to_name,
  subject,
  intro,
  infos,
  message,
  sign
) => {
  const data = {
    to_email: to_email,
    to_name: to_name,
    subject: subject,
    intro: intro,
    infos: infos,
    message: message,
    sign: sign,
  };

  try {
    const result = await emailjs.send(
      process.env.REACT_APP_EMAILJS_SERVICE_ID,
      process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
      data,
      process.env.REACT_APP_EMAILJS_KEY
    );
    console.log(result.text);
  } catch (err) {
    throw err;
  }
};
