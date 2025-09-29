import RegisterForm from "./_components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div className="w-full max-w-md p-4">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
