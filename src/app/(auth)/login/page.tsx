import LoginForm from "./_components/LoginForm";

const LoginPage = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center ">
      <div className="w-full max-w-md p-4">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
