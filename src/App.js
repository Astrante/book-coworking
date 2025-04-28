import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const COWORKING_SPACES = {
    "HAOS Terazije": "Kraljice Natalije, 11",
    "HAOS Artklasa": "Dunavski kej 48",
};

const formatDate = (date) => {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
};

const isSameDay = (date1, date2) => {
    if (!date1 || !date2) return false;
    return (
        date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
    );
};

const OFFICE_EMAIL = "olga.ru96@gmail.com";
const EMAIL_SUBJECT = "Book co-working Belgrade";

export default function App() {
    const [selectionMode, setSelectionMode] = useState("multiple");
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedRange, setSelectedRange] = useState([null, null]);
    const [selectedPlace, setSelectedPlace] = useState("HAOS Terazije");
    const [emailPreview, setEmailPreview] = useState(null);

    const formattedDates = useMemo(() => {
        if (selectionMode === "multiple") {
            return selectedDates
                .sort((a, b) => a - b)
                .map((date) => formatDate(date))
                .join(", ");
        } else {
            const [start, end] = selectedRange;
            if (!start || !end) return "";
            return `${formatDate(start)} - ${formatDate(end)}`;
        }
    }, [selectionMode, selectedDates, selectedRange]);

    const generateEmailData = () => {
        if (selectionMode === "multiple" && !selectedDates.length) {
            alert("Please select at least one date.");
            return null;
        } else if (selectionMode === "range" && (!selectedRange[0] || !selectedRange[1])) {
            alert("Please select a full date range.");
            return null;
        }

        const coworkingName = selectedPlace;
        const coworkingAddress = COWORKING_SPACES[selectedPlace];

        const body = `Hello!\n\nI would like to book a daily pass for ${formattedDates} at the ${coworkingName} coworking space, ${coworkingAddress}.\n\nThank you!`;

        return {
            to: OFFICE_EMAIL,
            subject: EMAIL_SUBJECT,
            body,
        };
    };

    const handlePreview = () => {
        const emailData = generateEmailData();
        if (emailData) {
            setEmailPreview(emailData);
        }
    };

    const handleSendEmail = () => {
        const emailData = generateEmailData();
        if (!emailData) return;

        const { to, subject, body } = emailData;
        const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    const handleMultipleDateSelect = (date) => {
        if (!date) return;

        setSelectedDates((prev) => {
            const dateExists = prev.some((d) => isSameDay(d, date));
            if (dateExists) {
                return prev.filter((d) => !isSameDay(d, date));
            } else {
                return [...prev, date];
            }
        });
    };

    const handleModeChange = () => {
        setSelectionMode((prev) => (prev === "multiple" ? "range" : "multiple"));
        setSelectedDates([]);
        setSelectedRange([null, null]);
        setEmailPreview(null);
    };

    return (
        <div style={{
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            maxWidth: "900px",
            margin: "auto"
        }}>
            <h2>Book Co-Working</h2>

            <div style={{ marginBottom: "15px" }}>
                <label>
                    <input
                        type="checkbox"
                        checked={selectionMode === "range"}
                        onChange={handleModeChange}
                    />{" "}
                    Select a date range
                </label>
            </div>

            {/* New Flex Layout */}
            <div style={{
                display: "flex",
                flexDirection: "row",
                gap: "20px",
                flexWrap: "wrap"
            }}>
                {/* Left column - Calendar */}
                <div style={{
                    flex: "0 0 auto",
                }}>
                    <label>Select Dates:</label><br />
                    {selectionMode === "multiple" ? (
                        <DatePicker
                            selected={null}
                            onChange={handleMultipleDateSelect}
                            highlightDates={selectedDates}
                            inline
                        />
                    ) : (
                        <DatePicker
                            selectsRange
                            startDate={selectedRange[0]}
                            endDate={selectedRange[1]}
                            onChange={(update) => setSelectedRange(update)}
                            inline
                        />
                    )}
                </div>

                {/* Right column - Selection summary and controls */}
                <div style={{
                    flex: "1 1 300px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px"
                }}>
                    {/* Selected Dates/Period Display */}
                    {selectionMode === "multiple" && selectedDates.length > 0 ? (
                        <div style={{
                            padding: "10px",
                            border: "1px solid #eee",
                            borderRadius: "5px"
                        }}>
                            <strong>Selected Dates:</strong>
                            <ul style={{ margin: "10px 0" }}>
                                {selectedDates
                                    .sort((a, b) => a - b)
                                    .map((date, idx) => (
                                        <li key={idx}>{formatDate(date)}</li>
                                    ))}
                            </ul>
                        </div>
                    ) : selectionMode === "range" && selectedRange[0] && selectedRange[1] ? (
                        <div style={{
                            padding: "10px",
                            border: "1px solid #eee",
                            borderRadius: "5px"
                        }}>
                            <strong>Selected Period:</strong><br />
                            <p style={{ margin: "10px 0" }}>
                                {`${formatDate(selectedRange[0])} - ${formatDate(selectedRange[1])}`}
                            </p>
                        </div>
                    ) : (
                        <div style={{
                            padding: "10px",
                            border: "1px solid #eee",
                            borderRadius: "5px",
                            color: "#888"
                        }}>
                            No dates selected yet
                        </div>
                    )}

                    {/* Place Selection */}
                    <div style={{
                        padding: "10px",
                        border: "1px solid #eee",
                        borderRadius: "5px"
                    }}>
                        <label style={{ display: "block", marginBottom: "10px" }}>
                            <strong>Select Place:</strong>
                        </label>
                        <select
                            value={selectedPlace}
                            onChange={(e) => setSelectedPlace(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "8px",
                                borderRadius: "4px",
                                border: "1px solid #ccc"
                            }}
                        >
                            {Object.keys(COWORKING_SPACES).map((place) => (
                                <option key={place} value={place}>
                                    {place}
                                </option>
                            ))}
                        </select>
                        <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
                            Address: {COWORKING_SPACES[selectedPlace]}
                        </p>
                    </div>

                    {/* Buttons */}
                    <div style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "10px"
                    }}>
                        <button
                            onClick={handlePreview}
                            style={{
                                padding: "10px 20px",
                                flex: "1",
                                backgroundColor: "#f0f0f0",
                                border: "1px solid #ccc",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Preview Email
                        </button>
                        <button
                            onClick={handleSendEmail}
                            style={{
                                padding: "10px 20px",
                                flex: "1",
                                backgroundColor: "#4CAF50",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer"
                            }}
                        >
                            Generate Email
                        </button>
                    </div>
                </div>
            </div>

            {/* Email Preview - Full Width */}
            {emailPreview && (
                <div style={{
                    marginTop: "20px",
                    border: "1px solid #ccc",
                    padding: "15px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9"
                }}>
                    <h3>Email Preview:</h3>
                    <p><strong>To:</strong> {emailPreview.to}</p>
                    <p><strong>Subject:</strong> {emailPreview.subject}</p>
                    <p><strong>Body:</strong></p>
                    <pre style={{
                        whiteSpace: "pre-wrap",
                        padding: "10px",
                        backgroundColor: "white",
                        border: "1px solid #ddd",
                        borderRadius: "4px"
                    }}>
            {emailPreview.body}
          </pre>
                </div>
            )}
        </div>
    );
}