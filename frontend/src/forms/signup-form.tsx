import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../Firebase";
import { useForm } from "react-hook-form";
import { addDoc, collection } from "firebase/firestore";

type SignupFormSchema = {
  fullName: string;
  email: string;
  password: string;
};

const SignupForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<SignupFormSchema>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignupFormSchema) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await addDoc(collection(db, "users"), {
          uid: user.uid,
          name: data.fullName,
          authProvider: "local",
          email: data.email,
        });
        navigate("/login");
      })

      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <section className="mt-8">
      <div className="mx-auto w-[500px] border rounded-lg bg-lightBlue">
        <h2 className="text-darkishBlue font-bold text-2xl ml-4 mt-4">
          Create An Account
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 px-16 py-6">
          <div className="text-darkishBlue flex flex-col space-y-4">
            <div className="grid grid-cols-3">
              <label htmlFor="fullName" className="font-bold">
                Full Name
              </label>
              <input
                type="text"
                {...register("fullName")}
                required
                placeholder="Full Name"
                className="bg-transparent border-b-4 border-darkishBlue focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="email-address" className="font-bold">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                required
                placeholder="Email address"
                className="bg-transparent border-b-4 border-darkishBlue focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3">
              <label htmlFor="password" className="font-bold">
                Password
              </label>
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
              Sign up
            </button>
            <p>
              Already have an account?{" "}
              <NavLink
                to="/login"
                className="font-bold text-md border border-transparent rounded-md p-2 hover:bg-blue-300"
              >
                Sign in
              </NavLink>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;
