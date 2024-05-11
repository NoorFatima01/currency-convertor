const Header = () => {
  return (
    <header className="bg-darkishBlue flex items-center justify-between p-4 text-textColor">
      <h1 className="text-3xl font-bold">Currency Convertor</h1>

      {/* log in or sign up buttons */}
      <nav>
        <ul className="flex items-center justify-between gap-3">
          <li>
            <a
              href="/login"
              className="border border-transparent hover:bg-blue-200 rounded-lg hover:text-darkishBlue  py-1 px-2"
            >
              Log in
            </a>
          </li>
          <li>
            <a
              href="/register"
              className="border border-transparent bg-blue-200 rounded-lg text-darkishBlue py-1 px-2 hover:bg-blue-300"
            >
              Sign up
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
