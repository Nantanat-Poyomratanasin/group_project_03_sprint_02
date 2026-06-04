import NavBar from "../components/HomeComponents/NavBar";
import Hero from "../components/HomeComponents/Hero";
import Banner from "../components/HomeComponents/Banner";
import CategorySample from "../components/HomeComponents/CategorySample";
import Footer from "../components/HomeComponents/Footer";
import Cart from "../components/HomeComponents/Cart";
import { useAuth } from "../context/AuthContext";
import { useBooks } from "../context/BookContext";
import Admin from "@/components/AdminComponents/Admin";

export default function Home() {
  const { isAdmin } = useAuth();
  const { books, isLoading: isLoadingBooks, error: bookError } = useBooks();

  return (
    <>
      {isAdmin ? (
        <Admin />
      ) : (
        <>
          <NavBar />
          <Hero books={books} isLoading={isLoadingBooks} error={bookError} />
          <Banner />
          <CategorySample
            books={books}
            isLoading={isLoadingBooks}
            error={bookError}
          />
          <Footer />
          <Cart />
        </>
      )}
    </>
  );
}
