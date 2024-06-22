import { getAuth, signOut } from "firebase/auth";

const Header = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log(user);

  const signOutFunction = () => {
    signOut(auth).then(() => {
      console.log("signed out");
      window.location.reload();
    }).catch((error: unknown) => {
      console.log(error);
    });
  }
  return (
    <header className="bg-darkishBlue flex items-center justify-between p-4 text-textColor">
      <h1 className="text-3xl font-bold">Currency Convertor</h1>

      {/* log in or sign up buttons */}
      <nav>
        <ul className="flex items-center justify-between gap-3">
          {!user && (
            <li>
              <a
                href="/login"
                className="border border-transparent hover:bg-blue-200 rounded-lg hover:text-darkishBlue  py-1 px-2"
              >
                Log in
              </a>
            </li>
          )}
          {!user && (
            <li>
              <a
                href="/register"
                className="border border-transparent bg-blue-200 rounded-lg text-darkishBlue py-1 px-2 hover:bg-blue-300"
              >
                Sign up
              </a>
            </li>
          )}

          {user && (
            <li>
              <button
                onClick={() => {
                  signOutFunction();
                }}
                className="border border-transparent bg-blue-200 rounded-lg text-darkishBlue py-1 px-2 hover:bg-blue-300"
              >
                Sign out
              </button>
            </li>
          )}

          {user && (
            <li>
              <a
                href="/my-history"
                className="border border-transparent bg-blue-200 rounded-lg text-darkishBlue py-1 px-2 hover:bg-blue-300"
              >
                My History
              </a>
            </li>
          )}

          {user && (
            <li>
              <p className="border border-transparent bg-blue-200 rounded-lg text-darkishBlue py-1 px-2 hover:bg-blue-300">
                {user.displayName}
              </p>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
