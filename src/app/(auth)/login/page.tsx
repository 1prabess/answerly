import LoginForm from "./_components/LoginForm";

const LoginPage = () => {
  return (
    <div className="flex flex-col mt-20 items-center justify-center gap-6 p-2 md:p-10">
      <div className="w-full max-w-md flex flex-col gap-6 mx-auto">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
