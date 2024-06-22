import { browserSessionPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
import { useForm } from "react-hook-form";
import { auth } from "../Firebase";
import { useNavigate } from "react-router";

type LoginForm = {
  email: string;
  password: string;
};

const LoginForm = () => {
  const { register, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const onSubmit = (data: LoginForm) => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, data.email, data.password);
      })
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/");
        console.log(user);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <section className="mt-8">
      <div className="mx-auto w-[500px] border rounded-lg bg-lightBlue">
        <h2 className="text-darkishBlue font-bold text-2xl ml-4 mt-4">
          Log in
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 px-16 py-6">
          <div className="text-darkishBlue flex flex-col space-y-4">
            <div className="grid grid-cols-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                {...register("email")}
                required
                placeholder="Email"
                className="bg-transparent border-b-4 border-darkishBlue focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                {...register("password")}
                required
                placeholder="Password"
                className="bg-transparent border-b-4 border-darkishBlue focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="border bg-blue-200 rounded-md text-darkishBlue py-1 px-2 hover:bg-blue-300"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginForm;
