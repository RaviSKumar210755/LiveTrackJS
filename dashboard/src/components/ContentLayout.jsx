import { Navbar } from "@/components/navbar/NavBar";

export const ContentLayout = ({ title, children }) => {
  return (
    <div>
      <Navbar title={title} />
      <div className="container pt-8 pb-8 px-4 sm:px-8">{children}</div>
    </div>
  );
};