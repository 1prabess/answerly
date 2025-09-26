import RegisterForm from "./_components/RegisterForm";

const RegisterPage = () => {
  return (
    <div className="flex flex-col items-center mt-20 justify-center gap-6 p-2 md:p-10">
      <div className="w-full max-w-md flex flex-col gap-6 mx-auto">
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;
