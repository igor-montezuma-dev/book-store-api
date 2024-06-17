import BookJson from "./bookStore.books.json" assert { type: "json" };
import book from "./models/book.js";

export const seedBooksData = async () => {
  try {
    await book.deleteMany({});
    await book.insertMany(BookJson);
    console.log("Books seeded successfully");
  } catch (error) {
    console.error("Error seeding books data", error);
  }
};
