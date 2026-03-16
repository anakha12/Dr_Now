import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Prescription } from "../../types/booking"; // adjust the path

interface LocationState {
  prescription: Prescription;
  patientName: string;
  department: string;
}

const PrescriptionView = () => {
  const location = useLocation();
  const { prescription, patientName, department } = location.state as LocationState;

  const prescriptionRef = useRef<HTMLDivElement>(null);

  if (!prescription) {
    return (
      <div style={{ padding: "1rem", textAlign: "center", color: "#000000" }}>
        No prescription available
      </div>
    );
  }

  const downloadPDF = async () => {
    if (!prescriptionRef.current) return;

    const canvas = await html2canvas(prescriptionRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Prescription_${patientName}.pdf`);
  };

  const safeClinicColor = "#0d9488"; // teal

  return (
    <div style={{ maxWidth: 800, margin: "2.5rem auto" }}>
      <div
        ref={prescriptionRef}
        style={{
          padding: "1.5rem",
          backgroundColor: "#ffffff",
          borderRadius: 16,
          border: "1px solid #d1d5db",
          color: "#000000",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "1px solid #d1d5db",
            paddingBottom: 16,
            marginBottom: 24,
          }}
        >
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700 }}>Dr. {prescription.doctorName}</h1>
            <p style={{ fontSize: 14 }}>{department}</p>
          </div>
          <div style={{ textAlign: "right", fontSize: 14 }}>
            <p>Date: {format(new Date(prescription.date), "yyyy-MM-dd HH:mm")}</p>
            <p>Patient: {patientName}</p>
          </div>
        </div>

        {/* Prescription ID / Registration Number */}
        {prescription.registrationNumber && (
          <div style={{ marginBottom: 24 }}>
            <p style={{ fontSize: 14 }}>
              Registration No: <span style={{ fontFamily: "monospace" }}>{prescription.registrationNumber}</span>
            </p>
          </div>
        )}

        {/* Medicines Table */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: 18,
              fontWeight: 600,
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Medicines
          </h2>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #e5e7eb",
              tableLayout: "fixed",
            }}
          >
            <thead style={{ backgroundColor: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb", width: "20%", textAlign: "left" }}>Medicine</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb", width: "15%", textAlign: "left" }}>Dose</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb", width: "20%", textAlign: "left" }}>Frequency</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb", width: "15%", textAlign: "left" }}>Duration</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb", width: "30%", textAlign: "left" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medicines.map((med, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f9fafb" : "#ffffff" }}>
                  <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb", wordWrap: "break-word" }}>{med.name || "-"}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb", wordWrap: "break-word" }}>{med.dose || "-"}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb", wordWrap: "break-word" }}>{med.frequency || "-"}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb", wordWrap: "break-word" }}>{med.duration || "-"}</td>
                  <td style={{ padding: 8, borderBottom: "1px solid #e5e7eb", wordWrap: "break-word" }}>{med.notes || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Notes */}
        {prescription.notes && (
          <div style={{ marginBottom: 24 }}>
            <h2
              style={{
                fontSize: 18,
                fontWeight: 600,
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: 4,
                marginBottom: 4,
              }}
            >
              Notes
            </h2>
            <p>{prescription.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderTop: "1px solid #d1d5db",
            paddingTop: 24,
          }}
        >
          <div>
            <p style={{ fontSize: 14, color: safeClinicColor }}>DrNow Clinic</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 600 }}>Dr. {prescription.doctorName}</p>
            <p style={{ fontSize: 14 }}>Signature</p>
          </div>
        </div>
      </div>

      {/* Download PDF Button */}
      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button
          onClick={downloadPDF}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: safeClinicColor,
            color: "#ffffff",
            borderRadius: 8,
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
          }}
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PrescriptionView;