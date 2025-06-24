const DoctorWaitingVerification = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md bg-white p-8 rounded-2xl shadow-xl text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-700">
          Your account is currently under review. You will be able to access your dashboard once the admin verifies your details.
        </p>
        <p className="mt-4 text-sm text-gray-500">Please wait for confirmation via email or contact support.</p>
      </div>
    </div>
  );
};

export default DoctorWaitingVerification;
