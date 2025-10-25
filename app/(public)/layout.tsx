import NavWrapper from "@/components/layout/NavWrapper";
import Footer from "@/components/layout/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavWrapper isAuthPage={false} />
      {children}
      <Footer />
    </>
  );
}
