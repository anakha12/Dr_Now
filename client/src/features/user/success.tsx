
const Success = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h2 className="text-2xl font-bold text-green-600 mb-4">Appointment Confirmed!</h2>
        <p className="text-gray-700">
          Thank you for booking. Your appointment has been successfully scheduled.
        </p>
      </div>
    </div>
  );
};

export default Success;
