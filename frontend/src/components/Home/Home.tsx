import RecommendedBlogs from "../BlogList/BlogList";
import Footer from "../Footer/Footer";
import Hero from "./Hero";


const HomePage = () => {
  return (


<div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        <Hero />
        <RecommendedBlogs />
      </main>
      <Footer />
    </div>

  );
};

export default HomePage;
