import React, { useState, useEffect } from 'react';
import './index.css'; // Import your global CSS

function App() {
    // Initialize date fields with current date
    const today = new Date().toISOString().slice(0, 10);

    const [formData, setFormData] = useState({
        to: '',
        ro_no: '',
        date: today, // Default to current date for (date)
        no: '',
        particulars: '',
        date2: today, // Default to current date for (date2)
        size: '',
        rate: '',
        page: '',
        template: '1' // Default template selection
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission and document generation
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3001/generate-document', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                try {
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.error || 'Failed to generate document');
                } catch (parseError) {
                    // If response isn't JSON, use the raw text
                    throw new Error(errorText || 'Failed to generate document (Unknown error)');
                }
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'generated-document.docx';
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url); // Clean up the URL object

            alert('Document generated and downloaded successfully!');

        } catch (err) {
            console.error('Error:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-wrapper">
            <div className="space-y-8">
                
                <h1 className="form-title">
                    Mehul News Agency
                    <br />
                    Advertisement Release Order
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="section-card">
                        <h2 className="section-title">Recipient Details</h2>
                        <div className="grid-container md-cols-2">
                            <div>
                                <label htmlFor="to" className="form-label">
                                    To:
                                </label>
                                <input
                                    type="text"
                                    id="to"
                                    name="to"
                                    value={formData.to}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Recipient Name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="ro_no" className="form-label">
                                    R.O. No.:
                                </label>
                                <input
                                    type="text"
                                    id="ro_no"
                                    name="ro_no"
                                    value={formData.ro_no}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="R.O. Number"
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="date" className="form-label">
                                Date: (Header)
                            </label>
                            <input
                                type="date"
                                id="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="form-input"
                                required
                            />
                        </div>
                    </div>

                    <div className="section-card">
                        <h2 className="section-title">
                            Advertisement Instruction Details
                        </h2>
                        <div className="grid-container md-cols-2 lg-cols-3">
                            <div>
                                <label htmlFor="no" className="form-label">
                                    No.:
                                </label>
                                <input
                                    type="text"
                                    id="no"
                                    name="no"
                                    value={formData.no}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Instruction No."
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="particulars" className="form-label">
                                    Particulars:
                                </label>
                                <input
                                    type="text"
                                    id="particulars"
                                    name="particulars"
                                    value={formData.particulars}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Advertisement Particulars"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="date2" className="form-label">
                                    Date: (Instruction)
                                </label>
                                <input
                                    type="date"
                                    id="date2"
                                    name="date2"
                                    value={formData.date2}
                                    onChange={handleChange}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="size" className="form-label">
                                    Size:
                                </label>
                                <input
                                    type="text"
                                    id="size"
                                    name="size"
                                    value={formData.size}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Size"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="rate" className="form-label">
                                    Rate:
                                </label>
                                <input
                                    type="number"
                                    id="rate"
                                    name="rate"
                                    value={formData.rate}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Rate"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="page" className="form-label">
                                    Page:
                                </label>
                                <input
                                    type="text"
                                    id="page"
                                    name="page"
                                    value={formData.page}
                                    onChange={handleChange}
                                    className="form-input"
                                    placeholder="Page"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="section-card">
                        <h2 className="section-title">Select Template</h2>
                        <div>
                            <label>
                                <input
                                    type="radio"
                                    name="template"
                                    value="1"
                                    checked={formData.template === '1'}
                                    onChange={handleChange}
                                />
                                Template 1
                            </label>
                            <label style={{ marginLeft: '20px' }}>
                                <input
                                    type="radio"
                                    name="template"
                                    value="2"
                                    checked={formData.template === '2'}
                                    onChange={handleChange}
                                />
                                Template 2
                            </label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >
                        {loading ? 'Generating...' : 'Generate and Download DOCX'}
                    </button>
                </form>

                {error && (
                    <div className="error-alert" role="alert">
                        <strong>Error!</strong>
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;