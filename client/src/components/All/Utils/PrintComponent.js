import { useRef } from "react";

const PrintComponent = ({ content }) => {
  const printContent = useRef();

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Window</title>
          <style>
            ${getComputedStyle(printContent.current).cssText}
          </style>
        </head>
        <body>
          ${content}
          <script>
            window.onload = function() {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
};
export default PrintComponent;
