import React from 'react';
import { Link } from 'react-router-dom';
import ReactStars from 'react-rating-stars-component';
import { connect } from 'react-redux';
import { Modal } from '../../../../component';
import { getfavorite } from 'redux/action/books';

function FavoriteBooks(props) {
  let [showModalDeletion, setShowModalDeletion] = React.useState(false);
  let [books, setBooks] = React.useState([]);
  let { history } = props;
  function redirectToLogin() {
    history.push('/auth/login');
  }
  React.useEffect(() => {
    props.getfavorite().then(res => {
      if (res.resp) {
        setBooks(res.data);
      } else {
        setBooks([]);
      }
    });
  }, []);
  console.log(books);
  let isUserLogged = localStorage.getItem('bni_UserRole') === null;

  return (
    <React.Fragment>
      <div className="pt-24">
        <div class="container mx-auto flex items-center  pt-4 pb-12 mt-5">
          <section class="bg-gray-200 py-12 w-full">
            <Link to="/home" className="ml-10">
              <div
                className="px-10 mb-5 cursor-pointer hover:text-gray-800 text-lg"
                style={{ width: '10em' }}
              >
                {' '}
                <i className="fas fa-arrow-left"></i> Kembali
              </div>
            </Link>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 class="text-2xl font-bold leading-tight text-center lg:text-3xl">
                Populer di Baca
              </h2>

              <div class=" text-center mt-8  mx-auto md:flex items-center justify-center">
                {books.length !== 0 &&
                  books.ratingBook.map((data, key) => {
                    let book = data.book;
                    return (
                      <div key={key} className="w-full md:w-1/3 xl:w-1/4 p-6 flex flex-col">
                        <img className="hover:grow hover:shadow-lg h-64" src={book.image} />
                        <div className="h-16 pt-1 flex items-start justify-between">
                          <h2 className="text-gray-800 text-lg">{book.judul}</h2>
                        </div>

                        <div className="pt-1 text-gray-900">{book.pengarang}</div>
                        <div className="flex items-center justify-between">
                          <ReactStars
                            count={6}
                            // isHalf={false}
                            value={
                              book.totalRead
                                ? book.countRating
                                  ? book.countRating / book.totalRead
                                  : 0
                                : 0
                            }
                            size={20}
                            activeColor="#ffd700"
                          />
                          <span>
                            <i className="fas fa-eye text-yellow-700" />{' '}
                            {book.totalRead ? book.totalRead : 0}
                          </span>
                        </div>
                        <Link to={`/detail-book?id=${book.id}`}>
                          <button className="w-full bg-orange-500 text-white  rounded-lg my-6 py-2 px-10 shadow-lg">
                            Detail
                          </button>
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          </section>
        </div>
      </div>
      <Modal
        title="Authentication required"
        open={showModalDeletion}
        onCLose={() => {
          setShowModalDeletion(false);
        }}
        handleSubmit={redirectToLogin}
      >
        <div className="my-5">Silahkan Login terlebih dahulu</div>
      </Modal>
    </React.Fragment>
  );
}

export default connect(null, {
  getfavorite,
})(FavoriteBooks);