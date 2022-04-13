type BookStoreResponse = {
    books: Array<ITBooks>;
};

type ITBooks = {
    title: string;
    subtitle: string;
    price: string;
    image: string;
}

export {ITBooks, BookStoreResponse};