export const showReportTextContent = (report) => {
  const textToShow = report?.Content?.TextContent || "";
  var newWindow = window.open("", "", "width=600,height=400");
  newWindow.document.write(`<!DOCTYPE html>
    <html>
    <head>
      <title>${report.name}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          white-space: pre-wrap;
          padding:0 20px;
        }
      </style>
    </head>
    <body>
      <h3>Report: ${report.name}</h3>
      <p>${textToShow}</p>
    </body>
    </html>`);
};
