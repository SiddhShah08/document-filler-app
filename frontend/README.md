This project is a web application for generating customized Word documents based on user input. It consists of a React frontend and an Express backend.

-->The frontend provides a form for users to enter advertisement release order details, including recipient information and advertisement instructions.

-->Users can select between two document templates (Template 1 or Template 2) that have the same fields but different headings.

->Upon form submission, the frontend sends the data along with the selected template choice to the backend.
The backend uses the docxtemplater library to fill the selected Word template (.docx) with the provided data and generates a downloadable document.

-->The backend supports two templates stored as form-template1.docx and form-template2.docx, allowing dynamic selection based on user input.

-->This setup enables users to easily generate formatted Word documents with different heading styles without changing the data fields.

