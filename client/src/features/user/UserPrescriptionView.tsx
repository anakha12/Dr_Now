// UserPrescriptionView.tsx
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import type { Prescription } from "../../types/booking";

const UserPrescriptionView = () => {
  const location = useLocation();
  const { prescription, patientName, department } = location.state || {};

  const prescriptionRef = useRef<HTMLDivElement>(null);

  if (!prescription) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-800 text-lg">
        No prescription available
      </div>
    );
  }

  const downloadPDF = async () => {
    if (!prescriptionRef.current) return;

    try {
      const canvas = await html2canvas(prescriptionRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff", // PDF-safe background
        allowTaint: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Prescription_${patientName || "Patient"}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const clinicColor = "#0d9488"; // PDF-safe teal

  return (
    <div className="max-w-3xl mx-auto my-10 px-4">
      {/* Prescription Container */}
      <div
        ref={prescriptionRef}
        style={{
          backgroundColor: "#ffffff", // PDF-safe
          color: "#000000",           // PDF-safe
        }}
        className="p-6 rounded-xl border border-gray-300"
      >
        {/* Header */}
        <div
          className="flex justify-between"
          style={{ borderBottom: "1px solid #d1d5db", paddingBottom: 16, marginBottom: 24 }}
        >
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
              Dr. {prescription.doctorName || "Doctor"}
            </h1>
            <p style={{ fontSize: "0.875rem" }}>{department || "N/A"}</p>
          </div>
          <div style={{ textAlign: "right", fontSize: "0.875rem" }}>
            <p>
              Date: {prescription.date ? format(new Date(prescription.date), "yyyy-MM-dd HH:mm") : "N/A"}
            </p>
            
          </div>
        </div>

        {/* Prescription ID */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: "0.875rem" }}>
            Prescription ID: <span style={{ fontFamily: "monospace" }}>{prescription._id || "N/A"}</span>
          </p>
        </div>

        {/* Medicines Table */}
        <div style={{ marginBottom: 24 }}>
          <h2
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              borderBottom: "1px solid #e5e7eb",
              paddingBottom: 4,
              marginBottom: 8,
            }}
          >
            Medicines
          </h2>
          <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed", border: "1px solid #e5e7eb" }}>
            <thead style={{ backgroundColor: "#f3f4f6" }}>
              <tr>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb", textAlign: "left", width: "20%" }}>Medicine</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb", textAlign: "left", width: "15%" }}>Dose</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb", textAlign: "left", width: "20%" }}>Frequency</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb", textAlign: "left", width: "15%" }}>Duration</th>
                <th style={{ padding: 8, borderBottom: "1px solid #e5e7eb", textAlign: "left", width: "30%" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medicines?.map((med: Prescription["medicines"][0], idx: number) => (
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
            <h2 style={{ fontSize: "1.125rem", fontWeight: 600, borderBottom: "1px solid #e5e7eb", paddingBottom: 4, marginBottom: 4 }}>
              Notes
            </h2>
            <p>{prescription.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #d1d5db", paddingTop: 24 }}>
          <div>
            <p style={{ color: clinicColor, fontSize: "0.875rem" }}>DrNow Clinic</p>
          </div>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: 600 }}>Dr. {prescription.doctorName || "Doctor"}</p>
            <p style={{ fontSize: "0.875rem" }}>Signature</p>
          </div>
        </div>
      </div>

      {/* Download PDF Button */}
      <div className="text-center mt-8">
        <button
          onClick={downloadPDF}
          style={{
            backgroundColor: clinicColor,
            color: "#ffffff",
            padding: "0.5rem 1.5rem",
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

export default UserPrescriptionView;