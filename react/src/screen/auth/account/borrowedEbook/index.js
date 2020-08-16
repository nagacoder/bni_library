import React from 'react';
import { connect } from 'react-redux';
import Card from '../component/card';
import { Modal, NoData } from '../../../../component';
import { getBorrowedEbookItem } from '../../../../redux/action/user';

function BorrowedEbook(props) {
  let [borrowItem, setBorrowItem] = React.useState(null);
  let [showModal, setShowModal] = React.useState(false);
  let [ebookBorrowSelected, setEbookBorrowSelected] = React.useState(null);

  React.useEffect(() => {
    props.getBorrowedEbookItem().then(res => {
      if (res.resp) {
        setBorrowItem(res.data);
      }
    });
  }, []);
  function onDetailClick(data) {
    setShowModal(true);
    setEbookBorrowSelected(data);
  }

  if (borrowItem === null) return <div>Loading</div>;
  let ebooks = ebookBorrowSelected ? ebookBorrowSelected.ebook : null;
  console.log(borrowItem);
  return (
    <React.Fragment>
      <div className="bg-gray-300 uppercase text-gray-900 text-base font-semibold py-4 pl-6">
        PINJAMAN
      </div>
      <div class="bg-white rounded-lg shadow-lg pl-10 relative">
        {borrowItem &&
          borrowItem.data.map(borrow => {
            return (
              <>
                <Card
                  type="borrow"
                  data={borrow.ebook}
                  onDetailClick={() => onDetailClick(borrow)}
                />
                <div
                  className="bg-gray-600 w-full"
                  style={{
                    height: 1,
                  }}
                ></div>
              </>
            );
          })}
        {borrowItem && borrowItem.data.length === 0 && <NoData msg="Belum ada data !" />}
      </div>
      {ebooks && (
        <Modal
          title={ebookBorrowSelected.code}
          open={showModal}
          onCLose={() => {
            setShowModal(false);
          }}
          large
          handleSubmit={() => setShowModal(false)}
        >
          <div class="flex  w-full">
            <div class="flex w-4/6 text-gray-700 bg-white px-20 py-10  m-2">
              <div className="w-2/5 ">
                <div className="bg-white rounded-lg  border-gray-300">
                  <img
                    // src={`http://localhost:2000/img/images/${books.image.split('/').pop()}`}
                    src={ebooks.image}
                    alt=""
                    style={{
                      height: 440,
                      width: 300,
                    }}
                  />
                </div>
              </div>
              <div className="w-3/5 px-5">
                <div className="text-lg font-bold">{ebooks.judul}</div>
                <div
                  className="bg-gray-400 w-full mt-2"
                  style={{
                    height: 1,
                  }}
                ></div>
                <div className="flex mt-3 ">
                  <div className="flex items-center">
                    <i className="fas fa-star text-yellow-700" />
                    <i className="fas fa-star text-yellow-700" />
                    <i className="fas fa-star text-yellow-700" />
                    <i className="fas fa-star text-yellow-700" />
                    <i className="far fa-star text-yellow-700" />
                  </div>
                  <div> 4.48 (606,907 ratings by Goodreads)</div>
                </div>
                <div> Paperback | {ebooks.bahasa}</div>
                <div>{`By (author) ${ebooks.pengarang}`}</div>
                <div className="py-1 font-bold">Description:</div>
                <div>{ebooks.description}</div>
              </div>
            </div>
            <div class="w-2/6  bg-white px-10 py-10 m-2">
              <div className="text-lg font-bold">Ebook Details</div>
              <div
                className="bg-gray-400 w-full mt-2 mb-2"
                style={{
                  height: 1,
                }}
              ></div>

              <div> Author : {ebooks.pengarang}</div>
              <div> ISBN : {ebooks.isbn}</div>
              <div> Format : Hardback</div>
              <div> Publishers : {ebooks.penerbit}</div>
              <div> Publication date : {ebooks.tahunTerbit}</div>
              <div> Pages : 120</div>
              <div> Product dimensions : 172 x 223 x 24mm</div>
              <div> Condition : New</div>
            </div>
          </div>
        </Modal>
      )}
    </React.Fragment>
  );
}
export default connect(null, { getBorrowedEbookItem })(BorrowedEbook);