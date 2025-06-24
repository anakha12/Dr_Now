const DoctorRejected = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-700 mb-6">
          Your request has been <strong>rejected by the admin</strong>. You cannot log in at this time.
        </p>
        <p className="text-gray-500 text-sm">
          Please contact support for more details or try again later.
        </p>
      </div>
    </div>
  );
};

export default DoctorRejected;
